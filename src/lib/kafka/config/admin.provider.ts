import { Kafka } from 'kafkajs';

/**
 * Kafka Admin Provider for creating topics,managing partitions ,inspecting cluster meta data
 * Provider Token:'KAFKA_ADMIN'
 * Dependency:'KAFKA_INSTANCE'
 */
export const kafkaAdminProvider = {
  provide: 'KAFKA_ADMIN',
  useFactory: (kafka: Kafka) => {
    return kafka.admin();
  },
  inject: ['KAFKA_INSTANCE'],
};
