import { Test, TestingModule } from '@nestjs/testing';
import { OrchastratorController } from './orchastrator.controller';

describe('OrchastratorController', () => {
    let controller: OrchastratorController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrchastratorController],
        }).compile();

        controller = module.get<OrchastratorController>(OrchastratorController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
