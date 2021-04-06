import { IEntity } from '@Core/interfaces/entity.interface';

export interface ITokens {
  access_token: string;
  refresh_token?: string;
}

export interface IAuthEntity extends IEntity {
  tokens: ITokens;
}
