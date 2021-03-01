import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as _ from 'lodash';

import { CreateUserDto } from './user.dto';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
export class UsersActionController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(202)
  @Post('/sign-in')
  async login(@Body() credentials: User, @Req() request): Promise<any> {
    try {
      const { access_token, user } = await this.userService.login(credentials);

      const accessTokenCookie = `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRES',
      )}`;
      if (user) request.res.setHeader('Set-Cookie', [accessTokenCookie]);

      return user;
    } catch (error) {
      return error;
    }
  }

  @HttpCode(201)
  @Post('/sign-up')
  registration(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @Post('/sign-out')
  @HttpCode(200)
  logout(@Req() request) {
    const logoutAccessTokenCookie =
      'Authentication=; HttpOnly; Path=/; Max-Age=0';
    request.res.setHeader('Set-Cookie', [logoutAccessTokenCookie]);
  }
}
