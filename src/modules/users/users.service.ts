import { UpdateUserDto } from './user.dto';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user): Promise<User> {
    return await this.userRepository.create({ ...user });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async removeById(id: number): Promise<any> {
    return await this.userRepository.destroy({ where: { id } });
  }

  async updateById(id: number, user: UpdateUserDto): Promise<any> {
    const password = user.password && (await bcrypt.hash(user.password, 10));
    const updatedUser = await this.userRepository.update(
      {
        ...user,
        password,
      },
      {
        where: { id },
        fields: ['name', 'password'],
      },
    );

    return updatedUser;
  }
}
