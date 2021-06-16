const { PubSub } = require('@google-cloud/pubsub');
const express = require('express');

const projectID = 'staffzo-316512';
const topicName = `event-coordinator-${process.env.TOPIC_SUFFIX}`;
const app = express();
const running = true;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const startServer = async () => {
  const port = process.env.PORT || 8080;
  app.get('/', (req, res) => {
    res.send(`Event coordinator application!`);
  });
  app.listen(port, () => {
    console.log(`Event coordinator application listening on port ${port}`);
  });
}

const run = async () => {
  startServer();
  const pubsub = new PubSub({ projectID });
  while (running) {
    await publish(pubsub);
    await sleep(600000);
  }
}

const publish = async (pubSubClient) => {
  try {
    const messageId = await pubSubClient
      .topic(`projects/${projectID}/topics/${topicName}`)
      .publish(Buffer.from('event sent'));
    console.log(`Event ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

run();
