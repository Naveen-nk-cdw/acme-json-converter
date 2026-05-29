import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChunkConsumerModule } from './chunk-consumer/chunk-consumer.module';
import { ChunkProducerModule } from './chunk-producer/chunk-producer.module';
import { MergerModule } from './merger/merger.module';
import { OrchastratorModule } from './orchastrator/orchastrator.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        OrchastratorModule,
        ChunkProducerModule,
        ChunkConsumerModule,
        MergerModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
