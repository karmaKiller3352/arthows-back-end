import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  comparePasswords(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }
}
