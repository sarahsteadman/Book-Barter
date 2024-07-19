// __mocks__/mockAuth.js
const mockUser = {}; // This will hold user data that you set in your tests

module.exports = {
  isLoggedOn: (req, res, next) => {
    // Use a dynamic user ID based on the mockUser
    req.user = mockUser;
    next();
  },
  isCreator: (req, res, next) => {
    // Simulate a creator check
    next();
  },
  setMockUser: (user) => {
    mockUser._id = user._id;
    mockUser.email = user.email;
  }
};