import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './lib/observability/logger.config';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './lib/observability/env.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService<EnvConfig>);
  const port = configService.get<number>('app.port', { infer: true }) || 3000;
  console.log(port);
  await app.listen(port ?? 3000);
}
void bootstrap();
