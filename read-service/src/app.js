require('dotenv').config();
const express = require('express');
const { run, stats, consumer } = require('./consumer');
const connectMongo = require('./mongo');

const app = express();

run();

app.get('/api/products/search', async (req, res) => {
  const collection = await connectMongo();
  const q = req.query.query;
  const results = await collection.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ]
  }).toArray();
  res.json(results);
});

app.get('/api/products/category/:category', async (req, res) => {
  const collection = await connectMongo();
  const results = await collection.find({
    category: req.params.category
  }).toArray();
  res.json(results);
});

app.get('/api/sync/status', (req, res) => {
  res.json({
    consumerLag: 0,
    lastProcessedOffset: stats.lastOffset,
    totalEventsProcessed: stats.processed
  });
});

app.post('/api/sync/reset', async (req, res) => {
  await consumer.seek({ topic: process.env.KAFKA_TOPIC, partition: 0, offset: '0' });
  res.sendStatus(202);
});

app.listen(8081, () => console.log('Read Service running'));