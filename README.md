
# 📦 Data Synchronization Pipeline

A **production-ready, microservices-based Data Synchronization Pipeline** designed to demonstrate reliable data flow between services using **Node.js, Express, PostgreSQL, Docker, and event-driven concepts**.

This project simulates a real-world architecture where write operations and read operations are separated to improve **scalability, performance, and maintainability**.

---

# 🌟 Project Overview

Modern applications require fast reads and reliable writes. This project implements a **Write Service** and a **Read Service** backed by PostgreSQL, demonstrating:

* Microservice architecture
* Separation of read and write workloads
* Docker-based deployment
* Soft delete support
* Scalable service design
* Production-style project structure

---

# 🎯 Objectives

The main goals of this project are:

* Demonstrate **data synchronization patterns**
* Build a **scalable backend architecture**
* Implement **soft deletes & timestamps**
* Show **Docker orchestration of services**
* Prepare a base for **CDC (Change Data Capture)** and event streaming

---

# 🏗️ System Architecture

```text
                ┌──────────────┐
                │    Client    │
                └──────┬───────┘
                       │
            ┌──────────▼──────────┐
            │     Write Service    │  (Port 8080)
            │  - Create Product    │
            │  - Update Product    │
            │  - Soft Delete       │
            └──────────┬──────────┘
                       │
                ┌──────▼──────┐
                │ PostgreSQL   │
                │  Database    │
                └──────┬──────┘
                       │
            ┌──────────▼──────────┐
            │      Read Service    │  (Port 8081)
            │  - Fetch Products    │
            │  - Query Optimized   │
            └──────────┬──────────┘
                       │
                ┌──────▼──────┐
                │    Client    │
                └──────────────┘
```

---

# 🧱 Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Backend          | Node.js, Express            |
| Database         | PostgreSQL                  |
| Containerization | Docker, Docker Compose      |
| Architecture     | Microservices               |
| Data Handling    | REST APIs                   |
| Future Extension | Kafka, CDC, Event Streaming |

---

# 📂 Project Structure

```text
Data Synchronization Pipeline/
│
├── write-service/
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
│
├── read-service/
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# ⚙️ Key Features

## ✅ Microservices Architecture

* Independent read and write services
* Scalable and maintainable design

## ✅ Dockerized Environment

* One-command startup
* Consistent development environment

## ✅ Soft Deletes

Instead of permanently removing data:

```sql
deleted_at TIMESTAMP
```

This enables:

* Data recovery
* Audit trails
* Historical analysis

## ✅ Health Check Endpoints

Each service exposes `/health` to verify availability.

## ✅ Timestamps

Tracks creation and update times:

* `created_at`
* `updated_at`

---

# 🚀 Getting Started

## 🔹 Prerequisites

Ensure the following are installed:

* Docker & Docker Compose
* Git
* Node.js (optional for local development)

---

## 🔹 Clone the Repository

```bash
git clone https://github.com/your-username/data-sync-pipeline.git
cd data-sync-pipeline
```

---

## 🔹 Run with Docker

```bash
docker compose up --build
```

### 🔌 Services Available

| Service       | URL                                            |
| ------------- | ---------------------------------------------- |
| Write Service | [http://localhost:8080](http://localhost:8080) |
| Read Service  | [http://localhost:8081](http://localhost:8081) |
| PostgreSQL    | localhost:5432                                 |

---

# 🔎 API Documentation

## ✏️ Write Service — Port 8080

### Health Check

```http
GET /health
```

---

### ➕ Create Product

```http
POST /products
Content-Type: application/json
```

#### Request Body

```json
{
  "name": "Laptop",
  "price": 50000,
  "category": "Electronics",
  "stock": 10
}
```

---

### 🔄 Update Product

```http
PUT /products/:id
```

---

### ❌ Soft Delete Product

```http
DELETE /products/:id
```

Sets `deleted_at` instead of removing the record.

---

## 📖 Read Service — Port 8081

### 📋 Get All Products

```http
GET /products
```

Returns only non-deleted products.

---

### 🔍 Get Product by ID

```http
GET /products/:id
```

---

# 🗄️ Database Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

---

# 🧪 Testing the API

## ➕ Create Product

```bash
curl -X POST http://localhost:8080/products \
-H "Content-Type: application/json" \
-d '{"name":"Tablet","price":15000,"category":"Electronics","stock":3}'
```

## 📋 Fetch Products

```bash
curl http://localhost:8081/products
```



## ❌ Cannot POST /products

✔ Ensure write-service container is running
✔ Verify port 8080 is available

---

## ❌ Database connection failed

✔ Check PostgreSQL container status
✔ Verify credentials in `.env`

---

# 🔐 Environment Variables

Example `.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=products_db
DB_HOST=postgres
DB_PORT=5432
```

---

# 🔮 Future Enhancements

This project can be extended with:

* 🔄 Change Data Capture (Debezium)
* 📡 Apache Kafka for event streaming
* 🔐 JWT authentication
* 📊 Prometheus & Grafana monitoring
* 🧪 Automated unit & integration tests
* 🌐 API Gateway integration
* ☁️ Kubernetes deployment

---

# 📚 Learning Outcomes

Through this project, you will understand:

* Microservices communication
* Data synchronization strategies
* Docker orchestration
* REST API design best practices
* Scalable backend architecture

