import { Model } from 'sequelize-typescript';
import { IResMeta } from './resMeta.interface';
import { IMeta } from './meta.interface';

export interface IEntities {
  entities: Model[];
  meta: Partial<IMeta>;
  api: IResMeta;
}
