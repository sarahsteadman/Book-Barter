const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost:27017/bookbarter-test';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect(); // Use disconnect instead of close
  }
});

describe('Server', () => {
  it('should respond with 200 status on /api-docs route', async () => {
    const response = await request(app).get('/api-docs').redirects(1); // Follow one redirect
    expect(response.statusCode).toBe(200);
  });
});