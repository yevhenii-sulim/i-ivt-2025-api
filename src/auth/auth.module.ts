import { Module } from '@nestjs/common';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { DrizzleModule } from '~/drizzle/drizzle.module';
import { AuthGuard } from '~/guards/auth.guard';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [DrizzleModule, UserModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
})
export class AuthModule {}
