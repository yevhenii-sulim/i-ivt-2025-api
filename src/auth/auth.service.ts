import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { AuthUserDTO, CreateUserDTO, UpdateUserDTO } from '~/auth/authUserDTO';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { userTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { UserService } from '~/user/user.service';
import { UserType } from '~/user/userType';

@Injectable()
export class AuthService {
  constructor(
    private readonly drizzle: DrizzleService,
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  private async getToken(user: UserType): Promise<{ token: string }> {
    const payload = { id: user.id, email: user.email };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async createUser(body: CreateUserDTO): Promise<{ token: string }> {
    const { firstname, lastname, email, password } = body;
    const foundedUser = await this.userService.getUser('email', email);
    if (foundedUser) {
      throw new HttpException('User with such email already exists', HttpStatus.CONFLICT);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await this.drizzle.db
      .insert(userTable)
      .values({ firstname, lastname, email, password: hash })
      .returning();

    const token = await this.getToken(createdUser[0]);
    return token;
  }

  async login(body: AuthUserDTO): Promise<{ token: string }> {
    const user = await this.userService.getUser('email', body.email);
    if (!user) {
      console.log('user');
      throw new HttpException('Email or password are not correct', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException('Email or password are not correct', HttpStatus.BAD_REQUEST);
    }

    return this.getToken(user);
  }

  async update(
    body: UpdateUserDTO,
    currentUserId: number | null
  ): Promise<{ [key: string]: string }> {
    if (!currentUserId) {
      throw new UnauthorizedException();
    }
    if (body.password) {
      const salt = await bcrypt.genSalt();
      body.password = await bcrypt.hash(body.password, salt);
    }
    const updatedUser = await this.drizzle.db
      .update(userTable)
      .set(body)
      .where(eq(userTable.id, currentUserId))
      .returning({
        firstname: userTable.firstname,
        lastname: userTable.lastname,
        email: userTable.email,
      });
    return updatedUser[0];
  }
}
