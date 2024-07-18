const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file

let server;
let authToken; // To store the authentication token

beforeAll(done => {
  server = app.listen(9000, done);
});

afterAll(done => {
  server.close(done);
});

describe('User Routes', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        name: "Santa Clause",
        email: "northpolecaptain@gmail.com",
        password: "hello1234",
        username: "sclause"
      });
    expect(response.statusCode).toBe(201);
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        login: "scrantonforever20@gmail.com", // Use the correct login identifier (email or username)
        password: "hello1234"
      });
    expect(response.statusCode).toBe(200);
    authToken = response.body.token; // Save the authentication token for future requests
  });

  it('should get user profile', async () => {
    const response = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${authToken}`); // Set the Authorization header with the token
    expect(response.statusCode).toBe(200);
  });

  it('should update user profile with password verification', async () => {
    const response = await request(app)
      .put('/users/profile')
      .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
      .send({
        name: "Michael Gary Scott",
        email: "scrantonforever20@gmail.com", // Use the correct email here
        password: "hello1234",
        username: "mscott"
      });
    expect(response.statusCode).toBe(200);
  });

  it('should log out a user', async () => {
    const response = await request(app)
      .get('/users/logout')
      .set('Authorization', `Bearer ${authToken}`); // Set the Authorization header with the token
    expect(response.statusCode).toBe(200);
  });
});