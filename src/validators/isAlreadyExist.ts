import * as mongoose from 'mongoose';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as _ from 'lodash';

import { messages } from '../locales/en';
import { ArticleSchema } from '../articles/article.schema';
import { UserSchema } from '../users/user.schema';

const instamceMapper = {
  CreateUserDto: {
    name: 'User',
    schema: UserSchema,
  },
  CreateArticleDto: {
    name: 'Article',
    schema: ArticleSchema,
  },
  UpdateArticleDto: {
    name: 'Article',
    schema: ArticleSchema,
  },
  CreateCategoryDto: {
    name: 'Category',
    schema: 'CategorySchema',
  },
};

@ValidatorConstraint({ async: true })
export class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments) {
    const { property, value, targetName } = args;
    const { name, shema } = instamceMapper[targetName];
    const model = mongoose.model(name, shema);
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await model.findOne({ [property]: value });

    if (user) return false;
    return true;
  }
}

export function IsValueAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    const message = `${_.capitalize(propertyName)} $value ${
      messages.errors.already
    }`;

    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message,
        ...validationOptions,
      },
      constraints: [],
      validator: IsAlreadyExistConstraint,
    });
  };
}
