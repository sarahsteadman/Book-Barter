const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const routes = require('./routes');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));