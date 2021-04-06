import { Injectable } from '@nestjs/common';
import { Model, Repository } from 'sequelize-typescript';

import { SERVICE_ERRORS } from '@Core/errors/service.errors';
import { ServiceError } from '@Core/errors/ServiceError';

import * as R from 'ramda';

@Injectable()
export abstract class BaseService<T extends Model> {
  constructor(private readonly baseRepository: Repository<T>) {}

  public async createEntity(entity): Promise<T> {
    return await this.baseRepository.create({ ...R.omit([''], entity) });
  }

  public async getEntities(
    buildedQuery = {},
    exclude = [],
    include = null,
  ): Promise<any> {
    const entities = await this.baseRepository.findAndCountAll({
      attributes: { exclude },
      include,
      ...buildedQuery,
      raw: true,
    });

    return entities;
  }

  public async findEntityById(
    id: number,
    exclude = [],
    include = null,
  ): Promise<T> {
    const entity = await this.baseRepository.findOne({
      where: { id },
      attributes: { exclude },
      include,
      raw: true,
    });
    if (R.isNil(entity)) {
      throw new ServiceError(SERVICE_ERRORS.ENTITY.NOT_FOUND);
    }

    return entity;
  }

  public async findEntityByField(
    fieldName: string,
    fieldValue: string,
    exclude = [],
    canReturnEmpty = false,
  ): Promise<T> {
    let searchQuery = {};
    searchQuery[fieldName] = fieldValue;

    const entity = await this.baseRepository.findOne({
      where: searchQuery,
      attributes: { exclude },
    });

    if (!canReturnEmpty && R.isNil(entity)) {
      throw new ServiceError(SERVICE_ERRORS.ENTITY.NOT_FOUND);
    }

    return entity;
  }

  public async removeEntityById(id: number): Promise<number> {
    const entity = await this.baseRepository.destroy({ where: { id } });
    if (entity === 0) throw new ServiceError(SERVICE_ERRORS.ENTITY.NOT_FOUND);

    return entity;
  }

  public async removeEntityByField(field): Promise<number> {
    const entity = await this.baseRepository.destroy({
      where: field,
    });
    if (entity === 0) throw new ServiceError(SERVICE_ERRORS.ENTITY.NOT_FOUND);

    return entity;
  }

  public async updateEntityById(
    id: number,
    entity: any,
    fields: Array<string>,
  ): Promise<number> {
    const [updatedCount] = await this.baseRepository.update(entity, {
      where: { id },
      fields,
    });

    if (updatedCount === 0)
      throw new ServiceError(SERVICE_ERRORS.ENTITY.NOT_UPDATED);

    return updatedCount;
  }
}
