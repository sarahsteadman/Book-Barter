const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isLoggedOn = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id);


    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error); // Debugging line
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { isLoggedOn };