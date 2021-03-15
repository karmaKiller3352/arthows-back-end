import {
  Controller,
  HttpCode,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Delete,
  Put,
  Body,
  BadRequestException,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { roles } from './user.enum';
import { User } from './user.entity';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserRole,
} from './user.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/auth.guards';
import { hasRoles } from '../auth/auth.decorators';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(200)
  @Get()
  async getList(@Query() query): Promise<User[]> {
    return await this.userService.getUsers(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User | Error> {
    try {
      const user = await this.userService.findOneById(id);

      return user;
    } catch (error) {
      throw new NotFoundException([error.message]);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @hasRoles(roles.Admin)
  @Delete(':id')
  async removeUser(@Param('id') id: number): Promise<User | Error> {
    try {
      const user = await this.userService.removeById(id);
      return user;
    } catch (error) {
      throw new NotFoundException([error.message]);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.Admin)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<any> {
    try {
      await this.userService.updateById(id, user);

      return {
        status: 'OK',
        message: 'User was updated',
      };
    } catch (error) {
      throw new BadRequestException({
        message: [error.message],
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.User)
  @Patch(':id/change_password')
  async updatePassword(
    @Param('id') id: number,
    @Body() user: UpdateUserPasswordDto,
  ): Promise<any> {
    try {
      await this.userService.updatePassword(user.oldPass, user.newPass, id);

      return {
        status: 'OK',
        message: 'Password was updated',
      };
    } catch (error) {
      throw new BadRequestException({
        message: [error.message],
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(201)
  @hasRoles(roles.Admin)
  @Patch(':id/change_role')
  async changeRole(@Param('id') id: number, @Body() user: UpdateUserRole) {
    try {
      await this.userService.updateRole(id, user.role);

      return {
        status: 'OK',
        message: 'Role was updated',
      };
    } catch (error) {
      throw new BadRequestException({
        message: [error.message],
      });
    }
  }
}
