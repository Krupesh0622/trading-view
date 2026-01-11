const INITIAL_PRICE = 26145.35;
const VOLATILITY = 2.0; // Small movements for Nifty 50 ticks

class MarketSimulator {
    constructor() {
        this.currentPrice = INITIAL_PRICE;
        this.lastCandle = null;
        this.history = [];
    }

    // Generate simulated historical data
    generateHistory(count = 100) {
        let time = new Date().getTime() - count * 60 * 1000; // start 'count' minutes ago
        let price = INITIAL_PRICE - (Math.random() * 100 - 50);

        this.history = [];

        for (let i = 0; i < count; i++) {
            const open = price;
            const close = open + (Math.random() * 10 - 5);
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;
            const volume = Math.floor(Math.random() * 10000) + 1000;

            // Simple timestamp for every minute
            time += 60 * 1000;
            
            this.history.push({
                time: time / 1000, // Lightweight charts uses seconds
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: volume
            });

            price = close;
        }

        this.lastCandle = this.history[this.history.length - 1];
        this.currentPrice = this.lastCandle.close;
        
        return this.history;
    }

    // Simulate "ticking" (live price updates)
    startTicking(onTick) {
        setInterval(() => {
            const move = (Math.random() - 0.5) * VOLATILITY;
            this.currentPrice += move;
            
            // Update last candle logic or just send tick
            // For simplicity, we just send a new price update.
            // In a real app, we'd manage the current candle formation.
            
            const tick = {
                price: parseFloat(this.currentPrice.toFixed(2)),
                time: Math.floor(Date.now() / 1000),
                volume: Math.floor(Math.random() * 100)
            };

            onTick(tick);
        }, 1000); // 1 tick per second
    }
}

module.exports = new MarketSimulator();
