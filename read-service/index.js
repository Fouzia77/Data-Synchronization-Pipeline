const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const MONGO_URL = "mongodb://mongo:27017";
const DB_NAME = "products_db";

let db;

// 🔹 Connect to MongoDB
MongoClient.connect(MONGO_URL)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("📦 Connected to MongoDB");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// 🔹 Health check
app.get("/health", (req, res) => {
  res.json({ status: "Read Service running ✅" });
});

// 🔹 Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 🔹 Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await db.collection("products").findOne({ id: parseInt(req.params.id) });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(8081, () => {
  console.log("📖 Read Service running on port 8081");
});