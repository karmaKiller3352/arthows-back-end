import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import * as R from 'ramda';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception;
    const status = R.prop('getStatus', exception) ? exception.getStatus() : 400;

    response.status(status);
    response.json(error);
  }
}
