import { Module } from '@nestjs/common';
import { DrizzleModule } from '~/drizzle/drizzle.module';
import { AuthGuard } from '~/guards/auth.guard';
import { UserController } from '~/user/user.controller';
import { UserService } from '~/user/user.service';

@Module({
  imports: [DrizzleModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
})
export class UserModule {}
