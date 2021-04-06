import { IServiceError } from '../interfaces/service.error';
export class ServiceError implements IServiceError {
  public response;
  public message;
  constructor(public readonly serviceError: IServiceError) {
    this.response = {
      statusCode: serviceError.response.statusCode,
    };
    this.message = serviceError.message;
  }
}
