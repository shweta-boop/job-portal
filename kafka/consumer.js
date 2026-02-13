const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'smart-job-app',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({
    groupId: 'job-group'
});

async function startConsumer() {
    await consumer.connect();  // Connect to Kafka
    await consumer.subscribe({
        topic: 'job-events',
        fromBeginning: true
    });// Subscribe topic
    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());
            if (data.event === 'JOB_APPLIED') {
                console.log( 'User applied:',data.userId,'Job:',data.jobId);
            } else if (data.event === 'USER_REGISTER') {
                console.log('New user registered with email:',data.email);
            } else {
                console.log('Received:',message.value.toString() );// Print message
            }
        }
    })
};

startConsumer();
