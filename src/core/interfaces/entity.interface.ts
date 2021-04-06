import { Model } from 'sequelize-typescript';
import { IResMeta } from './resMeta.interface';

export interface IEntity {
  entity: Model;
  api: IResMeta;
}
