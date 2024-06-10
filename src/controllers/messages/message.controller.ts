import { Controller, Post, Body, Get, Param, Query, Delete } from '@nestjs/common';
import { CreateMessageDto } from 'src/dtos/messages/message.dto';
import { MessageService } from 'src/services/Messages/message.service';

@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Post()
    async createMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.messageService.createMessage(createMessageDto);
    }

    @Get(':senderId/:receiverId')
    async getMessagesForChat(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @Query('productId') productId: string
    ) {
        return this.messageService.getMessagesForChat(senderId, receiverId, productId);
    }

    @Delete(':senderId/:receiverId')
    async deleteMessagesForChat(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @Query('productId') productId: string
    ) {
        return this.messageService.deleteMessagesForChat(senderId, receiverId, productId);
    }
}
