import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';
import { roles } from './user.enum';

@Table
export class User extends Model<User> {
  @Default('')
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

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

  @Default(roles.User)
  @Column({
    type: DataType.ENUM,
    values: Object.values(roles),
    allowNull: false,
  })
  role: string;

  @Default('')
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatarUrl: string;
}
