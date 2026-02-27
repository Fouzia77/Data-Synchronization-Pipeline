const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function connect() {
  await client.connect();
  return client.db(process.env.MONGO_DB).collection('products');
}

module.exports = connect;