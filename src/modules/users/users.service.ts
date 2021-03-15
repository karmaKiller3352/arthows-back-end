import { paginate, searchQuery } from './../../core/utils';
import { SERVICE_ERROR } from '../../core/errors/service.errors';
import { UpdateUserDto } from './user.dto';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '../../core/constants';
import * as R from 'ramda';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user): Promise<User> {
    return await this.userRepository.create({ ...user });
  }

  async isUserExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return R.isNil(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (R.isNil(user)) {
      throw new Error(SERVICE_ERROR.USER.NOT_FOUND);
    }

    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (R.isNil(user)) {
      throw new Error(SERVICE_ERROR.USER.NOT_FOUND);
    }

    return user;
  }

  async getUsers(query?: any): Promise<User[]> {
    console.log(query);
    const search = searchQuery(['name', 'email'], query);
    console.dir(search);
    return await this.userRepository.findAll({
      attributes: { exclude: ['password'] },
      ...paginate(query),
      ...search,
    });
  }

  async removeById(id: number): Promise<any> {
    const user = await this.userRepository.destroy({ where: { id } });

    if (user === 0) {
      throw new Error(SERVICE_ERROR.USER.NOT_FOUND);
    }

    return user;
  }

  async updateById(id: number, user: UpdateUserDto): Promise<any> {
    const updatedUser = await this.userRepository.update(user, {
      where: { id },
      fields: ['name', 'avatarUrl'],
    });

    const updatedCount = R.pathOr(0, [0], updatedUser);
    if (updatedCount === 0) {
      throw new Error(SERVICE_ERROR.USER.NOT_UPDATED);
    }
    return updatedUser;
  }

  async updatePassword(
    oldPass: string,
    newPass: string,
    id: number,
  ): Promise<any> {
    const validUser = await this.userRepository.findOne({
      where: { id },
    });

    if (oldPass === newPass) {
      throw new Error(SERVICE_ERROR.USER.PASSWORDS_EQUALS);
    }

    if (!validUser) {
      throw new Error(SERVICE_ERROR.USER.NOT_FOUND);
    }

    const match = await bcrypt.compare(oldPass, validUser.password);

    if (!match) throw new Error(SERVICE_ERROR.USER.OLD_NOT_MATCHED);

    const password = await bcrypt.hash(newPass, 10);

    const updatedUser = await this.userRepository.update(
      { ...validUser, password },
      {
        where: { id },
        fields: ['password'],
      },
    );

    return updatedUser;
  }

  async updateRole(id: number, role: string): Promise<any> {
    const [updatedUser] = await this.userRepository.update(
      { role },
      {
        where: { id },
        fields: ['role'],
      },
    );

    if (!updatedUser) throw new Error(SERVICE_ERROR.USER.NOT_UPDATED);

    return updatedUser;
  }
}
