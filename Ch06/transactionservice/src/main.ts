import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction/transaction.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// bootstrap function
async function bootstrap() {
  // Create a NestJS application instance 
  const app = await NestFactory.create(TransactionModule);

  // new Swagger document configuration
  const config = new DocumentBuilder()
    .setTitle('Transaction API') // title of the API
    .setDescription('Transaction API description') // description of the API
    .setVersion('1.0') // version of the API
    .build(); // Build the document

  // Create a Swagger document 
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger module
  SwaggerModule.setup('api', app, document);

  // Start the application and listen for requests on port 3000
  await app.listen(3000);
}

// Call the bootstrap function to start the application
bootstrap();