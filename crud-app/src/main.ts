import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from './config'
import { LogService } from './providers/log/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const config = new DocumentBuilder()
  .setTitle('Teste Técnico Dihub [Crud Nest API]')
  .setDescription('API para CRUD de usuários.')
  .setVersion('1.0')
  .addSecurity('bearer', {
    type: 'http',
    scheme: 'bearer'
  })
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useLogger(app.get(LogService));

  await app.listen(env.api.port, () => {
    console.log(`API Documentation: http://localhost:${env.api.port}/docs`)
    console.log(`Server is running on http://localhost:${env.api.port}`)
  });
}
bootstrap();
