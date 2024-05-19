const rabbitmq = require("../../lib/rabbitmq");
const config = require("../../config/config");

async function publishMessages() {
  try {
    const channel = await rabbitmq.createConfirmChannel(); // Use createConfirmChannel
    const exchange = config.rabbitmq.exchange;

    await channel.assertExchange(exchange, "topic", { durable: true });

    const routingKeys = ["topic.key1", "topic.key2", "topic.key3"];

    for (let i = 0; i < 10; i++) {
      // Sending 10 messages
      setTimeout(() => {
        const routingKey = routingKeys[i % routingKeys.length];
        const message = `Message ${i + 1} with routing key ${routingKey}`;
        const messageBuffer = Buffer.from(message);
        channel.publish(exchange, routingKey, messageBuffer, {
          persistent: true,
        });
        console.log(`Message sent: ${message}`);
      }, i * 2000); // 2 seconds interval between messages
    }

    setTimeout(async () => {
      await channel.waitForConfirms();
      await rabbitmq.close();
    }, 10 * 2000 + 1000); // Ensure all messages are sent before closing
  } catch (error) {
    console.error("Error publishing messages", error);
  }
}

publishMessages();
