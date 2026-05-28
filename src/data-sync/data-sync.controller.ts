import { Controller, Get } from '@nestjs/common';
import { DataSyncService } from './data-sync.service';

@Controller('data-sync')
export class DataSyncController {
    constructor(private readonly dataSyncService: DataSyncService) {}

    @Get('backup')
    async backup(): Promise<string> {
        await this.dataSyncService.backup();
        return 'db data collected successfully!';
    }

    @Get('restore')
    async restore(): Promise<string> {
        await this.dataSyncService.restore();
        return 'db synced successfully!';
    }
}
