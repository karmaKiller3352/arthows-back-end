import { FileService } from '../file/file.services';
import { FileModule } from '../file/file.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { fileProviders } from '../file/file.providers';

@Module({
  imports: [FileModule],
  providers: [UsersService, FileService, ...fileProviders, ...usersProviders],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
