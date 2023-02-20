const rabbitmq = require('../lib/rabbitmq');
const config = require('../config/config');

async function produceMessage(message) {
  try {
    const channel = await rabbitmq.createChannel();
    const exchange = config.rabbitmq.exchange;
    const queue = config.rabbitmq.queue;
    const key = config.rabbitmq.routingKey;

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, key);

    const messageBuffer = Buffer.from(message);
    await channel.publish(exchange, key, messageBuffer);
    console.log(`Message sent: ${message}`);
    await rabbitmq.close();
  } catch (error) {
    console.error('Error producing message', error);
  }
}

produceMessage('Hello, world!');
