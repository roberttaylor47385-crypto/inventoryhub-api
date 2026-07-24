const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', usersRouter);
app.use('/api/products', productsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`InventoryHub API listening on port ${PORT}`);
});

module.exports = app;
