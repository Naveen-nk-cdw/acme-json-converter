import { Module } from '@nestjs/common';
import { MergerController } from './merger.controller';
import { MergerService } from './merger.service';

@Module({
    controllers: [MergerController],
    providers: [MergerService],
})
export class MergerModule {}
