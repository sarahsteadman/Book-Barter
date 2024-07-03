// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
        user = new User({
            googleId: id,
            name: displayName,
            email: emails[0].value, // Assuming the first email is primary
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