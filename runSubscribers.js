const { fork } = require('child_process');

// Array of routing keys for different subscribers
const routingKeys = ['topic.key1', 'topic.key2', 'topic.#'];

routingKeys.forEach((key) => {
  const child = fork('./messages/pubsub/subscriber.js');
  child.send({ routingKey: key });
});
