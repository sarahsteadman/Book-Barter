const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'User logged out successfully' });
    });
};


const googleAuth = async (req, res) => {
    try {
        // You can access user details from req.user after authentication
        const { id, displayName, emails } = req.user;

        // Check if user already exists in your database
        let user = await User.findOne({ googleId: id });

        if (!user) {
            // If user doesn't exist, create a new user without password
            user = new User({
                googleId: id,
                name: displayName,
                email: emails[0].value,
            });
            await user.save();
        }

        // Optionally, you can generate a JWT token and return it here
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Fetch user profile
const getUserProfile = async (req, res) => {
    try {
        // Fetch user details from request object (assuming passport places user in req.user)
        const user = req.user; // This assumes req.user contains the authenticated user object
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        // Fetch user details from request object (assuming passport places user in req.user)
        let user = req.user; // This assumes req.user contains the authenticated user object

        // Update user details
        user.name = name;
        user.email = email;

        // Save updated user
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    googleAuth,
    getUserProfile, 
    updateUserProfile,
};