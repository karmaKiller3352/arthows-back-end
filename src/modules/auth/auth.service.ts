import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as R from 'ramda';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(user) {
    const validUser = await this.userService.findOneByEmail(user.email);
    if (!validUser) {
      return null;
    }

    const match = await this.comparePasswords(
      user.password,
      validUser.password,
    );

    if (!match) {
      return null;
    }

    const { password, ...result } = R.path(['dataValues'], validUser);
    return result;
  }

  public async login(user) {
    const validatedUser = await this.validateUser(user);
    const access_token = await this.generateJWT(user);
    return { user: validatedUser, access_token };
  }

  public async create(user) {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.userService.create({ ...user, password: pass });
    const { password, ...result } = newUser['dataValues'];

    const access_token = await this.generateJWT(result);
    return { user: result, access_token };
  }

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
