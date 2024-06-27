const mongoose = require('mongoose');
// Define user schema for MongoDB

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String },
});

module.exports = mongoose.model('User', userSchema);