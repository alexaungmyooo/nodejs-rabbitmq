const rabbitmq = require('../../lib/rabbitmq');
const config = require('../../config/config');

async function subscribeToMessages(routingKey) {
  try {
    const channel = await rabbitmq.createChannel();
    const exchange = config.rabbitmq.exchange;

    await channel.assertExchange(exchange, 'topic', { durable: true });

    const q = await channel.assertQueue('', { exclusive: true });
    console.log(`Queue created: ${q.queue}`);

    await channel.bindQueue(q.queue, exchange, routingKey);
    console.log(`Queue bound to exchange with routing key ${routingKey}`);

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        console.log(`Message received with ${routingKey}: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge the message after processing
      }
    }, { noAck: false });

    console.log('Waiting for messages...');
  } catch (error) {
    console.error('Error subscribing to messages', error);
  }
}

// Listen for messages from the parent process
process.on('message', (message) => {
  if (message.routingKey) {
    subscribeToMessages(message.routingKey);
  }
});

module.exports = { subscribeToMessages };
