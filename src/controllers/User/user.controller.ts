import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/User/createUser.dto';
import { UpdateUserDto } from 'src/dtos/User/updateUser.dto';
import { AuthService } from 'src/services/Auth/auth.service';
import { UserService } from 'src/services/User/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get(':id/conversations')
  async countUserConversations(@Param('id') id: string) {
    return this.userService.countConversationsByUser(id);
  }

  @Get(':id/conversations/:index')
  async getConversationByIndex(@Param('id') id: string, @Param('index') index: number) {
    return this.userService.getConversationByIndex(id, index);
  }

  @Get(':id/favorites')
  async getUserFavorites(@Param('id') id: string) {
    return this.userService.getUserFavorites(id);
  }

  @Put(':id/password')
  async updatePasswordAndGenerateToken(@Param('id') id: string, @Body('password') newPassword: string) {
    await this.userService.updateUserPassword(id, newPassword);

    const tokenResponse = await this.authService.updatePasswordAndGenerateToken(id, newPassword);
    return tokenResponse;
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
