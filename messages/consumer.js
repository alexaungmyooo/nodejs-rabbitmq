const rabbitmq = require('../lib/rabbitmq');
const config = require('../config/config');

async function consumeMessage() {
  try {
    const channel = await rabbitmq.createChannel();
    const exchange = config.rabbitmq.exchange;
    const queue = config.rabbitmq.queue;
    const key = config.rabbitmq.routingKey;

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, key);

    channel.consume(queue, (msg) => {
      console.log(`Message received: ${msg.content.toString()}`);
      channel.ack(msg);
    }, { noAck: false });

    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error consuming message', error);
  }
}

consumeMessage();
