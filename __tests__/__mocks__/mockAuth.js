// __mocks__/mockAuth.js

const isLoggedOn = (req, res, next) => {
    // This mock function just calls next() to simulate a logged-in user.
    return next();
};

const isCreator = async (req, type, id, res) => {
    // This mock function always returns true.
    return true;
};

module.exports = {
    isLoggedOn,
    isCreator,
};
