import { roles as rolesArr } from '../users/enums/roles.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { User } from '../users/user.schema';
import { UserService } from './../users/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const savedUser = await this.userService.findByEmail(user.email);
    if (!savedUser) return false;

    if (savedUser.role === rolesArr.Admin) return true;

    // add check just user can change own data
    if (request.route.path === '/users/:id') {
      const id = request?.params?.id;
      return roles.includes(savedUser.role) && id == savedUser['_id'];
    }

    return roles.includes(savedUser.role);
  }
}
