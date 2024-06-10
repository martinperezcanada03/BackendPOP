import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/User/createUser.dto';
import { UpdateUserDto } from 'src/dtos/User/updateUser.dto';
import { User } from 'src/schemas/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async countConversationsByUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user.conversations.length;
  }

  async getConversationByIndex(id: string, index: number) {
    const user = await this.userModel.findById(id).exec();
    if (!user || index < 0 || index >= user.conversations.length) {
      throw new UnauthorizedException('Conversación no encontrada');
    }
    const conversationId = user.conversations[index];
    return { conversationId };
  }

  async getUserFavorites(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user.favorites;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!existingUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return existingUser;
  }

  async updateUserPassword(id: string, newPassword: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return deletedUser;
  }
}
