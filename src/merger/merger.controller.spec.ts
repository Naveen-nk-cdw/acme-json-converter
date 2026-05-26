import { Test, TestingModule } from '@nestjs/testing';
import { MergerController } from './merger.controller';

describe('MergerController', () => {
  let controller: MergerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MergerController],
    }).compile();

    controller = module.get<MergerController>(MergerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
