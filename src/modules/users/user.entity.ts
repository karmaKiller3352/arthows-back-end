import { File } from '../file/file.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasOne,
} from 'sequelize-typescript';
import { roles } from './user.enum';

@Table
export class User extends Model<User> {
  @ApiProperty()
  @Default('')
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty()
  @Default(roles.User)
  @Column({
    type: DataType.ENUM,
    values: Object.values(roles),
    allowNull: false,
  })
  role: string;

  @ApiProperty()
  @HasOne(() => File)
  avatar: File;
}
