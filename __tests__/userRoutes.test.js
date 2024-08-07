const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/userModel');
const mockAuth = require('../__tests__/__mocks__/mockAuth');

const dbUrl = 'mongodb://localhost:27017/bookbarter-test';
let testUserIds = [];
jest.mock('../middlewares/auth.js', () => require('../__tests__/__mocks__/mockAuth'));

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  }
});

afterEach(async () => {
  if (testUserIds.length > 0) {
    await User.deleteMany({ _id: { $in: testUserIds } });
  }
  testUserIds = [];
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

const createUser = async (userData) => {
  const response = await request(app)
    .post('/users/register')
    .send(userData);

  const user = await User.findOne({ email: userData.email });
  if (user) {
    testUserIds.push(user._id);
  }

  return response;
};

const loginUser = async (loginData) => {
  const response = await request(app)
    .post('/users/login')
    .send(loginData);

  return response;
};

describe('User Routes', () => {
  test('should register a user', async () => {
    const userData = {
      name: 'John Doe',
      email: `john.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'johndoe'
    };

    const response = await createUser(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');

    const user = await User.findOne({ email: userData.email });
    expect(user).toBeTruthy();
  });

  test('should log in a user', async () => {
    const userData = {
      name: 'Jane Doe',
      email: `jane.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'janedoe'
    };

    const creation = await createUser(userData);
    expect(creation.body.message).toBe('User registered successfully');

    const loginData = {
      login: userData.email,
      password: userData.password
    };

    const response = await loginUser(loginData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User Successfully logged in');
    expect(response.body.token).toBeDefined();
  });

  test('should get user profile', async () => {
    const userData = {
      name: 'Emily Doe',
      email: `emily.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'emilydoe'
    };

    const creation = await createUser(userData);
    expect(creation.body.message).toBe('User registered successfully');
    expect(creation.body.user).toBeDefined();

    mockAuth.setMockUser({ _id: creation.body.user._id, email: userData.email });

    const loginData = {
      login: userData.email,
      password: userData.password
    };

    const loginResponse = await loginUser(loginData);
    const token = loginResponse.body.token;

    const profileResponse = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user).toBeDefined();
    expect(profileResponse.body.user.email).toBe(userData.email);
  });

  test('should update user profile', async () => {
    const userData = {
      name: 'Emily Doe',
      email: `emily.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'emilydoe'
    };

    const creation = await createUser(userData);
    expect(creation.body.message).toBe('User registered successfully');
    expect(creation.body.user).toBeDefined();

    mockAuth.setMockUser({ _id: creation.body.user._id, email: userData.email });

    const loginData = {
      login: userData.email,
      password: userData.password
    };

    const loginResponse = await loginUser(loginData);
    const token = loginResponse.body.token;

    const updateData = {
      name: 'Emily Doe',
      email: `emily.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'emilydoeudpated'
    };

    // Log the current state before making the update request
    console.log('Original User Data:', userData);
    console.log('Update Data:', updateData);
    console.log('Token:', token);

    const updateResponse = await request(app)
      .put('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    // Log the response from the update request
    console.log('Update Response Status:', updateResponse.status);
    console.log('Update Response Body:', updateResponse.body);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('Profile updated successfully');

    // Verify that the user's data has been updated in the database
    const updatedUser = await User.findById(creation.body.user._id);
    console.log('Updated User in Database:', updatedUser);

    expect(updatedUser.name).toBe(updateData.name);
    expect(updatedUser.email).toBe(updateData.email);
    expect(updatedUser.username).toBe(updateData.username);
  });

  test('should log out a user', async () => {
    const userData = {
      name: 'Logan Doe',
      email: `logan.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'logandoe'
    };

    const creation = await createUser(userData);
    expect(creation.body.message).toBe('User registered successfully');

    const loginData = {
      login: userData.email,
      password: userData.password
    };

    const loginResponse = await loginUser(loginData);
    const token = loginResponse.body.token;

    const logoutResponse = await request(app)
      .get('/users/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe('User logged out successfully');
  });
});