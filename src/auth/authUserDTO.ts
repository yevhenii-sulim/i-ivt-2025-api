import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InferSelectModel } from 'drizzle-orm';
import { userTable } from '~/db/schema';
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John' })
  @MinLength(2, { message: 'Firstname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Firstname must be at most 50 characters long' })
  readonly firstname: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Doe' })
  @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Lastname must be at most 50 characters long' })
  readonly lastname: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@email.gmail.com' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123qwe' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  password: string;
}

export class AuthUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@email.gmail.com' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123asd' })
  password: string;
}

export class UpdateUserDTO {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Firstname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Firstname must be at most 50 characters long' })
  readonly firstname: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Doe' })
  @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Lastname must be at most 50 characters long' })
  readonly lastname: string;
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'email@gmail.com' })
  readonly email: string;
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @ApiPropertyOptional({ example: '123asd' })
  password: string;
}
