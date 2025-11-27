import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InferSelectModel } from 'drizzle-orm';
import { userTable } from '~/db/schema';
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John' })
  readonly firstname: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Doe' })
  readonly lastname: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'email@email.gmail.com' })
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123qwe' })
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
  readonly firstname: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Doe' })
  readonly lastname: string;
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'email@email.gmail.com' })
  readonly email: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '123asd' })
  password: string;
}

export type UserType = InferSelectModel<typeof userTable>;
