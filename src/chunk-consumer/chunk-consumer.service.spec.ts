import { Test, TestingModule } from '@nestjs/testing';
import { ChunkConsumerService } from './chunk-consumer.service';

describe('ChunkConsumerService', () => {
    let service: ChunkConsumerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ChunkConsumerService],
        }).compile();

        service = module.get<ChunkConsumerService>(ChunkConsumerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
