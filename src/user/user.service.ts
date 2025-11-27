import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { AuthUserDTO, CreateUserDTO, UpdateUserDTO, UserType } from '~/user/userDTO';
import * as bcrypt from 'bcrypt';
import { userTable } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzle: DrizzleService,
    private jwtService: JwtService
  ) {}

  private async getToken(user: UserType): Promise<{ token: string }> {
    const payload = { id: user.id, email: user.email };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async getUser(field: string, value: string | number) {
    return this.drizzle.db.query.userTable.findFirst({
      where: eq(userTable[field] as any, value),
    });
  }

  async createUser(body: CreateUserDTO): Promise<{ token: string }> {
    const { firstname, lastname, email, password } = body;
    const foundedUser = await this.getUser('email', email);
    if (foundedUser) {
      throw new HttpException('User with such email already exists', HttpStatus.CONFLICT);
    }
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      const createdUser = await this.drizzle.db
        .insert(userTable)
        .values({ firstname, lastname, email, password: hash })
        .returning();

      const token = await this.getToken(createdUser[0]);
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
  async login(body: AuthUserDTO): Promise<{ token: string }> {
    const user = await this.getUser('email', body.email);
    if (!user) {
      throw new HttpException('Email or password are not correct', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException('Email or password are not correct', HttpStatus.BAD_REQUEST);
    }

    return this.getToken(user);
  }
  async update(body: UpdateUserDTO, currentUserId: number) {
    try {
      const updatedUser = await this.drizzle.db
        .update(userTable)
        .set(body)
        .where(eq(userTable.id, currentUserId))
        .returning({
          firstname: userTable.firstname,
          lastname: userTable.lastname,
          email: userTable.email,
        });
      return updatedUser;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
