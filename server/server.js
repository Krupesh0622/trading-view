require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
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

// Connect to Database
connectDB();

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

server.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
});
