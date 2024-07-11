// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto'); // Import crypto module
const bcrypt = require('bcrypt'); // Import bcrypt module
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Configure Passport with Google OAuth 2.0 strategy for authentication.
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/users/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    try {
        let user = await User.findOne({ googleId: id });
        if (user) {
            return done(null, user); // User exists in the database
        }

        // User doesn't exist, create a new user
        const username = emails[0].value.split('@')[0]; // Default username based on email prefix
        const randomPassword = crypto.randomBytes(16).toString('hex'); // Generate a random password
        const hashedPassword = await bcrypt.hash(randomPassword, 12); // Hash the random password

        user = new User({
            googleId: id,
            name: displayName,
            email: emails[0].value, // Assuming the first email is primary
            username: username, // Set the default username
            password: hashedPassword, // Save the hashed random password
        });
        await user.save();
        done(null, user); // Return the newly created user
    } catch (error) {
        done(error, false); // Handle errors during user creation
    }
}));

/**
 * Serialize user ID into the session.
 */
passport.serializeUser((user, done) => {
    done(null, user.id); 
});

/**
 * Deserialize user from the session based on user ID.
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Deserialize user from the session
    } catch (error) {
        done(error, false); // Handle errors during deserialization
    }
});

module.exports = passport;