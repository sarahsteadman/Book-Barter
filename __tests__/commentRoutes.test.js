const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file

let server;
const commentIdToUpdate = '6692a8fc9116afb068df84f3';
const commentIdToDelete = '66995b65881b6f80ec5a745f';

beforeAll(done => {
  server = app.listen(9000, done);
});

afterAll(done => {
  server.close(done);
});

describe('Comment Routes', () => {
  it('should get all comments', async () => {
    const response = await request(app).get('/comments/');
    expect(response.statusCode).toBe(200);
  });

  it('should get a comment by ID', async () => {
    const response = await request(app).get(`/comments/${commentIdToUpdate}`);
    expect(response.statusCode).toBe(200);
  });

  it('should create a comment', async () => {
    const response = await request(app)
      .post('/comments/')
      .send({
        user: "mscott",
        swap: "Harry Potter",
        Comment: "I would like this book! My daughter would love to read it"
      });
    expect(response.statusCode).toBe(201);
  });

  it('should update a comment by ID', async () => {
    const response = await request(app)
      .put(`/comments/${commentIdToUpdate}`)
      .send({
        user: "mscott",
        swap: "The Little Prince",
        Comment: "I would like this book. It's my favorite"
      });
    expect(response.statusCode).toBe(201);
  });

  it('should delete a comment by ID', async () => {
    const response = await request(app).delete(`/comments/${commentIdToDelete}`);
    expect(response.statusCode).toBe(200);
  });
});