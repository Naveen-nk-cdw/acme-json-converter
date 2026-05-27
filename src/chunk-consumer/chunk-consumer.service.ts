import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import type { Consumer } from 'kafkajs';
import { KafkaAdminService } from '../lib/kafka/kafka-admin.service';
/**
 * 1.Creating Kafka consumer on module startup
 * 2.Creating topics dynamically
 * 3.Subscribing to kafka topics
 * 4.Consuming and processing kafka messages
 * 5.Disconnecting consumer safely on shutdown
 */
@Injectable()
export class ChunkConsumerService implements OnModuleInit, OnModuleDestroy {
  private isRunning = false;
  /**
   * Constructor Dependency Injection
   * @param consumer KafkaJS consumer instance injected from provider
   * @param kakfkaAdminService used to manage Kafka topics
   */
  constructor(
    @Inject('KAFKA_CONSUMER') private readonly consumer: Consumer,
    private readonly kakfkaAdminService: KafkaAdminService,
  ) {}

  /**
   * Lifecycle hooks executed automatically establish connection of kafka consumer
   */
  async onModuleInit() {
    await this.consumer.connect();
    console.log('Consumer connected');
  }

  /**
   * Lifecycle hooks executed automatically for shutdown of kafka consumer
   */
  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('Consumer disconnected');
  }

  /**
   * starts kafka consumer for a given topic
   * @param topic
   * @returns
   */
  async startConsumer(topic: string) {
    if (this.isRunning) {
      return;
    }
    //create topic dynamically
    await this.kakfkaAdminService.createTopic(topic);

    //continuously read topic from beginning
    await this.consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    //start the consumption loop
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await console.log({
          topic,
          partition,
          key: message.key?.toString(),
          value: message.value?.toString(),
        });
      },
    });
    this.isRunning = true;
  }
}
