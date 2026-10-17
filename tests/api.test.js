'use strict';

const request = require('supertest');
const app = require('../app');

describe('BunkWise API', () => {
  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /api/calculate returns bunk budget', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ attended: 36, total: 40, target: 75 });
    expect(res.statusCode).toBe(200);
    expect(res.body.canBunk).toBe(8);
    expect(res.body.status).toBe('safe');
  });

  test('POST /api/calculate rejects bad input with 400', async () => {
    const res = await request(app)
      .post('/api/calculate')
      .send({ attended: 50, total: 40 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/summary returns per-subject and overall data', async () => {
    const res = await request(app)
      .post('/api/summary')
      .send({
        subjects: [
          { name: 'DSA', attended: 18, total: 20 },
          { name: 'OS', attended: 12, total: 20 },
        ],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.subjects).toHaveLength(2);
    expect(res.body.overall.percentage).toBe(75);
  });

  test('unknown API route returns 404', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.statusCode).toBe(404);
  });
});
