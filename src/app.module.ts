import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { DrizzleModule } from '~/drizzle/drizzle.module';
import { UserMiddleware } from '~/user/user.middleware';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    DrizzleModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
