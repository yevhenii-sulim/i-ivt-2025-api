import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch()
export class DbExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (error.code === 'ECONNREFUSED') {
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        message: 'Database unavailable',
      });
    }

    if (error.code === '23505') {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'Record already exists',
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal database error' });
  }
}
