import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtensionRequestInterface } from '~/user/ExtensionRequestInterface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExtensionRequestInterface>();
    if (request.user) {
      return true;
    }
    throw new HttpException('no authorized', HttpStatus.UNAUTHORIZED);
  }
}
