const mongoose = require('mongoose');
// Define user schema for MongoDB

const swapSchema = new mongoose.Schema({
    user: { type: String, min: 24, max: 24, required: true},
    book: { type: String, min: 24, max: 24, required: false },
    Description: { type: String, max: [300, 'Description too long.'], required: false },
    Location: {type: String, required: [true, 'Must include a location.']}
});

const swap = mongoose.model('Swaps', swapSchema);
module.exports = {swap};