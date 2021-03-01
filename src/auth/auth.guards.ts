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

    const savedUser: User = await this.userService.findByEmail(user.email);
    return savedUser && roles.includes(savedUser.role);
  }
}
