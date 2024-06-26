// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:9000/users/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    try {
        let user = await User.findOne({ googleId: id });
        if (user) {
            return done(null, user);
        }

        user = new User({
            googleId: id,
            name: displayName,
            email: emails[0].value,
        });
        await user.save();
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = passport;
