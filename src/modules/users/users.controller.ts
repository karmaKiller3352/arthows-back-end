import { UpdateUserDto } from './user.dto';
import {
  Controller,
  HttpCode,
  Get,
  UseGuards,
  Param,
  UnauthorizedException,
  NotFoundException,
  Delete,
  Put,
  Body,
  NotImplementedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { roles } from './user.enum';
import * as R from 'ramda';
import { User } from './user.entity';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guards';
import { hasRoles } from '../auth/auth.decorators';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(roles.Admin)
  @HttpCode(200)
  @Get()
  async getList(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | Error> {
    const user = await this.userService.findOneById(id);

    if (R.isNil(user)) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @hasRoles(roles.Admin)
  @Delete(':id')
  async removeUser(@Param('id') id: number): Promise<User | Error> {
    const user = await this.userService.removeById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.Admin)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<any | Error> {
    const updatedUser = await this.userService.updateById(id, user);
    const updatedCount = R.path([0], updatedUser);
    if (updatedCount === 0) {
      throw new BadRequestException('User was not updated');
    }

    return {
      status: 'OK',
      message: 'User was updated',
    };
  }
}
