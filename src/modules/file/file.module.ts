import { UsersModule } from './../users/users.module';
import { FileService } from './file.services';
import { Module, forwardRef } from '@nestjs/common';
import { FileController } from './file.controller';
import { fileProviders } from './file.providers';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [FileController],
  providers: [FileService, ...fileProviders],
  exports: [FileService],
})
export class FileModule {}
