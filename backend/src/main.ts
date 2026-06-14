import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const httpAdapter = app.getHttpAdapter() as any;
  httpAdapter.get('/{*path}', (req: any, res: any) => {
    if (req.path.startsWith('/api')) {
      res.status(404).end();
      return;
    }
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
