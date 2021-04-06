import { User } from '../users/user.entity';
import { fileTypes } from './file.enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToAssociation,
} from 'sequelize-typescript';

@Table
export class File extends Model<File> {
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;
  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  path: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  url: string;

  @ApiProperty()
  @Column({
    type: DataType.ENUM,
    values: Object.values(fileTypes),
    allowNull: false,
  })
  type: string;

  @ApiProperty()
  @ForeignKey(() => User)
  @Column
  userId?: number;
  @BelongsTo(() => User)
  user: User;
}
