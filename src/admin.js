const { kafka } = require('./client');

async function init() {
  const admin = kafka.admin();

  console.log('Connecting Admin...');
  await admin.connect();
  console.log('Admin Connected!');

  console.log('Creating Topics...');
  await admin.createTopics({
    topics: [
      {
        topic: 'rider-updates',
        numPartitions: 2,
      },
    ],
  });
  console.log('Topics Created!');

  console.log('Disconnecting Admin...');
  await admin.disconnect();
  console.log('Admin Disconnected!');
}

init().catch((err) => console.error(err));
