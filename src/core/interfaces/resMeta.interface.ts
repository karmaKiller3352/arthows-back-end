import { IQueryParams } from './query.interface';

type query<T> = T | null;
export interface IResMeta {
  endpoint: string;
  method: string;

  query: query<IQueryParams | any>;
}
