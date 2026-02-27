ALTER SYSTEM SET wal_level = logical;

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- publication for Debezium
CREATE PUBLICATION dbz_publication FOR TABLE public.products;