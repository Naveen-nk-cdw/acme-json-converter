import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrchastratorModule } from './orchastrator/orchastrator.module';
import { ChunkProducerModule } from './chunk_producer/chunk_producer.module';
import { ChunkConsumerModule } from './chunk_consumer/chunk_consumer.module';
import { MergerModule } from './merger/merger.module';
import { ChunkProducerModule } from './chunk-producer/chunk-producer.module';
import { ChunkConsumerModule } from './chunk-consumer/chunk-consumer.module';

@Module({
  imports: [OrchastratorModule, ChunkProducerModule, ChunkConsumerModule, MergerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
