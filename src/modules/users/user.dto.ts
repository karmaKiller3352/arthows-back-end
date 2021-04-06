import { roles } from './user.enum';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  readonly email: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly role: string;
  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
    message:
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
  })
  @ApiProperty()
  readonly password: string;
}

export class UpdateUserDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly role: string;

  @ApiProperty()
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
}

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly oldPass: string;

  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Password must be at least 6 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, {
    message:
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
  })
  @ApiProperty()
  readonly newPass: string;
}

export class UpdateUserRole {
  @ApiProperty({ enum: roles })
  @IsEnum(roles)
  role: string = roles.User;
}
