import { IResponse } from './response.interface';
import { IResMeta } from './resMeta.interface';
export interface ISuccess {
  response: IResponse;

  api: IResMeta;
}
