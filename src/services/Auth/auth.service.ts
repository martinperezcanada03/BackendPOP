import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/dtos/Register/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService:
      JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<{ token: string, userId: string }> {
    const { name, lastName, email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email ya en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.createUser({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    const userId: string = newUser._id.toString();
    const payload = { email: newUser.email, sub: userId };
    const token = this.jwtService.sign(payload);
    return { token, userId };
  }

  async login(email: string, password: string): Promise<{ token: string, userId: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token, userId: user.id };
  }

  async updatePasswordAndGenerateToken(userId: string, newPassword: string): Promise<{ token: string }> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUserPassword(userId, newPassword);

    const user = await this.userService.findById(userId);
    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
