import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = 7898; 

  const app = await NestFactory.create(AppModule,{cors: true});
  app.useGlobalPipes(new ValidationPipe({}));

  app.enableCors();

  //Swagger
  const options = new DocumentBuilder() 
    .setTitle('S-Cinema')
    .setDescription('Api doumentation of S-Cinema')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/`, 'Local environment')
    .addBearerAuth(  {  
      description: `Please enter the token here`,
      name: 'Authorization',
      bearerFormat: 'Bearer', 
      scheme: 'Bearer',
      type: 'http', 
      in: 'Header'
    },
    'access-token',
  )
    .build(); 
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(port);
}
bootstrap();
