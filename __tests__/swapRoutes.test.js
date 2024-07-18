const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your server file
const Swap = require('../models/swapsModel').swap; // Adjust the path to your swap model

describe('Swap Routes', () => {
  let swapIds = []; // Array to store IDs of created swaps

  // Connect to the database before running tests
  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/bookbarter'; // Use your main database URI
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  });

  // Clean up the specific swaps created during tests
  afterEach(async () => {
    await Swap.deleteMany({ _id: { $in: swapIds } });
    swapIds = []; // Reset the array after cleanup
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Test for getting all swaps
  it('should get all swaps', async () => {
    const res = await request(app).get('/swaps');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test for adding a new swap
  it('should add a new swap', async () => {
    const newSwap = {
      user: '667c836fd4985e072a44e1ca',
      book: '667f8e927be85037cf3b746b',
      Description: 'Willing to trade for a hardcover fantasy book.',
      Location: 'Bentonville, Arkansas',
    };

    const res = await request(app)
      .post('/swaps')
      .send(newSwap);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Swap created!');
    const createdSwap = await Swap.findOne(newSwap);
    expect(createdSwap).toHaveProperty('_id');
    swapIds.push(createdSwap._id); // Store the swap ID for future cleanup
  });

  // Test for getting a swap by ID
  it('should get a swap by ID', async () => {
    // First, add a new swap to get its ID
    const newSwap = new Swap({
      user: '667c836fd4985e072a44e1ca',
      book: '667f8e927be85037cf3b746b',
      Description: 'Willing to trade for a hardcover fantasy book.',
      Location: 'Bentonville, Arkansas',
    });
    const savedSwap = await newSwap.save();
    swapIds.push(savedSwap._id); // Store the swap ID for future cleanup

    const res = await request(app).get(`/swaps/${savedSwap._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', savedSwap._id.toString());
  });

  // Test for updating a swap by ID
  it('should update a swap by ID', async () => {
    // First, add a new swap to get its ID
    const newSwap = new Swap({
      user: '667c836fd4985e072a44e1ca',
      book: '667f8e927be85037cf3b746b',
      Description: 'Willing to trade for a hardcover fantasy book.',
      Location: 'Bentonville, Arkansas',
    });
    const savedSwap = await newSwap.save();
    swapIds.push(savedSwap._id); // Store the swap ID for future cleanup

    const updatedSwap = {
      user: '667c836fd4985e072a44e1ca',
      book: '667f8e927be85037cf3b746b',
      Description: 'Willing to trade for a hardcover mystery book.',
      Location: 'Bryant, Arkansas',
    };

    const res = await request(app)
      .put(`/swaps/${savedSwap._id}`)
      .send(updatedSwap);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Swap updated');
    const fetchedSwap = await Swap.findById(savedSwap._id);
    expect(fetchedSwap).toHaveProperty('Description', 'Willing to trade for a hardcover mystery book.');
  });

  // Test for deleting a swap by ID
  it('should delete a swap by ID', async () => {
    // First, add a new swap to get its ID
    const newSwap = new Swap({
      user: '667c836fd4985e072a44e1ca',
      book: '667f8e927be85037cf3b746b',
      Description: 'Willing to trade for a hardcover fantasy book.',
      Location: 'Bentonville, Arkansas',
    });
    const savedSwap = await newSwap.save();
    swapIds.push(savedSwap._id); // Store the swap ID for future cleanup

    const res = await request(app).delete(`/swaps/${savedSwap._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Swap removed');
    const deletedSwap = await Swap.findById(savedSwap._id);
    expect(deletedSwap).toBeNull();
  });
});