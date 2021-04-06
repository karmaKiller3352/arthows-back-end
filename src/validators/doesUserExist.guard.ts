import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const entity = await this.validateRequest(request);
    return R.isNil(entity);
  }

  async validateRequest(request: Request) {
    return await this.userService.findEntityByField(
      'email',
      request.body.email,
      [],
      true,
    );
  }
}
