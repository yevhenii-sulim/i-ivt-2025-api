import { Body, Controller, Get, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthUserDTO, CreateUserDTO, UpdateUserDTO } from '~/user/userDTO';
import { UserService } from '~/user/user.service';
import { User } from '~/user/user.decorator';
import type {
  ExtensionRequestInterface,
  UserTypeWithoutPassword,
} from '~/user/ExtensionRequestInterface';
import { AuthGuard } from '~/guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Dou',
          email: 'mail@gmail.com',
          createdAt: '2025-11-27T15:28:45.586Z',
        },
      ],
    },
  })
  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Req() req: ExtensionRequestInterface): Promise<UserTypeWithoutPassword> {
    return req.user;
  }

  @ApiResponse({
    status: 201,
    schema: {
      example: [{ token: 'eyJhbGciOiJIUzI1...' }],
    },
  })
  @Post('signup')
  signup(@Body(new ValidationPipe()) body: CreateUserDTO) {
    return this.userService.createUser(body);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: [{ token: 'eyJhbGciOiJIUzI1...' }],
    },
  })
  @Post('login')
  login(@Body(new ValidationPipe()) body: AuthUserDTO) {
    return this.userService.login(body);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: [{ firstname: 'John', lastname: 'Dou', email: 'mail@gmail.com' }],
    },
  })
  @Patch('update')
  update(@Body(new ValidationPipe()) body: UpdateUserDTO, @User('id') currentUserId: string) {
    return this.userService.update(body, Number(currentUserId));
  }
}
