const { kafka } = require('./client');

// assosiate consumer with group
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group || 'test-group' });

  console.log('Connecting Consumer...');
  await consumer.connect();
  console.log('Consumer Connected!');

  console.log('Subscribing Consumer...');
  await consumer.subscribe({ topic: 'rider-updates', fromBeginning: true });
  console.log('Consumer Subscribed!');

  console.log('Consuming...');
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`[${group}:${topic} -- Partition: ${partition}] | Location: (${JSON.parse(message.value).latitude}, ${JSON.parse(message.value).longitude})`);
    },
  });
  console.log('Consumed!');
}

init().catch((err) => console.error(err));
