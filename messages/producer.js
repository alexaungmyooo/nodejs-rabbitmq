const rabbitmq = require("../lib/rabbitmq");
const config = require("../config/config");

async function produceMessage(message) {
  try {
    const channel = await rabbitmq.createChannel();
    const exchange = config.rabbitmq.exchange;
    const queue = config.rabbitmq.queue;
    const key = config.rabbitmq.routingKey;

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, key);

    // Basic
    // const messageBuffer = Buffer.from(message);
    // channel.publish(exchange, key, messageBuffer);
    // console.log(`Message sent: ${message}`);

    // Competing Consumers Implementation
    for (let i = 0; i < 10; i++) {  // Sending 10 messages
      const message = `Message ${i + 1}`;
      const messageBuffer = Buffer.from(message);
      channel.publish(exchange, key, messageBuffer, { persistent: true });
      console.log(`Message sent: ${message}`);
    }

    await channel.waitForConfirms();
    await rabbitmq.close();
  } catch (error) {
    console.error("Error producing message", error);
  }
}

produceMessage("Hello, world!");
