const mongoose = require('mongoose');
// Define user schema for MongoDB

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String },
    username: { type: String, required: false, unique: true }, // Add username field
});

module.exports = mongoose.model('User', userSchema);