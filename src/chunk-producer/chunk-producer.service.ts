import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import type { Producer } from 'kafkajs';
import { CompressionTypes } from 'kafkajs';
import { KafkaAdminService } from '../lib/kafka/kafka-admin.service';
/**
 * Connecting Kafka producer
 * Creating Kafka topics dynamically
 * Serialize message payload
 * Send compressed Kafka message
 * Sending messages to Kafka topics
 * Managing producer lifecycle
 */
@Injectable()
export class ChunkProducerService implements OnModuleDestroy, OnModuleInit {
  private isConnected = false;
  /**
   * Constructor Dependency Injection
   * @param producer Kafka producer instance
   * @param kakfkaAdminService  used to manage Kafka topics
   */
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly producer: Producer,
    private readonly kakfkaAdminService: KafkaAdminService,
  ) {}

  /**
   * @decr Lifecycle hooks executed automatically establish connection of kafka producer
   */
  async onModuleInit() {
    await this.producer.connect();
    this.isConnected = true;
    console.log('Producer connected');
  }

  /**
   * @decr Lifecycle hooks executed automatically for shutdown of kafka producer
   */
  async onModuleDestroy() {
    await this.producer.disconnect();
    this.isConnected = false;
    console.log('Producer disconnected');
  }

  /**
   * @decr Sends a message to Kafka topic
   * Generic Type <T> Allows sending any payload structure
   * @param topic
   * @param message
   * @returns
   */
  async sendMessage<T>(topic: string, message: { key: string; value: T }) {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
    }

    //create topic dynamically
    await this.kakfkaAdminService.createTopic(topic);

    //send kafka message
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.key,
          value: JSON.stringify(message.value),
        },
      ],

      //wait for all in-sync replicas
      acks: -1,
      //compress payload using GZIP
      compression: CompressionTypes.GZIP,
    });

    return {
      success: true,
      topic,
    };
  }
}
