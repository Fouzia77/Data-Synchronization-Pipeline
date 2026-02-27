#!/bin/bash

echo "Waiting for Kafka Connect to be ready..."

until curl -s http://localhost:8083/connectors >/dev/null; do
  sleep 5
done

echo "Kafka Connect is ready. Creating connector..."

curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "products-connector",
    "config": {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "database.hostname": "postgres",
      "database.port": "5432",
      "database.user": "user",
      "database.password": "password",
      "database.dbname": "products_db",
      "database.server.name": "pg-server",
      "table.include.list": "public.products",
      "tombstones.on.delete": "true",
      "plugin.name": "pgoutput"
    }
}'