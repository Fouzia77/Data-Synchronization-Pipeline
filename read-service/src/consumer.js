const { Kafka } = require('kafkajs');
const connectMongo = require('./mongo');

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKERS] });
const consumer = kafka.consumer({ groupId: 'read-model-group' });

let stats = { processed: 0, lastOffset: 0 };

async function run() {
  const collection = await connectMongo();

  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      if (!payload.after) return;

      const product = payload.after;

      // Idempotent upsert
      await collection.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true }
      );

      stats.processed++;
      stats.lastOffset = message.offset;
    },
  });
}

module.exports = { run, stats, consumer };