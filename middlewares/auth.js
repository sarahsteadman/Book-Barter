const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isLoggedOn = async (req, res, next) => {
  console.log('Entering isLoggedOn middleware'); // Log entry into the middleware

  try {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Log the Authorization header

    if (!authHeader) {
      console.error('Authorization header missing'); // Log missing header
      return res.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Log the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log decoded token details

    const user = await User.findById(decoded.id);
    console.log('User from Database:', user); // Log the user fetched from the database

    if (!user) {
      console.error('User not found'); // Log if user is not found
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message); // Log the error message
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
const isCreator = async (req, type, id, res) => {
  console.log('In isCreator middleware'); // Log entry into the middleware

  try {
    const userId = req.user._id;
    console.log('User ID:', userId); // Log user ID

    let item;
    if (type === 'swap') {
      item = await Swap.swap.findById(id);
    } else if (type === 'comment') {
      item = await comment.comment.findById(id);
    } else if (type === 'book') {
      item = await bookModel.findById(id);
    } else {
      throw new Error('Invalid type');
    }

    console.log('Item from Database:', item); // Log the item fetched from the database

    if (!item) {
      console.error('Item not found'); // Log if item is not found
      throw new Error('Item not found');
    }

    if (item.user.toString() !== userId.toString()) {
      console.error('Forbidden: You are not the creator of this item'); // Log if user is not the creator
      throw new Error('Forbidden: You are not the creator of this item');
    }

  } catch (error) {
    console.error('Error in isCreator middleware:', error.message); // Log the error message
    throw new Error(`Cannot determine if you are the owner: ${error.message}`);
  }
};

function convertToObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}




module.exports = {
  isLoggedOn,
  isCreator
};