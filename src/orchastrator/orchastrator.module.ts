import { Module } from '@nestjs/common';
import { OrchastratorController } from './orchastrator.controller';
import { OrchastratorService } from './orchastrator.service';

@Module({
  controllers: [OrchastratorController],
  providers: [OrchastratorService]
})
export class OrchastratorModule {}
