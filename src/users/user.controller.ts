import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.schema';
import { JwtAuthGuard, RolesGuard } from './../auth/auth.guards';
import { hasRoles } from '../auth/auth.decorators';
import { roles } from './enums/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    try {
      return this.userService.getAll();
    } catch (error) {
      return error;
    }
  }

  @hasRoles(roles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @hasRoles(roles.Admin, roles.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @hasRoles(roles.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.removeById(id);
  }

  @hasRoles(roles.Admin, roles.User, roles.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  update(
    @Body() updateUsertDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.updateById(id, updateUsertDto);
  }
}
