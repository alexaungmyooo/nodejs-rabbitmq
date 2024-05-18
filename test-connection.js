// test-connection.js
const amqp = require('amqplib');
const config = require('./config/config');

async function testConnection() {
  try {
    const { host, port, username, password, vhost } = config.rabbitmq;
    
    const connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}/${vhost}`);
    console.log('Connected to RabbitMQ');
    await connection.close();
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
}

testConnection();
