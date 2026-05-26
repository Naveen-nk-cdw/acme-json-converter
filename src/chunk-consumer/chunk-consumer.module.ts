import { Module } from '@nestjs/common';
import { ChunkConsumerService } from './chunk-consumer.service';
import { ChunkConsumerController } from './chunk-consumer.controller';

@Module({
  providers: [ChunkConsumerService],
  controllers: [ChunkConsumerController]
})
export class ChunkConsumerModule {}
