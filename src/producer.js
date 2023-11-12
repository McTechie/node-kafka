const { kafka } = require('./client');
const readline = require('readline');

// facilitate user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log('Connecting Producer...');
  await producer.connect();
  console.log('Producer Connected!');

  rl.setPrompt('>> ');
  rl.prompt();

  rl.on('line', async (line) => {
    const [riderName, zone, latitude, longitude] = line.split(' ');

    console.log('Sending Message...');
    await producer.send({
      topic: 'rider-updates',
      messages: [
        {
          partition: zone.toLowerCase() === 'north' ? 0 : 1,
          key: 'rider-1',
          value: JSON.stringify({ name: riderName, zone, latitude, longitude }),
        },
      ],
    });
    rl.prompt();
  }).on('close', async () => {
    console.log('Disconnecting...');
    await producer.disconnect();
    console.log('Disconnected!');
  });
}

init().catch((err) => console.error(err));
