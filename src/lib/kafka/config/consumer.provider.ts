import { Kafka } from 'kafkajs';

/**
 * @decr Kafka Consumer Provider to create and expose a Kafka Consumer instance
 * Subscribe to Kafka topics,Read messages from partitions,Manage offsets and consumer groups
 * Provider Token:'KAFKA_CONSUMER'
 * Dependency:'KAFKA_INSTANCE'
 */
export const consumerProvider = {
  provide: 'KAFKA_CONSUMER',
  useFactory: (kafka: Kafka) => {
    return kafka.consumer({
      groupId: 'order-consumer-group',
      sessionTimeout: 45000,
      heartbeatInterval: 3000,
      maxBytesPerPartition: 1048576,
      retry: {
        retries: 5,
        initialRetryTime: 500,
        factor: 0.5,
      },
      allowAutoTopicCreation: false,
      readUncommitted: false,
    });
  },
  inject: ['KAFKA_INSTANCE'],
};
