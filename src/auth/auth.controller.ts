import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register/email')
  async postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }

  @Post('/email/login')
  async postLoginEmail(@Body() body: LoginUserDto) {
    return this.authService.loginWithEmail(body);
  }
}
