import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExtensionRequestInterface } from '~/user/ExtensionRequestInterface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '~/user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}
  async use(req: ExtensionRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const currentUser = await this.userService.getUser('id', payload.id);

      if (currentUser) {
        const { password, ...user } = currentUser;
        req.user = user;
      }
      return next();
    } catch (error) {
      console.log('error', error);
      req.user = null;
      return next();
    }
  }
}
