import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (error instanceof HttpException) {
      return response.status(error.getStatus()).json({ message: error.getResponse() });
    }

    if (error.code === '23505') {
      return response.status(409).json({ message: 'User already exists' });
    }

    response.status(500).json({ message: 'Internal server error' });
  }
}
