import { roles as rolesArr } from '../users/user.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as R from 'ramda';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const savedUser = await this.userService.findEntityByField(
      'email',
      user.email,
      [],
      true,
    );
    if (!savedUser) return false;

    if (savedUser.role === rolesArr.Admin) return true;

    const id = R.pathOr(false, ['params', 'id'], request);

    // add check just user can change own data
    if (id) {
      return roles.includes(savedUser.role) && id == savedUser.id;
    }

    return roles.includes(savedUser.role);
  }
}
