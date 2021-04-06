import { File } from './file.entity';
import { unlink } from 'fs';
import { FILE_REPOSITORY } from '@Core/constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseService } from '@Core/services/base.service';
import * as path from 'path';

const absolutePath = path.resolve('./');

@Injectable()
export class FileService extends BaseService<File> {
  constructor(@Inject(FILE_REPOSITORY) fileRepository: typeof File) {
    super(fileRepository);
  }

  async removeFile(link: string, id: number) {
    const destroyLink = path.join(absolutePath, link);
    await unlink(destroyLink, (err) => {
      Logger.warn(err);
      Logger.warn(`${destroyLink} was deleted`, 'Image service');
    });

    await this.removeEntityById(id);
  }
}
