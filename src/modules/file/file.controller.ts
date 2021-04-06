import { roles } from './../users/user.enum';
import { JwtAuthGuard, RolesGuard } from './../auth/auth.guards';
import { hasRoles } from './../auth/auth.decorators';
import { FileService } from './file.services';
import { getFileModel, actionSuccessSerializer } from './../../core/helpers';
import { IEntity } from '@Core/interfaces/entity.interface';
import { entitiesSerializer, entitySerializer } from '@Core/helpers';
import * as R from 'ramda';
import { FILE_TYPES } from '@Core/constants';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { getUploadConfig } from './file.storage';
import { IEntities } from '@Core/interfaces/entities.interface';
import { Action } from '@Core/enums/action.enum';

@Controller('upload')
export class FileController {
  constructor(private fileService: FileService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin)
  @Get()
  async getImages(@Req() request: Request): Promise<IEntities> {
    const { count, rows } = await this.fileService.getEntities();

    return entitiesSerializer(rows, count, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin, roles.Moderator)
  @Post('images')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image', getUploadConfig(FILE_TYPES.IMAGES)))
  async imageUpload(
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ): Promise<IEntity> {
    const uploadedImage = await this.fileService.createEntity(
      getFileModel(image),
    );

    return entitySerializer(uploadedImage, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin, roles.Moderator)
  @Post('videos')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('video', getUploadConfig(FILE_TYPES.VIDEOS)))
  async videoUpload(
    @UploadedFile() video: Express.Multer.File,
    @Req() request: Request,
  ): Promise<IEntity> {
    const uploadedImage = await this.fileService.createEntity(
      getFileModel(video),
    );

    return entitySerializer(uploadedImage, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin, roles.Moderator)
  @Post('docs')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('document', getUploadConfig(FILE_TYPES.DOCS)),
  )
  async docUpload(
    @UploadedFile() document: Express.Multer.File,
    @Req() request: Request,
  ): Promise<IEntity> {
    const uploadedImage = await this.fileService.createEntity(
      getFileModel(document),
    );

    return entitySerializer(uploadedImage, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin)
  @Delete('file')
  @HttpCode(201)
  async removeFile(@Param('id') id: number, @Req() request: Request) {
    const fileForDeleting = await this.fileService.findEntityById(id);
    console.log(fileForDeleting);
    const filePath: string = R.path(['path'], fileForDeleting);

    await this.fileService.removeFile(filePath, id);

    return actionSuccessSerializer(request, Action.DELETED);
  }
}
