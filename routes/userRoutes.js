const express = require('express');
const passport = require('passport');
const User = require('../models/userModel');
const isLoggedOn = require('../middlewares/auth');
const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updateUserUsername } = require('../controllers/userController');
const router = express.Router();

// Register, login, and logout routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Google OAuth authentication routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const { id, name, email } = req.user;

      // Log the Google OAuth response to inspect its contents
      console.log('Google OAuth response:', req.user);

      // Check if required fields are present
      if (!id || !name || !email) {
        throw new Error('Google OAuth response missing required fields');
      }

      // Find user by Google ID
      let user = await User.findOne({ googleId: id });

      if (!user) {
        // User doesn't exist, create a new user
        const username = email.split('@')[0]; // Default username based on email
        user = new User({
          googleId: id,
          name,
          email,
          username: username // Set the default username
        });

        await user.save();
      }

      // Log in the user
      req.login(user, err => {
        if (err) {
          console.error('Error logging in user:', err);
          return res.redirect('/login');
        }
        console.log('User logged in successfully');
        console.log('Session after login:', req.session);
        res.redirect('/'); // Redirect to home page after successful login
      });
    } catch (error) {
      // Handle specific duplicate key error for email
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
        console.log(`User with email ${req.user.email} already exists.`);
        // Find existing user by email and log in
        try {
          const existingUser = await User.findOne({ email: req.user.email });
          if (!existingUser) {
            throw new Error('User not found');
          }
          // Log in the existing user
          req.login(existingUser, err => {
            if (err) {
              console.error('Error logging in user:', err);
              return res.redirect('/login');
            }
            console.log('User logged in successfully');
            console.log('Session after login:', req.session);
            res.redirect('/'); // Redirect to home page after successful login
          });
        } catch (err) {
          console.error('Error finding existing user:', err);
          res.status(500).json({ message: 'Server error' });
        }
      } else {
        console.error('Error in Google OAuth callback:', error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
// User profile routes
router.get('/profile', isLoggedOn, getUserProfile);
router.put('/profile', isLoggedOn, updateUserProfile);

module.exports = router;