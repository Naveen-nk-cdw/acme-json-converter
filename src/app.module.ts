import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrchastratorModule } from './orchastrator/orchastrator.module';
import { MergerModule } from './merger/merger.module';
import { ChunkProducerModule } from './chunk-producer/chunk-producer.module';
import { ChunkConsumerModule } from './chunk-consumer/chunk-consumer.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [OrchastratorModule, ChunkProducerModule, ChunkConsumerModule, MergerModule,ConfigModule.forRoot({
      isGlobal:true})
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
