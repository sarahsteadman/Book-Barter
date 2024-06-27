// userRoutes.js
const express = require('express');
const passport = require('passport');
const isLoggedOn = require('../middlewares/auth');
const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

// Google OAuth authentication routes

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('Google OAuth callback route accessed');

    const { id, displayName, emails } = req.user;

    let user = await User.findOne({ googleId: id });
    if (!user) {
        user = new User({
            googleId: id,
            name: displayName,
            email: emails[0].value
        });
        await user.save();
    }

    req.login(user, err => {
        if (err) {
            console.error('Error logging in user:', err);
            return res.redirect('/login');
        }
        console.log('User logged in successfully');
        console.log('Session after login:', req.session);
        res.redirect('/');
    });
});

// User profile routes

router.get('/profile', isLoggedOn, getUserProfile);
router.put('/profile', isLoggedOn, updateUserProfile);

module.exports = router;