const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: 'postgres',     
  user: 'user',         
  password: 'password', 
  database: 'products_db',
  port: 5432,
});

// 🔹 Health check
app.get("/health", (req, res) => {
  res.json({ status: "Write Service running ✅" });
});

// 🔹 Create product
app.post("/products", async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    const result = await pool.query(
      "INSERT INTO products(name, price, category, stock) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, price, category, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// 🔹 Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name=$1, price=$2, category=$3, stock=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, price, category, stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// 🔹 Delete product (soft delete)
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE products SET deleted_at = NOW() WHERE id=$1",
      [id]
    );

    res.json({ message: "Product deleted (soft delete)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(8080, () => {
  console.log("✏️ Write Service running on port 8080");
});