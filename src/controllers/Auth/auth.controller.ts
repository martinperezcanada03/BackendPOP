import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/Register/register.dto';
import { AuthService } from 'src/services/Auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const { token, userId } = await this.authService.login(email, password);
    return { token, userId }; 
  }
}
