// runConsumers.js

const { fork } = require('child_process');

// Number of consumer instances you want to run
const numberOfConsumers = 3;

for (let i = 0; i < numberOfConsumers; i++) {
  fork('./messages/consumer.js');
}
