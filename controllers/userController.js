const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const registerUser = async (req, res) => {
    const { name, email, password, username } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword, username });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: newUser._id, name: newUser.name, email: newUser.email, username: newUser.username } // Include user details
        });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




const loginUser = async (req, res) => {
    const { login, password } = req.body; // 'login' can be either email or username

    try {
        // Check if the login input is an email or username
        let user;
        if (login.includes('@')) {
            // Assume it's an email
            user = await User.findOne({ email: login });
        } else {
            // Assume it's a username
            user = await User.findOne({ username: login });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Log in the user
        req.login(user, err => {
            if (err) {
                console.error('Error logging in user:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            console.log('User logged in successfully');
            console.log('Session after login:', req.session);

            // Optionally, you can generate a JWT token and return it here
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'User Successfully logged in', token, user: { id: user._id, name: user.name, email: user.email, username: user.username } });
        });
    } catch (error) {
        console.error('Error in loginUser:', error);
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
            // If user doesn't exist, create a new user with a random password
            let username = emails[0].value.split('@')[0]; // Default username based on email
            const randomPassword = crypto.randomBytes(16).toString('hex'); // Generate a random password
            const hashedPassword = await bcrypt.hash(randomPassword, 12); // Hash the random password

            user = new User({
                googleId: id,
                name: displayName,
                email: emails[0].value,
                username: username, // Set the default username
                password: hashedPassword, // Save the hashed random password
            });
            await user.save();
        }

        // Optionally, you can generate a JWT token and return it here
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, username: user.username } });
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

const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user properties
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.username = req.body.username || user.username;
  
      await user.save(); // Save the updated user document
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

const updateUserUsername = async (req, res) => {
    const { userId, username } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Update the user's username
        user.username = username;
        await user.save();

        res.json({ message: 'Username updated successfully', user });
    } catch (error) {
        console.error('Error in updateUserUsername:', error);
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
    updateUserUsername
};