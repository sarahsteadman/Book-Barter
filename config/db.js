const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Connect to MongoDB database using Mongoose.
 */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          // MongoDB connection options can be added here if needed

        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1); // Exit process with failure on connection error
    }
};

module.exports = connectDB;