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
    // await channel.waitForConfirms();
    // await rabbitmq.close();

    // Competing Consumers Implementation
    let messageCount = 10; // Total number of messages to send

    const sendMessage = (count) => {
      if (count > 0) {
        const message = `Message ${messageCount - count + 1}`;
        const messageBuffer = Buffer.from(message);
        channel.publish(exchange, key, messageBuffer, { persistent: true });
        console.log(`Message sent: ${message}`);

        // Schedule the next message
        setTimeout(() => sendMessage(count - 1), 2000); // 2 seconds interval
      } else {
        channel
          .waitForConfirms()
          .then(() => rabbitmq.close())
          .catch((error) =>
            console.error("Error closing RabbitMQ connection", error)
          );
      }
    };

    sendMessage(messageCount); // Start sending messages
  } catch (error) {
    console.error("Error producing message", error);
  }
}

produceMessage("Hello, world!");
