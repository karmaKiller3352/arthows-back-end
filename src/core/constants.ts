import { Action } from './enums/action.enum';

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const FILE_REPOSITORY = 'FILE_REPOSITORY';

export const DEFAULT_PAGE_NUMBER = 1;

export const DEFAULT_PER_PAGE = 20;

export const SEARCH_FIELDS = {
  USER: ['name', 'email'],
};

export const BASE_LINKS = {
  avatar: '/upload/images/',
  image: '/upload/images/',
  video: '/upload/videos/',
  document: '/upload/docs/',
};

export const RESPONSE_MESSAGE = {
  [Action.UPDATED]: 'Entity was updated',
  [Action.DELETED]: 'Entity was deleted',
};

export const FILE_TYPES = {
  IMAGES: 'IMAGES',
  DOCS: 'DOCS',
  VIDEOS: 'VIDEOS',
};
