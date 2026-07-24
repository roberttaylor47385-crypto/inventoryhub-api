const request = require('supertest');
const app = require('../src/server');

describe('GET /api/products', () => {
  it('returns a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('returns 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/products', () => {
  it('rejects creation without auth', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ sku: 'TEST-001', name: 'Test Widget' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /health', () => {
  it('reports service health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
