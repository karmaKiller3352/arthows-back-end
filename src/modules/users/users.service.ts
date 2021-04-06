import { ServiceError } from '@Core/errors/ServiceError';
import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as R from 'ramda';
import { SERVICE_ERRORS } from '@Core/errors/service.errors';
import { USER_REPOSITORY } from '@Core/constants';

import { UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { BaseService } from '@Core/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@Inject(USER_REPOSITORY) userRepository: typeof User) {
    super(userRepository);
  }

  async updatePassword(
    oldPass: string,
    newPass: string,
    id: number,
  ): Promise<any> {
    const validUser = await this.findEntityById(id);

    if (oldPass === newPass) {
      throw new ServiceError(SERVICE_ERRORS.USER.PASSWORDS_EQUALS);
    }

    if (!validUser) {
      throw new ServiceError(SERVICE_ERRORS.USER.NOT_FOUND);
    }

    const match = await bcrypt.compare(oldPass, validUser.password);

    if (!match) throw new ServiceError(SERVICE_ERRORS.USER.OLD_NOT_MATCHED);

    const password = await bcrypt.hash(newPass, 10);

    const updatedCount = await this.updateEntityById(
      id,
      { ...validUser, password },
      ['password'],
    );

    if (updatedCount === 0)
      throw new ServiceError(SERVICE_ERRORS.USER.NOT_UPDATED);

    return updatedCount;
  }

  async updateRole(id: number, role: string): Promise<any> {
    const updatedCount = await this.updateEntityById(id, { role }, ['role']);

    if (updatedCount === 0)
      throw new ServiceError(SERVICE_ERRORS.USER.NOT_UPDATED);

    return updatedCount;
  }
}
