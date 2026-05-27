import { Module } from '@nestjs/common';
import { ChunkProducerController } from './chunk-producer.controller';
import { ChunkProducerService } from './chunk-producer.service';
import { KafkaModule } from '../lib/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [ChunkProducerController],
  providers: [ChunkProducerService],
  exports: [ChunkProducerService],
})
export class ChunkProducerModule {}
