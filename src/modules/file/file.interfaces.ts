import { fileTypes } from './file.enums';
export interface IFile {
  name: string;
  path: string;
  url: string;
  type: fileTypes;
}

export interface IAvatar extends IFile {
  userId: number;
}
