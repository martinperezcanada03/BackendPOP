import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from 'src/dtos/messages/message.dto';
import { Message } from 'src/schemas/message';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) { }

  async createMessage(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async getMessagesForChat(senderId: string, receiverId: string, productId: string) {
    return this.messageModel.find({
      $and: [
        { productId: productId },
        {
          $or: [
            { sender: senderId, recipient: receiverId },
            { sender: receiverId, recipient: senderId }
          ]
        }
      ]
    }).exec();
  }

  async deleteMessagesForChat(senderId: string, receiverId: string, productId: string): Promise<any> {
    return this.messageModel.deleteMany({
      $and: [
        { productId: productId },
        {
          $or: [
            { sender: senderId, recipient: receiverId },
            { sender: receiverId, recipient: senderId }
          ]
        }
      ]
    }).exec();
  }
}

