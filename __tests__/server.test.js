const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add other options as needed
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Server', () => {
  it('should respond with 200 status on /api-docs route', async () => {
    const response = await request(app).get('/api-docs').redirects(1); // Follow one redirect
    expect(response.statusCode).toBe(200);
  });
});