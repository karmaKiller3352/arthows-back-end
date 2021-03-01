import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { roles } from './enums/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  email: string;
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, enum: Object.values(roles), default: roles.User })
  role: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
