const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});
const PriceData = require('../models/PriceData');

const SYMBOL = '^NSEI'; // Nifty 50

class MarketService {
    async initialize() {
        console.log('Initializing Market Service...');
        await this.syncHistoricalData('1m');
    }

    async syncHistoricalData(interval, symbol = '^NSEI') {
        try {
            console.log(`Fetching 5-minute intraday data for ${symbol}...`);

            // Calculate date 7 days ago (Yahoo limit is ~7 days for 1m)
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            const queryOptions = {
                period1: startDate.toISOString().split('T')[0],
                interval
            };

            const result = await yahooFinance.chart(symbol, queryOptions);
            const quotes = result.quotes;

            const letestHistory = await PriceData.findOne({ symbol })
                .sort({ time: -1 });

            console.log('letestHistory', letestHistory);
            if (letestHistory) {
                const bulkAdd = quotes.reduce((acc, quote) => {
                    const quoteTimeS = Math.floor(new Date(quote.date).getTime() / 1000);
                    if (!letestHistory || letestHistory?.time < quoteTimeS) {
                        const { open, high, low, close, volume } = quote;
                        acc.push({
                            symbol,
                            time: quoteTimeS,
                            open,
                            high,
                            low,
                            close,
                            volume
                        });
                    }
                    return acc;
                }, []);

                console.log('bulkAdd.length', bulkAdd.length);
                if (bulkAdd.length > 0) {
                    await PriceData.insertMany(bulkAdd);
                    console.log(`Synced ${bulkAdd.length} historical records.`);
                }
            }

        } catch (error) {
            console.error('Error syncing historical data:', error);
        }
    }

    async getHistory() {
        return await PriceData.find({ symbol: SYMBOL }).sort({ time: 1 }).lean();
    }

    async getLatestPrice() {
        try {
            const quote = await yahooFinance.quote(SYMBOL);
            if (quote) {
                return {
                    price: quote.regularMarketPrice,
                    time: Math.floor(new Date(quote.regularMarketTime).getTime() / 1000),
                    volume: quote.regularMarketVolume || 0,
                    change: quote.regularMarketChange || 0,
                    changePercent: quote.regularMarketChangePercent || 0
                };
            }
        } catch (error) {
            console.error('Error fetching live quote:', error);
            return null;
        }
    }
}

module.exports = new MarketService();
