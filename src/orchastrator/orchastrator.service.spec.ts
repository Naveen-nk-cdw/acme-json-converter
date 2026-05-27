import { Test, TestingModule } from '@nestjs/testing';
import { OrchastratorService } from './orchastrator.service';

describe('OrchastratorService', () => {
    let service: OrchastratorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OrchastratorService],
        }).compile();

        service = module.get<OrchastratorService>(OrchastratorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
