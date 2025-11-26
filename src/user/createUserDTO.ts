import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;
  @IsNotEmpty()
  @IsString()
  readonly email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
