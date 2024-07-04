const mongoose = require('mongoose');

// Define user schema for MongoDB
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'], 
        minlength: [3, 'Name must be at least 3 characters long'], 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
    },
    password: { 
        type: String, 
        required: function() { return !this.googleId; }, // Password required if not using Google OAuth
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function(v) {
                return /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(v); // At least one capital letter, one number, and min 6 characters
            },
            message: props => 'Password must be at least 6 characters long and contain at least one capital letter and one number'
        }
    },
    googleId: { 
        type: String 
    },
    username: { 
        type: String, 
        required: [true, 'Username is required'], 
        unique: true, 
        minlength: [3, 'Username must be at least 3 characters long'], 
        maxlength: [30, 'Username cannot exceed 30 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+$/.test(v); // Allow only alphanumeric characters
            },
            message: props => `${props.value} is not a valid username! Only alphanumeric characters are allowed.`
        }
    }
});

module.exports = mongoose.model('User', userSchema);