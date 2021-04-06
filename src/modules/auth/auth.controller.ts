import { Request } from 'express';
import {
  Controller,
  Body,
  Post,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { authEntitySerializer } from '@Core/helpers';
import { CreateUserDto } from '../users/user.dto';
import { User } from '../users/user.entity';
import { IAuthEntity } from '../auth/auth.interfaces';
import { AuthService } from './auth.service';
import { DoesUserExist } from '../../validators/doesUserExist.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(202)
  @Post('signin')
  async login(
    @Body() user: User,
    @Req() request: Request,
  ): Promise<IAuthEntity> {
    const { validatedUser, access_token } = await this.authService.login(user);
    return authEntitySerializer(validatedUser, request, { access_token });
  }

  @UseGuards(DoesUserExist)
  @HttpCode(201)
  @Post('signup')
  async signUp(
    @Body() user: CreateUserDto,
    @Req() request: Request,
  ): Promise<IAuthEntity> {
    const { createdUser, access_token } = await this.authService.create(user);
    return authEntitySerializer(createdUser, request, { access_token });
  }
}
