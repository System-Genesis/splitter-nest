import { Injectable } from '@nestjs/common';
import { ConsumeFunction, menash, amqp, ConsumerMessage } from 'menashmq';

@Injectable()
export class RabbitService {
  static wrapConsumer(consume: ConsumeFunction) {
    return async (message: ConsumerMessage) => {
      try {
        await consume(message);
        message.ack();
      } catch (err) {
        console.log(`Rabbit consumer throws:`, err);
        message.nack(false);
      }
    };
  }

  activateConsumer(queueName: string, onMessage: ConsumeFunction, options?: amqp.Options.Consume) {
    return menash.queue(queueName).activateConsumer(onMessage, options);
  }

  publishMessageToQueue(queueName: string, message: Record<string, unknown> | string) {
    return menash.send(queueName, message);
  }
}
