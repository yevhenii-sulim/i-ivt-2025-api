import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { UserController } from '~/user/user.controller';
import { UserService } from '~/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, DrizzleService],
})
export class UserModule {}
