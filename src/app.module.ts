import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { DrizzleModule } from '~/drizzle/drizzle.module';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), DrizzleModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
