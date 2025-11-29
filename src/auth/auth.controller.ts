import { Body, Controller, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from '~/auth/auth.service';
import { AuthUserDTO, CreateUserDTO, UpdateUserDTO } from '~/auth/authUserDTO';
import { User } from '~/user/user.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    schema: {
      example: { token: 'eyJhbGciOiJIUzI1...' },
    },
  })
  @Post('signup')
  signup(@Body(new ValidationPipe()) body: CreateUserDTO) {
    return this.authService.createUser(body);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: { token: 'eyJhbGciOiJIUzI1...' },
    },
  })
  @Post('login')
  login(@Body(new ValidationPipe()) body: AuthUserDTO) {
    return this.authService.login(body);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: { firstname: 'John', lastname: 'Dou', email: 'mail@gmail.com' },
    },
  })
  @Patch('update')
  update(
    @Body(new ValidationPipe()) body: UpdateUserDTO,
    @User('id') currentUserId: number | null
  ) {
    return this.authService.update(body, currentUserId);
  }
}
