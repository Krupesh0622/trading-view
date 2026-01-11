require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const marketService = require('./services/marketService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Check if URI is provided
if (!MONGODB_URI) {
    console.warn("WARNING: MONGODB_URI is likely missing from .env file!");
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/nifty-chart')
    .then(async () => {
        console.log('Connected to MongoDB');
        await marketService.initialize();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// API
app.get('/api/history', async (req, res) => {
    try {
        const history = await marketService.getHistory();

        const letestHistory = [history[history.length - 1]];
        console.log('letestHistory', letestHistory);
        // If history is empty (first run or db issue), try to generate/fetch immediate
        const nowInSeconds = Math.floor(Date.now() / 1000); // current time in seconds
        const oneMinuteAgo = nowInSeconds - 60;
        if (letestHistory?.time >= oneMinuteAgo &&
            letestHistory?.time <= nowInSeconds
        ) {
            console.log('No history in DB, fetching...');
            await marketService.syncHistoricalData();
            const freshHistory = await marketService.getHistory();
            return res.json(freshHistory);
        }
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Real-time Polling
io.on('connection', (socket) => {
    console.log('Client connected');
});

// Poll Yahoo Finance every 5 seconds for "Live" updates
setInterval(async () => {
    const tick = await marketService.getLatestPrice();
    if (tick) {
        io.emit('priceUpdate', tick);
        // We could also save this tick to DB as a new 1-minute candle if needed
    }
}, 5000);

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
