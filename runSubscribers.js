const { fork } = require('child_process');

const routingKeys = ['topic.key1', 'topic.key2', 'topic.#'];

routingKeys.forEach((key, index) => {
  const child = fork('./messages/pubsub/subscriber.js');
  child.send({ routingKey: key, subscriberId: index + 1 });
});
