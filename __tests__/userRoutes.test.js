const request = require('supertest');
const app = require('../server'); // Your server file
const User = require('../models/userModel');
const mongoose = require('mongoose');

let testUserIds = [];
const dbUrl = 'mongodb://localhost:27017/bookbarter-test';


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

  console.log('Login Response:', response.body); // Debugging
  console.log('Login Response Status:', response.status); // Debugging

  return response;
};

// /////////////////////////////////////////////////TESTS////////////////////////////////////////////////////////////////

describe('User Routes', () => {

  // Register
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

  //Log in
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
      login: userData.email, // Ensure this matches what your server expects
      password: userData.password
    };

    const response = await loginUser(loginData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User Successfully logged in');
    expect(response.body.token).toBeDefined(); // Ensure token is returned
  });

  //Get Profile
  test('should get user profile', async () => {
    const userData = {
      name: 'Emily Doe',
      email: `emily.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'emilydoe'
    };

    await createUser(userData);

    const loginData = {
      login: userData.email,
      password: userData.password
    };

    const loginResponse = await loginUser(loginData);
    const token = loginResponse.body.token;

    console.log('Profile Token:', token); // Debugging

    const profileResponse = await request(app)
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);

    console.log('Profile Response Status:', profileResponse.status); // Debugging
    console.log('Profile Response Body:', profileResponse.body); // Debugging

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user).toBeDefined();
    expect(profileResponse.body.user.email).toBe(userData.email);
  });

  //Update Profile
  test('should update user profile', async () => {
    const userData = {
      name: 'Sarah Doe',
      email: `sarah.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'sarahdoe'
    };

    await createUser(userData);

    const loginData = {
      login: userData.email, // Ensure this matches what your server expects
      password: userData.password
    };

    const loginResponse = await loginUser(loginData);
    const token = loginResponse.body.token;

    const updateData = {
      name: 'Sarah Updated',
      email: 'sarah.updated@example.com',
      username: 'sarahupdated'
    };

    const updateResponse = await request(app)
      .put('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    console.log('Update Response Status:', updateResponse.status); // Debugging
    console.log('Update Response Body:', updateResponse.body); // Debugging

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('Profile updated successfully');
  });

  //LogOut
  test('should log out a user', async () => {
    const userData = {
      name: 'Logan Doe',
      email: `logan.doe${Date.now()}@example.com`,
      password: 'Password123',
      username: 'logandoe'
    };

    await createUser(userData);

    const loginData = {
      login: userData.email, // Ensure this matches what your server expects
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