import { roles } from './user.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  readonly email: string;
  readonly name: string;
  readonly role: string;
  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
    message:
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
  })
  readonly password: string;
  readonly avatarUrl: string;
}

export class UpdateUserDto {
  readonly email: string;
  readonly name: string;
  readonly role: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
    message:
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
  })
  readonly password: string;

  readonly avatarUrl: string;
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  readonly oldPass: string;

  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
    message:
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
  })
  readonly newPass: string;
}

export class UpdateUserRole {
  @IsEnum(roles)
  role: string = roles.User;
}
