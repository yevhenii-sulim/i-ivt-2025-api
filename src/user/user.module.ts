import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DrizzleService } from '~/drizzle/drizzle.service';
import { AuthGuard } from '~/guards/auth.guard';
import { UserController } from '~/user/user.controller';
import { UserService } from '~/user/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, DrizzleService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
