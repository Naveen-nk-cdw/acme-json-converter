import { Test, TestingModule } from '@nestjs/testing';
import { ChunkProducerService } from './chunk-producer.service';

describe('ChunkProducerService', () => {
  let service: ChunkProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChunkProducerService],
    }).compile();

    service = module.get<ChunkProducerService>(ChunkProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
