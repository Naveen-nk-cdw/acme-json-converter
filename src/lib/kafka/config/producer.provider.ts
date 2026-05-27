import { Kafka } from 'kafkajs';

/**
 * Kafka Producer Provider to create and expose a Kafka Producer instance
 * Publish messages to Kafka topics,Handle retries automatically
 * Provider Token:'KAFKA_PRODUCER'
 * Dependency:'KAFKA_INSTANCE'
 */
export const producerProvider = {
  provide: 'KAFKA_PRODUCER',
  useFactory: (kafka: Kafka) => {
    return kafka.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
      retry: {
        retries: 5,
        initialRetryTime: 300,
        factor: 0.5,
        maxRetryTime: 30000,
      },
    });
  },

  inject: ['KAFKA_INSTANCE'],
};
