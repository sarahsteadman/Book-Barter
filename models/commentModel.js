const mongoose = require('mongoose');
// Define user schema for MongoDB

const commentSchema = new mongoose.Schema({
    user: { type: String, min: 24, max: 24, required: false},
    book: { type: String, min: 24, max: 24, required: false },
    Comment: { type: String, max: [300, 'Comment is too long.'], required: false },
    Date: {type: Date, default: Date.now}
});

const comment = mongoose.model('comment', commentSchema);
module.exports = {comment};