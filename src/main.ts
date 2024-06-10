import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on PORT : ${PORT}`);
}
bootstrap();
