const mongoose = require('mongoose');
const marketService = require('../services/marketService');

// Set custom DNS servers to avoid potential resolution issues
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        console.log('MONGODB_URI', MONGODB_URI);
        
        if (!MONGODB_URI) {
            console.warn("WARNING: MONGODB_URI is likely missing from .env file!");
        }

        await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/nifty-chart');
        console.log('Connected to MongoDB');
        
        // Initialize services that depend on DB connection
        await marketService.initialize();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
