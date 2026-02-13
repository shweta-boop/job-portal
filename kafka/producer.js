const { Kafka } = require('kafkajs'); 
// Import Kafka class

const kafka = new Kafka({
  clientId: 'smart-job-app',   
  brokers: ['localhost:9092'] 
});
// Create Kafka client

const producer = kafka.producer(); 
// Create producer instance

async function sendMessage(data) {

  await producer.connect();  
  // Connect to Kafka server

  await producer.send({
    topic: 'job-events',      
    messages: [
      { value: JSON.stringify(data) }  
    ]
  });
  // Send message to topic

  console.log('Kafka message sent');

  await producer.disconnect(); 
  // Close connection
}

module.exports = sendMessage;
