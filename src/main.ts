import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true}));

  const config = new DocumentBuilder()
    .setTitle('La Restro')
    .setDescription('The La Restro API description')
    .setVersion('1.0')
    .addTag('la_restro')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory); 

  await app.listen(3001);
}
bootstrap();
