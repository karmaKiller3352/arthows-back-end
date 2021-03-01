import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserSchema, User } from './user.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersActionController } from './userAction.controller';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UsersController, UsersActionController],
})
export class UserModule {}
