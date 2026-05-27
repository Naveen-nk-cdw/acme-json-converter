import { Controller, Post, Body } from '@nestjs/common';
import { ChunkProducerService } from './chunk-producer.service';

@Controller('chunk-producer')
export class ChunkProducerController {
    constructor(private readonly producerService: ChunkProducerService) {}
    @Post('send')
    async sendMessage(
        @Body('topic') topic: string,
        @Body('key') key: string,
        @Body('value') value: any,
    ) {
        return this.producerService.sendMessage(topic, { key, value });
    }
}
