import { messages } from '../locales/en';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as R from 'ramda';

import * as mongoose from 'mongoose';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error = exception;
    if (exception instanceof mongoose.Error.CastError) {
      error = new NotFoundException(messages.errors.id);
      response.status(404);
    }

    if (exception instanceof mongoose.Error.ValidationError) {
      error = new BadRequestException(error.message);
    }

    const status = R.prop('getStatus', exception) ? exception.getStatus() : 400;

    response.status(status);
    response.json(error);
  }
}
