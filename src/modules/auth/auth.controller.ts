import {
  Controller,
  Body,
  Post,
  HttpCode,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import * as R from 'ramda';
import { CreateUserDto } from '../users/user.dto';
import { User } from './../users/user.entity';
import { AuthService } from './auth.service';

import { DoesUserExist } from '../../core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(202)
  @Post('signin')
  async login(@Body() user: User) {
    try {
      return await this.authService.login(user);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @UseGuards(DoesUserExist)
  @HttpCode(201)
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    try {
      return await this.authService.create(user);
    } catch (error) {
      throw new BadRequestException({
        message: [error.message],
      });
    }
  }
}
