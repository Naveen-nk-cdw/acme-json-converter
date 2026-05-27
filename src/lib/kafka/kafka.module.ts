import { Module } from '@nestjs/common';
import { kafkaProvider } from './config/client.provider';
import { consumerProvider } from './config/consumer.provider';
import { producerProvider } from './config/producer.provider';
import { kafkaAdminProvider } from './config/admin.provider';
import { KafkaAdminService } from './kafka-admin.service';

@Module({
  providers: [
    kafkaProvider,
    consumerProvider,
    producerProvider,
    kafkaAdminProvider,
    KafkaAdminService,
  ],
  exports: [
    kafkaProvider,
    consumerProvider,
    producerProvider,
    kafkaAdminProvider,
    KafkaAdminService,
  ],
})
export class KafkaModule {}
