import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false }) 
export class Message extends Document {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
