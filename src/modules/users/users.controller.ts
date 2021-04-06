import { File } from '../file/file.entity';
import { FileService } from '../file/file.services';
import { getAvatarModel } from '@Core/helpers';
import { FILE_TYPES } from '@Core/constants';
import { getUploadConfig } from './../file/file.storage';
import * as R from 'ramda';
import { ExceptionsFilter } from '../../validators/exceptions.filter';
import { ISuccess } from '@Core/interfaces/success.interface';
import { actionSuccessSerializer } from '@Core/helpers';
import { SEARCH_FIELDS } from '@Core/constants';
import { IEntity } from '@Core/interfaces/entity.interface';
import {
  entitySerializer,
  proccessRequest,
  entitiesSerializer,
} from '@Core/helpers';
import { IEntities } from '@Core/interfaces/entities.interface';
import {
  Controller,
  HttpCode,
  Get,
  UseGuards,
  Param,
  Delete,
  Put,
  Body,
  Patch,
  Req,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { Request } from 'express';
import { UsersService } from './users.service';
import { roles } from './user.enum';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserRole,
} from './user.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guards';
import { hasRoles } from '../auth/auth.decorators';
import { Action } from '@Core/enums/action.enum';

import { FileInterceptor } from '@nestjs/platform-express';

@UseFilters(ExceptionsFilter)
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private fileService: FileService,
  ) {}

  @HttpCode(200)
  @Get()
  async getList(@Req() request: Request): Promise<IEntities> {
    const { buildedQuery } = proccessRequest(request, SEARCH_FIELDS.USER);
    const { count, rows } = await this.userService.getEntities(
      buildedQuery,
      ['password'],
      File,
    );

    return entitiesSerializer(rows, count, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin)
  @HttpCode(200)
  @Get(':id')
  async getUser(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<IEntity> {
    const user = await this.userService.findEntityById(
      id,
      ['password'],
      [File],
    );
    return entitySerializer(user, request);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin)
  @Delete(':id')
  async removeUser(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<ISuccess> {
    await this.userService.removeEntityById(id);
    return actionSuccessSerializer(request, Action.DELETED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.Admin)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
    @Req() request: Request,
  ): Promise<ISuccess> {
    await this.userService.updateEntityById(id, { user }, ['name']);
    return actionSuccessSerializer(request, Action.UPDATED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.User)
  @Patch(':id/change_password')
  async updatePassword(
    @Param('id') id: number,
    @Body() user: UpdateUserPasswordDto,
    @Req() request: Request,
  ): Promise<ISuccess> {
    await this.userService.updatePassword(user.oldPass, user.newPass, id);
    return actionSuccessSerializer(request, Action.UPDATED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.Admin)
  @Patch(':id/change_role')
  async changeRole(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() user: UpdateUserRole,
  ): Promise<ISuccess> {
    await this.userService.updateRole(id, user.role);
    return actionSuccessSerializer(request, Action.UPDATED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.User)
  @UseInterceptors(
    FileInterceptor('avatar', getUploadConfig(FILE_TYPES.IMAGES)),
  )
  @Patch(':id/change_avatar')
  async changeAvatar(
    @Param('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() request: Request,
  ): Promise<IEntity> {
    const userForUpdate = await this.userService.findEntityById(id, [], [File]);

    const oldUserAvatarPath: string = R.path(['avatar.path'], userForUpdate);
    const oldUserAvatarId: number = R.path(['avatar.id'], userForUpdate);

    if (!R.isNil(oldUserAvatarId)) {
      await this.fileService.removeFile(oldUserAvatarPath, oldUserAvatarId);
    }

    const createdAvatar = await this.fileService.createEntity(
      getAvatarModel(avatar, id),
    );

    return entitySerializer(createdAvatar, request);
  }
}
