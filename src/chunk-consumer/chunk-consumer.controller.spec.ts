import { Test, TestingModule } from '@nestjs/testing';
import { ChunkConsumerController } from './chunk-consumer.controller';

describe('ChunkConsumerController', () => {
    let controller: ChunkConsumerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChunkConsumerController],
        }).compile();

        controller = module.get<ChunkConsumerController>(ChunkConsumerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
