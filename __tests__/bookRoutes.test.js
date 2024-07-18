const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file

let server;
const bookIdToUpdate = '668f60a17ccffaa7e55a3d6f'; // Replace with an actual ID from your database
const bookIdToDelete = '669959b62ccda5fbb3ce08f6'; // Replace with an actual ID from your database

beforeAll(async () => {
  server = await app.listen(9000);
});

afterAll(async () => {
  await server.close();
});

describe('Book Routes', () => {
  it('should get all books', async () => {
    const response = await request(app).get('/books/');
    expect(response.statusCode).toBe(200);
  });

  it('should get a book by ID', async () => {
    const response = await request(app).get(`/books/${bookIdToUpdate}`);
    expect(response.statusCode).toBe(200);
  });

  it('should add a book', async () => {
    const response = await request(app)
      .post('/books/addBook/')
      .send({
        genre: "fantasy",
        condition: "Like New",
        ISBN: "9780375891892",
        swap: "unknown"
      });
    expect(response.statusCode).toBe(201);
  });

  it('should update a book by ID', async () => {
    const response = await request(app)
      .put(`/books/updateBook/${bookIdToUpdate}`)
      .send({
        title: "The Little Prince",
        author: "Antoine de Saint−Exupery",
        description: "The Little Prince (French: Le Petit Prince) is a novella by French aristocrat, writer, and aviator Antoine de Saint-Exupéry. It was first published in English and French in the US by Reynal & Hitchcock in April 1943, and posthumously in France following the liberation of France as Saint-Exupéry's works had been banned by the Vichy Regime. The story follows a young prince who visits various planets in space, including Earth, and addresses themes of loneliness, friendship, love, and loss. Despite its style as a children's book, The Little Prince makes observations about life, adults, and human nature. The Little Prince became Saint-Exupéry's most successful work, selling an estimated 140 million copies worldwide, which makes it one of the best-selling and most translated books ever published. It has been translated into 301 languages and dialects. The Little Prince has been adapted to numerous art forms and media, including audio recordings, radio plays, live stage, film, television, ballet, and opera.",
        genre: "fantasy",
        condition: "like new",
        ISBN: "9780156012195",
        swap: "unknown"
      });
    expect(response.statusCode).toBe(201);
  });

  it('should delete a book by ID', async () => {
    const response = await request(app).delete(`/books/deleteBook/${bookIdToDelete}`);
    expect(response.statusCode).toBe(200);
  });
});