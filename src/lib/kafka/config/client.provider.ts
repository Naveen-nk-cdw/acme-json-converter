import { Kafka } from 'kafkajs';

/**
 * Kafka Main Client Provider to create and expose the main Kafka client
 * Provider Token:'KAFKA_INSTANCE'
 */
export const kafkaProvider = {
  provide: 'KAFKA_INSTANCE',
  useFactory: () => {
    return new Kafka({
      clientId: 'kafka-setup', //env
      brokers: ['localhost:9092'], //env
      retry: {
        retries: 5,
        initialRetryTime: 1000,
        factor: 0.5,
      },
    });
  },
};
