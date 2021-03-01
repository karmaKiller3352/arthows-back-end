import { AuthService } from './../auth/auth.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserDocument, User } from './user.schema';

import { messages } from '../locales/en';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async getAll(): Promise<User[]> {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: id });
  }

  async update(id: string, articleDto: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id: id }, { ...articleDto });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await this.authService.hashPassword(
      createUserDto.password,
    );

    const createdUser = new this.userModel(
      _.assignIn(createUserDto, { password: passwordHash }),
    );

    return await createdUser.save();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (_.isNull(user)) throw new NotFoundException(messages.errors.id);
    return user;
  }

  async removeById(id: string): Promise<User> {
    return this.userModel.findOneAndDelete({ _id: id });
  }

  async updateById(id: string, updateUserDto: CreateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id: id }, { ...updateUserDto });
  }

  async login(user: User): Promise<any> {
    const validUser = await this.validateUser(user.email, user.password);
    return {
      access_token: await this.authService.generateJWT(user),
      user: validUser,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (_.isEmpty(user)) throw new UnauthorizedException('Wrong credentials');

    const match = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (!match) throw new UnauthorizedException('Wrong credentials');

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
}
