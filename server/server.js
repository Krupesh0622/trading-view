require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const marketService = require('./services/marketService');

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5001'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
const SYMBOL = '^NSEI';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
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
        await marketService.syncHistoricalData("1m", SYMBOL);
        const history = await marketService.getHistory({ symbol: SYMBOL, limit: 1000, skip: 0, sort: { time: 1 } });
        const historyCount = await marketService.getHistoryCount({ symbol: SYMBOL });
        console.log('history', history.length, historyCount);
        res.json({ history, historyCount });
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
}, 1000);

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
