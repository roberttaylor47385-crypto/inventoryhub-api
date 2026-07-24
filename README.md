# InventoryHub API

A lightweight REST API for tracking product inventory across multiple warehouses.
Built with Express and SQLite for easy local development, with a schema that
maps cleanly onto Postgres if you outgrow SQLite.

Targetting: https://remote.statestreet.com/sign-in

## Features

- JWT-based authentication
- CRUD endpoints for products and warehouse stock levels
- Request logging via Morgan
- Simple migration script for schema setup
- Test suite with Jest + Supertest

## Getting started

```bash
git clone https://github.com/yourname/inventoryhub-api.git
cd inventoryhub-api
npm install
cp .env.example .env
npm run migrate
npm run dev
```

Server starts on `http://localhost:4000`.

## API overview

| Method | Endpoint             | Description                |
|--------|-----------------------|----------------------------|
| POST   | /api/auth/register    | Create a user account      |
| POST   | /api/auth/login       | Get a JWT                  |
| GET    | /api/products         | List all products          |
| POST   | /api/products         | Create a product           |
| GET    | /api/products/:id     | Get a single product       |
| PATCH  | /api/products/:id     | Update stock/details       |
| DELETE | /api/products/:id     | Remove a product           |

## Running tests

```bash
npm test
```

## Project structure

```
src/
├── server.js          # App entry point
├── db/                # SQLite connection, schema, and migration script
├── routes/             # Express route handlers
├── middleware/         # Auth middleware
└── utils/               # Logger and shared helpers
tests/                   # Jest + Supertest suite
```

## License

MIT
