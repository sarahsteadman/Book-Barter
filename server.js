const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger_output.json');
const cors = require('cors');
const passport = require('./config/passport'); // Import Passport configuration
const session = require('express-session'); // Import express-session

dotenv.config();

const app = express();

// Database connection
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

// Configure express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ensure secure is false for local development
}));

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve Swagger UI at /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export the app instance