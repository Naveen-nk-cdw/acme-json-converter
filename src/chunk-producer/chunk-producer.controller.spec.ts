import { Test, TestingModule } from '@nestjs/testing';
import { ChunkProducerController } from './chunk-producer.controller';

describe('ChunkProducerController', () => {
  let controller: ChunkProducerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChunkProducerController],
    }).compile();

    controller = module.get<ChunkProducerController>(ChunkProducerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
