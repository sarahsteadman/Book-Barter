const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your server file
const Book = require('../models/bookModel'); // Adjust the path to your book model

describe('Book Routes', () => {
  let bookIds = []; // Array to store IDs of created books

  // Connect to the database before running tests
  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/bookbarter'; // Use your main database URI
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  });

  // Clean up the specific books created during tests
  afterEach(async () => {
    await Book.deleteMany({ _id: { $in: bookIds } });
    bookIds = []; // Reset the array after cleanup
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Test for getting all books
  it('should get all books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test for adding a new book
  it('should add a new book', async () => {
    const newBook = {
      genre: 'fantasy',
      condition: 'Like New',
      ISBN: '9780375891892',
      swap: 'unknown',
    };

    const res = await request(app)
      .post('/books/addBook')
      .send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.book).toHaveProperty('_id');
    bookIds.push(res.body.book._id); // Store the book ID for future cleanup
  });

  // Test for getting a book by ID
  it('should get a book by ID', async () => {
    // First, add a new book to get its ID
    const newBook = new Book({
      title: 'Sample Book',
      author: 'Author Name',
      description: 'Sample description',
      genre: 'fantasy',
      condition: 'Like New',
      ISBN: '1234567890',
      swap: 'unknown',
    });
    const savedBook = await newBook.save();
    bookIds.push(savedBook._id); // Store the book ID for future cleanup

    const res = await request(app).get(`/books/${savedBook._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', savedBook._id.toString());
  });

  // Test for updating a book by ID
  it('should update a book by ID', async () => {
    // First, add a new book to get its ID
    const newBook = new Book({
      title: 'Sample Book',
      author: 'Author Name',
      description: 'Sample description',
      genre: 'fantasy',
      condition: 'Like New',
      ISBN: '1234567890',
      swap: 'unknown',
    });
    const savedBook = await newBook.save();
    bookIds.push(savedBook._id); // Store the book ID for future cleanup

    const updatedBook = {
      title: 'Updated Title',
      author: 'Updated Author',
      description: 'Updated description',
      genre: 'fantasy',
      condition: 'Worn',
      ISBN: '9780156012195',
      swap: 'unknown',
    };

    const res = await request(app)
      .put(`/books/updateBook/${savedBook._id}`)
      .send(updatedBook);
    expect(res.statusCode).toBe(201);
    expect(res.body.book).toHaveProperty('title', 'Updated Title');
  });

  // Test for deleting a book by ID
  it('should delete a book by ID', async () => {
    // First, add a new book to get its ID
    const newBook = new Book({
      title: 'Sample Book',
      author: 'Author Name',
      description: 'Sample description',
      genre: 'fantasy',
      condition: 'Like New',
      ISBN: '1234567890',
      swap: 'unknown',
    });
    const savedBook = await newBook.save();
    bookIds.push(savedBook._id); // Store the book ID for future cleanup

    const res = await request(app).delete(`/books/deleteBook/${savedBook._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Book deleted');
  });
});