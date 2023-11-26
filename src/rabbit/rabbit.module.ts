import { Module, OnModuleInit } from '@nestjs/common';
import { menash } from 'menashmq';
import config from '../config/env.config';
import { RabbitService } from './rabbit.service';

@Module({
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule implements OnModuleInit {
  async onModuleInit() {
    const { uri, retryOptions, usersQueueName, usersQueuePrefetch } = config.rabbit;

    await menash.connect(uri, retryOptions);

    await menash.declareTopology({
      queues: [
        {
          name: usersQueueName,
          options: {
            durable: true,
            prefetch: usersQueuePrefetch,
          },
        },
      ],
    });

    console.log('Connection to RabbitMQ established');
  }

  async onApplicationShutdown() {
    await menash.close();
  }
}
