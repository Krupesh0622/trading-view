import React, { useState } from "react";
import Header from "./components/Header";
import TradingChart from "./components/TradingChart";

function App() {
  const [currentPrice, setCurrentPrice] = useState(26145.35);
  const [prevClose, setPrevClose] = useState(26148.05);

  const handlePriceUpdate = (price, prev) => {
    console.log("price, prev", { price, prev });
    setCurrentPrice(price);
    if (prev) setPrevClose(prev);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 font-sans">
      <Header currentPrice={currentPrice} previousClose={prevClose} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar (Mock) */}
        <div className="w-[50px] border-r border-gray-200 flex flex-col items-center py-4 space-y-6 text-gray-500 bg-white z-10">
          <div className="hover:text-black cursor-pointer">✛</div>
          <div className="hover:text-black cursor-pointer">/</div>
          <div className="hover:text-black cursor-pointer">☰</div>
          <div className="hover:text-black cursor-pointer">T</div>
        </div>

        {/* Chart Area */}
        <div className="w-[calc(100%-50px)] h-[calc(100% - 65px - 40px)] flex-1">
          <TradingChart onPriceUpdate={handlePriceUpdate} />
        </div>

        {/* Right Price Scale / Watchlist Panel (could be added here) */}
      </div>

      {/* Bottom Time Controls (Mock) */}
      <div className="h-[40px] border-t border-gray-200 flex items-center px-4 space-x-2 text-sm text-gray-600 bg-white">
        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded font-bold cursor-pointer">
          1D
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          5D
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          1M
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          1Y
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          5Y
        </span>
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
          ALL
        </span>
        <div className="border-l h-4 mx-2"></div>
        <span className="cursor-pointer hover:text-black">
          15:30:45 (UTC+5:30)
        </span>
      </div>
    </div>
  );
}

export default App;
