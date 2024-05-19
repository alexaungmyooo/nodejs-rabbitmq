const rabbitmq = require('../../lib/rabbitmq');
const config = require('../../config/config');

async function subscribeToMessages(routingKey, subscriberId) {
  try {
    const channel = await rabbitmq.createChannel();
    const exchange = config.rabbitmq.exchange;

    await channel.assertExchange(exchange, 'topic', { durable: true });

    const q = await channel.assertQueue('', { exclusive: true });
    console.log(`Subscriber ${subscriberId}: Queue created: ${q.queue}`);

    await channel.bindQueue(q.queue, exchange, routingKey);
    console.log(`Subscriber ${subscriberId}: Queue bound to exchange with routing key ${routingKey}`);

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        console.log(`Subscriber ${subscriberId}: Message received with ${routingKey}: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge the message after processing
      }
    }, { noAck: false });

    console.log(`Subscriber ${subscriberId}: Waiting for messages...`);
  } catch (error) {
    console.error(`Subscriber ${subscriberId}: Error subscribing to messages`, error);
  }
}

// Listen for messages from the parent process
process.on('message', (message) => {
  if (message.routingKey && message.subscriberId !== undefined) {
    subscribeToMessages(message.routingKey, message.subscriberId);
  }
});

module.exports = { subscribeToMessages };
