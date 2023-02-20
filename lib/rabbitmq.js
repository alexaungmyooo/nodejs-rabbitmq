const amqp = require("amqplib");
const config = require("../config/config");

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      const { host, port, username, password, vhost } = config.rabbitmq;
      this.connection = await amqp.connect(
        `amqp://${username}:${password}@${host}:${port}/${vhost}`
      );
      console.log("Connected to RabbitMQ");
      return this.connection;
    } catch (error) {
      console.error("Error connecting to RabbitMQ", error);
    }
  }

  async createChannel() {
    try {
      if (!this.connection) {
        await this.connect();
      }
      this.channel = await this.connection.createChannel();
      console.log("Channel created");
      return this.channel;
    } catch (error) {
      console.error("Error creating channel", error);
    }
  }

  async close() {
    try {
      await this.connection.close();
      console.log("Connection to RabbitMQ closed");
    } catch (error) {
      console.error("Error closing connection to RabbitMQ", error);
    }
  }
}

module.exports = new RabbitMQ();
