import { FILE_REPOSITORY } from '@Core/constants';
import { File } from './file.entity';

export const fileProviders = [
  {
    provide: FILE_REPOSITORY,
    useValue: File,
  },
];
