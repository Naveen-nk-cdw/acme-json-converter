import { Module } from '@nestjs/common';
import { ChunkConsumerService } from './chunk-consumer.service';
import { ChunkConsumerController } from './chunk-consumer.controller';
import { KafkaModule } from '../lib/kafka/kafka.module';

@Module({
    imports: [KafkaModule],
    providers: [ChunkConsumerService],
    controllers: [ChunkConsumerController],
})
export class ChunkConsumerModule {}
