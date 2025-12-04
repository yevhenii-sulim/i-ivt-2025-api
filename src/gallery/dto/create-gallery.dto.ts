import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'About' })
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  @MaxLength(50, { message: 'Title must be at most 50 characters long' })
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Hello world! ...' })
  @MaxLength(255, { message: 'Description must be at most 255 characters long' })
  readonly description: string;
}
