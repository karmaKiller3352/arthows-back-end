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

class SchemaFactory {
  private Instance;
  static list = {
    CreateUserDto: {
      name: 'User',
      instance: UserSchema,
    },
    CreateArticleDto: {
      name: 'Article',
      instance: ArticleSchema,
    },
    UpdateArticleDto: {
      name: 'Article',
      instance: ArticleSchema,
    },
    CreateCategoryDto: {
      name: 'Category',
      instance: 'CategorySchema',
    },
  };

  constructor(shema) {
    const Instance = SchemaFactory.list[shema].instance;
    const shemaName = SchemaFactory.list[shema].name;
    const model = mongoose.model(shemaName, Instance);

    this.Instance = model;
  }

  async connect(connection) {
    await mongoose.connect(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  getInstance() {
    return this.Instance;
  }
}

@ValidatorConstraint({ async: true })
export class IsAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments) {
    const { property, value, targetName } = args;
    const db = new SchemaFactory(targetName);
    await db.connect(process.env.DB_CONNECTION);

    const model = db.getInstance();

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
