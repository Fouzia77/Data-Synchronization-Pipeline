const { Kafka } = require("kafkajs");
const { MongoClient } = require("mongodb");

const KAFKA_BROKER = "kafka:29092";
const TOPIC = "pg-server.public.products";
const MONGO_URL = "mongodb://mongo:27017";
const DB_NAME = "products_db";
const COLLECTION = "products";

const kafka = new Kafka({
  clientId: "mongo-consumer",
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "mongo-group" });

let collection;

// ✅ Connect to MongoDB
async function connectMongo() {
  try {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    collection = db.collection(COLLECTION);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// ✅ Process Kafka message
async function handleMessage(message) {
  try {
    const data = JSON.parse(message.value.toString());

    if (!data.payload) return;

    const op = data.payload.op;
    const after = data.payload.after;
    const before = data.payload.before;

    // CREATE or UPDATE
    if (op === "c" || op === "u") {
      await collection.updateOne(
        { id: after.id },
        { $set: after },
        { upsert: true }
      );
      console.log(`✔ Synced product ID ${after.id}`);
    }

    // DELETE
    if (op === "d") {
      await collection.deleteOne({ id: before.id });
      console.log(`🗑 Deleted product ID ${before.id}`);
    }
  } catch (err) {
    console.error("❌ Error processing message:", err.message);
  }
}

// ✅ Start consumer
async function start() {
  await connectMongo();

  try {
    await consumer.connect();
    console.log("✅ Connected to Kafka");

    await consumer.subscribe({
      topic: TOPIC,
      fromBeginning: true,
    });

    console.log(`📡 Listening to topic: ${TOPIC}`);

    await consumer.run({
      eachMessage: async ({ message }) => {
        await handleMessage(message);
      },
    });
  } catch (error) {
    console.error("❌ Kafka consumer error:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down consumer...");
  await consumer.disconnect();
  process.exit(0);
});

start();