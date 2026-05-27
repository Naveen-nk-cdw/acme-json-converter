import { Module } from '@nestjs/common';
import { ChunkProducerController } from './chunk-producer.controller';
import { ChunkProducerService } from './chunk-producer.service';

@Module({
    controllers: [ChunkProducerController],
    providers: [ChunkProducerService],
})
export class ChunkProducerModule {}
