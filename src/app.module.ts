import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChunkConsumerModule } from './chunk-consumer/chunk-consumer.module';
import { ChunkProducerModule } from './chunk-producer/chunk-producer.module';
import { DataSyncModule } from './data-sync/data-sync.module';
import { MergerModule } from './merger/merger.module';
import { OrchastratorModule } from './orchastrator/orchastrator.module';

@Module({
    imports: [
        OrchastratorModule,
        ChunkProducerModule,
        ChunkConsumerModule,
        MergerModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DataSyncModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
