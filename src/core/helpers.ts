import { IAvatar } from '../modules/file/file.interfaces';
import { IFile } from '../modules/file/file.interfaces';
import { IAuthEntity, ITokens } from '../modules/auth/auth.interfaces';
import { Status } from './enums/status.enum';
import { IResMeta } from './interfaces/resMeta.interface';
import { ISuccess } from './interfaces/success.interface';
import { Action } from './enums/action.enum';
import { IEntity } from './interfaces/entity.interface';
import { Model } from 'sequelize-typescript';
import { Request } from 'express';
import * as R from 'ramda';
import { Op } from 'sequelize';

import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PER_PAGE,
  RESPONSE_MESSAGE,
} from './constants';
import { IEntities } from './interfaces/entities.interface';
import { IMeta } from './interfaces/meta.interface';
import { IQueryParams } from './interfaces/query.interface';
import { BASE_LINKS } from '@Core/constants';
import { fileTypes } from '../modules/file/file.enums';

const getParamsFromQuery = (query: any): IQueryParams => {
  return {
    page: Number(R.prop('page', query))
      ? Number(R.prop('page', query))
      : DEFAULT_PAGE_NUMBER,

    perPage: Number(R.prop('perPage', query))
      ? Number(R.prop('perPage', query))
      : DEFAULT_PER_PAGE,

    search: R.prop('search', query) || null,
  };
};

export const serializeApi = (request: Request): IResMeta => {
  const { query: q, method } = request;
  const endpoint = R.pathOr(request.url, ['route', 'path'], request);
  return {
    endpoint,
    method,
    query: R.isEmpty(q) ? null : q,
  };
};

export const proccessRequest = (request: Request, searchFields: string[]) => {
  const { query } = request;
  const { page, perPage, search } = getParamsFromQuery(query);

  // TO DO: think about searchValue str.length
  const fieldIterator = R.map(
    (field) => ({
      [field]: {
        [Op.iLike]: `%${search}%`,
      },
    }),

    searchFields,
  );

  const searchQuery = R.isNil(search)
    ? {}
    : { where: { [Op.or]: fieldIterator } };

  return {
    searchQuery,
    buildedQuery: {
      offset: (page - 1) * perPage,
      limit: perPage,
      ...searchQuery,
    },
  };
};

export const entitiesSerializer = (
  response: any[],
  entitiesCount: number,
  request: Request,
): IEntities => {
  const { query } = request;
  const { page, perPage, search } = getParamsFromQuery(query);
  const currentPageCount = R.length(response);

  const meta: IMeta = {
    searchValue: search,
    currentPage: page,
    perPage,
    currentPageCount,
    allPagesCount: Math.ceil(entitiesCount / perPage),
    entitiesCount,
  };

  return {
    meta,
    api: serializeApi(request),
    entities: response,
  };
};

export const authEntitySerializer = (
  response: Model,
  request: Request,
  tokens: ITokens,
): IAuthEntity => {
  const entity = entitySerializer(response, request);
  return {
    ...entity,
    tokens,
  };
};

export const entitySerializer = (
  response: Model,
  request: Request,
): IEntity => ({
  api: serializeApi(request),
  entity: response,
});

export const actionSuccessSerializer = (
  request: Request,
  action: Action,
): ISuccess => ({
  response: {
    status: Status.OK,
    message: RESPONSE_MESSAGE[action],
  },
  api: serializeApi(request),
});

export const getFileModel = (file: Express.Multer.File): IFile => ({
  name: file.filename,
  path: file.path,
  type: fileTypes[file.fieldname],
  url: BASE_LINKS[file.fieldname] + file.filename,
});

export const getAvatarModel = (
  file: Express.Multer.File,
  userId: number,
): IAvatar => {
  return {
    name: file.filename,
    path: file.path,
    type: fileTypes.image,
    url: BASE_LINKS.image + file.filename,
    userId,
  };
};
