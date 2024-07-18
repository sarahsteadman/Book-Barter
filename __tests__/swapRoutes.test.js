const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file

let server;
let authToken; // Variable to store the authentication token
const swapIdToUpdate = '66995f929290d13acb5bf744';
const swapIdToDelete = '66995f949290d13acb5bf747';

// User credentials for testing
const testUserEmail = 'northpolecaptain@gmail.com'; // Replace with your test user's email
const testUserPassword = 'hello1234'; // Replace with your test user's password

beforeAll(async () => {
  return new Promise((resolve) => {
    server = app.listen(9000, async () => {
      // Perform login or obtain auth token
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: testUserEmail,
          password: testUserPassword,
        });

      authToken = loginResponse.body.token; // Store the auth token
      resolve();
    });
  });
});

afterAll(async () => {
  await server.close();
});

describe('Swap Routes', () => {
  it('should get all swaps', async () => {
    const response = await request(app).get('/swaps/');
    expect(response.statusCode).toBe(200);
  });

  it('should get a swap by ID', async () => {
    const response = await request(app).get(`/swaps/${swapIdToUpdate}`);
    expect(response.statusCode).toBe(200);
  });

  it('should create a swap', async () => {
    const response = await request(app)
      .post('/swaps/')
      .set('Authorization', `Bearer ${authToken}`) // Include the auth token in headers
      .send({
        user: "6680374d84ac2a468db8b1b3", // Example user ID
        book: "667f8e927be85037cf3b746b", // Example book ID
        Description: "Willing to trade for a hardcover fantasy book.",
        Location: "Bentonville, Arkansas"
      });

    expect(response.statusCode).toBe(201);
  });

  it('should update a swap by ID', async () => {
    const response = await request(app)
      .put(`/swaps/${swapIdToUpdate}`)
      .set('Authorization', `Bearer ${authToken}`) // Include the auth token in headers
      .send({
        user: "6680374d84ac2a468db8b1b3", // Example user ID
        book: "667f8e927be85037cf3b746b", // Example book ID
        Description: "Willing to trade for a hardcover Romance book.",
        Location: "Bryant, Arkansas"
      });

    expect(response.statusCode).toBe(200);
  });

  it('should delete a swap by ID', async () => {
    const response = await request(app)
      .delete(`/swaps/${swapIdToDelete}`)
      .set('Authorization', `Bearer ${authToken}`); // Include the auth token in headers

    expect(response.statusCode).toBe(200);
  });
});