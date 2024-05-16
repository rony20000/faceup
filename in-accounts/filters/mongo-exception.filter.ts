import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 11000: {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: ['the given access key is already in use'],
          error: 'Bad Request',
        });
      }
      default: {
        throw exception;
      }
    }
  }
}
