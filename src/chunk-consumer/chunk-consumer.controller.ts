import { Controller, Post, Body } from '@nestjs/common';
import { ChunkConsumerService } from './chunk-consumer.service';

@Controller('chunk-consumer')
export class ChunkConsumerController {
    constructor(private readonly consumerService: ChunkConsumerService) {}
    @Post('start')
    async startConsumer(@Body('topic') topic: string) {
        return this.consumerService.startConsumer(topic);
    }
}
