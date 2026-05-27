import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import type { Admin } from 'kafkajs';
/**
 * 1. Topic management
 * 2. Partition management
 * 3. Cluster metadata operations
 */
@Injectable()
export class KafkaAdminService implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructor Dependency Injection
   * @param admin Kafka Admin client instance
   */
  constructor(@Inject('KAFKA_ADMIN') private readonly admin: Admin) {}

  /**
   * Lifecycle hooks executed automatically establish connection of kafka admin
   */
  async onModuleInit() {
    await this.admin.connect();
    console.log('Kafka Admin connected');
  }

  /**
   * Lifecycle hooks executed automatically for shutdown of kafka admin
   */
  async onModuleDestroy() {
    await this.admin.disconnect();
    console.log('Kafka Admin disconnected');
  }

  /**
   * 1. Fetch all existing topics
   * 2. Check whether topic already exists
   * 3. Create topic if missing
   * @param topicName
   * @returns
   */
  async createTopic(topicName: string) {
    try {
      const existingTopic = await this.admin.listTopics();
      if (existingTopic.includes(topicName)) return;
      await this.admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 1, //number of partitions
            replicationFactor: 1, //number of backups
          },
        ],
      });
    } catch (err: any) {
      console.error(err.message);
    }
  }
}
