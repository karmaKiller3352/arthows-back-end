import { SERVICE_ERROR } from './../../core/errors/service.errors';
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

    const match = await this.comparePasswords(
      user.password,
      validUser.password,
    );

    if (!match) {
      throw new Error(SERVICE_ERROR.USER.WRONG_CREDENTIALS);
    }

    return R.omit(['password'], R.path(['dataValues'], validUser));
  }

  public async login(user) {
    const validatedUser = await this.validateUser(user);
    const access_token = await this.generateJWT(user);
    return { user: validatedUser, access_token };
  }

  public async create(user) {
    const pass = await this.hashPassword(user.password);

    const newUser = await this.userService.create({ ...user, password: pass });

    const access_token = await this.generateJWT(newUser['dataValues']);
    return { user: R.omit(['password'], newUser['dataValues']), access_token };
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
