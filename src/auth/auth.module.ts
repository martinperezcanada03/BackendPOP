import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user';
import { JwtStrategy } from 'src/guards/jwt-strategy';
import { UserService } from 'src/services/User/user.service';
import { AuthService } from 'src/services/Auth/auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: '1234', 
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
  ],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
