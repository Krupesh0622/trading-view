// SERVER DESIGN


->  Rest APIs

->  WebSocket/Feed
         ↓
    [Tick Handler] → Redis ZADD ticks:{symbol} (sorted by timestamp)
                            ↓
                  [1m Candle Builder] (aligned interval)
                            ↓
                  Redis (hot cache) + DB (cold storage)