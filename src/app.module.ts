import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrchastratorModule } from './orchastrator/orchastrator.module';
import { MergerModule } from './merger/merger.module';
import { ChunkProducerModule } from './chunk-producer/chunk-producer.module';
import { ChunkConsumerModule } from './chunk-consumer/chunk-consumer.module';
import { ConfigModule } from '@nestjs/config';
import { TraceMiddleware } from './lib/middleware/trace.middleware';
import configuration from './lib/observability/env.config';

const environment = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    OrchastratorModule,
    ChunkProducerModule,
    ChunkConsumerModule,
    MergerModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
