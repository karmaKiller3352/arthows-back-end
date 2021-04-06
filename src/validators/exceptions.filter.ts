import { serializeApi } from '@Core/helpers';
import { Status } from '@Core/enums/status.enum';
import { IFailure } from '@Core/interfaces/failure.interface';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import * as R from 'ramda';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const error = exception;

    const statusCode: number = R.path(['response', 'statusCode'], error) || 400;
    const failure: IFailure = {
      response: {
        status: Status.BAD,
        message: error.message,
      },
      api: serializeApi(request),
    };

    return response.status(statusCode).json(failure);
  }
}
