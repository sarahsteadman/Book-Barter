// __mocks__/mockAuth.js
module.exports = (req, res, next) => {
    req.user = {
        _id: 'testUserId',
        username: 'testUser',
        email: 'test@example.com'
        
    };
    next();
};

