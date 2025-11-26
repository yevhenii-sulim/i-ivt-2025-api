import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from '~/user/createUserDTO';
import { UserService } from '~/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe()) body: CreateUserDTO) {
    return this.userService.createUser(body);
  }
}
