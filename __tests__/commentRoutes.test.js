const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your server file
const Comment = require('../models/commentModel').comment; // Adjust the path to your comment model

describe('Comment Routes', () => {
  let commentIds = []; // Array to store IDs of created comments

  // Connect to the database before running tests
  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/bookbarter'; // Use your main database URI
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  });

  // Clean up the specific comments created during tests
  afterEach(async () => {
    await Comment.deleteMany({ _id: { $in: commentIds } });
    commentIds = []; // Reset the array after cleanup
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Test for getting all comments
  it('should get all comments', async () => {
    const res = await request(app).get('/comments');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test for adding a new comment
  it('should add a new comment', async () => {
    const newComment = {
      user: 'mscott',
      swap: 'The Little Prince',
      Comment: 'I would like this book!',
    };

    const res = await request(app)
      .post('/comments')
      .send(newComment);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Comment created!');
    const createdComment = await Comment.findOne(newComment);
    expect(createdComment).toHaveProperty('_id');
    commentIds.push(createdComment._id); // Store the comment ID for future cleanup
  });

  // Test for getting a comment by ID
  it('should get a comment by ID', async () => {
    // First, add a new comment to get its ID
    const newComment = new Comment({
      user: 'mscott',
      swap: 'The Little Prince',
      Comment: 'I would like this book!',
    });
    const savedComment = await newComment.save();
    commentIds.push(savedComment._id); // Store the comment ID for future cleanup

    const res = await request(app).get(`/comments/${savedComment._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', savedComment._id.toString());
  });

  // Test for updating a comment by ID
  it('should update a comment by ID', async () => {
    // First, add a new comment to get its ID
    const newComment = new Comment({
      user: 'mscott',
      swap: 'The Little Prince',
      Comment: 'I would like this book!',
    });
    const savedComment = await newComment.save();
    commentIds.push(savedComment._id); // Store the comment ID for future cleanup

    const updatedComment = {
      user: 'mscott',
      swap: 'The Little Prince',
      Comment: 'I would really like this book!',
    };

    const res = await request(app)
      .put(`/comments/${savedComment._id}`)
      .send(updatedComment);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Comment updated');
    const fetchedComment = await Comment.findById(savedComment._id);
    expect(fetchedComment).toHaveProperty('Comment', 'I would really like this book!');
  });

  // Test for deleting a comment by ID
  it('should delete a comment by ID', async () => {
    // First, add a new comment to get its ID
    const newComment = new Comment({
      user: 'mscott',
      swap: 'The Little Prince',
      Comment: 'I would like this book!',
    });
    const savedComment = await newComment.save();
    commentIds.push(savedComment._id); // Store the comment ID for future cleanup

    const res = await request(app).delete(`/comments/${savedComment._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Comment deleted');
    const deletedComment = await Comment.findById(savedComment._id);
    expect(deletedComment).toBeNull();
  });
});