import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { CreateUserDTO } from '~/user/createUserDTO';
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

  async getUser(email: string) {
    const foundedUser = await this.drizzle.db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });
    return foundedUser;
  }

  async createUser(body: CreateUserDTO) {
    const { firstName, lastName, email, password } = body;
    const foundedUser = await this.getUser(email);
    if (foundedUser) {
      throw new HttpException('User with such email already exists', HttpStatus.CONFLICT);
    }
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const createdUser = await this.drizzle.db
        .insert(userTable)
        .values({ firstName, lastName, email, password: hash })
        .returning();
      const payload = { sub: createdUser[0].id, username: createdUser[0].email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
