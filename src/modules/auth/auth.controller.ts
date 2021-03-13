import {
  Controller,
  Body,
  Post,
  HttpCode,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import * as R from 'ramda';
import { CreateUserDto } from '../users/user.dto';
import { User } from './../users/user.entity';
import { AuthService } from './auth.service';

import { DoesUserExist } from './../../core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(202)
  @Post('signin')
  async login(@Body() user: User) {
    const checkedUser = await this.authService.login(user);

    if (R.isNil(checkedUser.user)) {
      throw new UnauthorizedException('Wrong credentilas');
    }
    return await this.authService.login(user);
  }

  @UseGuards(DoesUserExist)
  @HttpCode(201)
  @Post('signup')
  async signUp(@Body() user: CreateUserDto) {
    return await this.authService.create(user);
  }
}
