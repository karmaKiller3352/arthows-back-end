import { messages } from '../locales/en';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';

import * as mongoose from 'mongoose';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let error = exception;
    if (exception instanceof mongoose.Error.CastError) {
      switch (exception.kind) {
        case 'ObjectId': {
          error = new NotFoundException(messages.errors.id);
          response.status(404);
        }
      }
    }

    if (exception instanceof mongoose.Error.ValidationError) {
      error = new BadRequestException(error.message);
    }

    const status = exception.getStatus();
    response.status(status || 400);

    response.json(error);
  }
}
