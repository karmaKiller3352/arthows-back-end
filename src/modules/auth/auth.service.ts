import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ServiceError } from '@Core/errors/ServiceError';
import { SERVICE_ERRORS } from '@Core/errors/service.errors';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(user: User): Promise<User> {
    const validUser = await this.userService.findEntityByField(
      'email',
      user.email,
    );
    const match = await this.comparePasswords(
      user.password,
      validUser.password,
    );

    if (!match) {
      throw new ServiceError(SERVICE_ERRORS.USER.WRONG_CREDENTIALS);
    }

    return await this.userService.findEntityById(validUser.id, ['password']);
  }

  public async login(user: User): Promise<any> {
    const validatedUser = await this.validateUser(user);
    const access_token = await this.generateJWT(user);
    return { validatedUser, access_token };
  }

  public async create(user: any): Promise<any> {
    const pass = await this.hashPassword(user.password);
    const newUser = await this.userService.createEntity({
      ...user,
      password: pass,
    });

    const createdUser = await this.userService.findEntityById(newUser.id, [
      'password',
    ]);
    const access_token = await this.generateJWT(createdUser);

    return { createdUser, access_token };
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
