const express = require('express');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// List all products
router.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.json(products);
});

// Get a single product
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create a product
router.post('/', requireAuth, (req, res) => {
  const { sku, name, description, price_cents, warehouse_id, quantity } = req.body;

  if (!sku || !name) {
    return res.status(400).json({ error: 'sku and name are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO products (sku, name, description, price_cents, warehouse_id, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      sku,
      name,
      description || null,
      price_cents || 0,
      warehouse_id || null,
      quantity || 0
    );
    logger.info(`Product created: ${sku}`);
    res.status(201).json({ id: result.lastInsertRowid, sku, name });
  } catch (err) {
    res.status(409).json({ error: 'SKU already exists' });
  }
});

// Update a product
router.patch('/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated = { ...existing, ...req.body, updated_at: new Date().toISOString() };

  db.prepare(`
    UPDATE products
    SET name = ?, description = ?, price_cents = ?, warehouse_id = ?, quantity = ?, updated_at = ?
    WHERE id = ?
  `).run(
    updated.name,
    updated.description,
    updated.price_cents,
    updated.warehouse_id,
    updated.quantity,
    updated.updated_at,
    req.params.id
  );

  logger.info(`Product updated: id=${req.params.id}`);
  res.json({ id: Number(req.params.id), ...updated });
});

// Delete a product
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  logger.info(`Product deleted: id=${req.params.id}`);
  res.status(204).send();
});

module.exports = router;
