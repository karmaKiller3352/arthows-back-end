import { IResponse } from './response.interface';
import { IResMeta } from './resMeta.interface';
export interface IFailure {
  response: IResponse;

  api: IResMeta;
}
