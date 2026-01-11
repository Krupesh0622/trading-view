const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    symbol: { type: String, required: true, index: true },
    time: { type: Number, required: true, index: true, unique: true }, // Unix timestamp (seconds)
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
}, {
    timestamps: true,
    versionKey: false
});

// Composite index for fast lookups
priceSchema.index({ symbol: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('PriceData', priceSchema);
