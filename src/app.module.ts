import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './controllers/Product/product.controller';
import { ProductSchema } from './schemas/product';
import { ProductService } from './services/Product/product.service';
import { UserSchema } from './schemas/user';
import { UserController } from './controllers/User/user.controller';
import { UserService } from './services/User/user.service';
import { AuthService } from './services/Auth/auth.service';
import { AuthController } from './controllers/Auth/auth.controller';
import { WebSocketGatewayClass } from './websocket.gateway'; 
import { MessageController } from './controllers/messages/message.controller';
import { MessageService } from './services/Messages/message.service';
import { MessageSchema } from './schemas/message';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://martinperez0345:qF41cCDb6Ycvmidx@fernanpop.tpugpvm.mongodb.net/fernanpop?retryWrites=true&w=majority&appName=fernanPOP`),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }, { name: 'User', schema: UserSchema }, { name: 'Message', schema: MessageSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule, 
  ],
  controllers: [AppController, ProductController, UserController, AuthController, MessageController],
  providers: [AppService, ProductService, UserService, AuthService, MessageService, WebSocketGatewayClass],
})
export class AppModule {}
