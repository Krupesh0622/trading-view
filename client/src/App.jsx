import React, { useState } from "react";
import Header from "./components/Header";
import TradingChart from "./components/TradingChart";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

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
        <Sidebar/>

        {/* Chart Area */}
        <div className="w-[calc(100%-50px)] h-[calc(100% - 65px - 40px)] flex-1">
          <TradingChart onPriceUpdate={handlePriceUpdate} />
        </div>

        {/* Right Price Scale / Watchlist Panel (could be added here) */}
      </div>

      {/* Bottom Time Controls (Mock) */}
      <Footer/>
    </div>
  );
}

export default App;
