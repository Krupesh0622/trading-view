import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Monitor,
  Settings,
  Camera,
  Maximize,
} from "lucide-react";

const Header = ({
  currentPrice,
  previousClose,
  symbol = "Nifty 50 Index",
  interval = "1m",
}) => {
  const diff = currentPrice - previousClose;
  console.log("currentPrice", currentPrice);
  console.log("previousClose", previousClose);
  const diffPercent = (diff / previousClose) * 100;
  const isUp = diff >= 0;
  const colorClass = isUp ? "text-chart-up" : "text-chart-down";

  // Mock OHLC for the header (simulation logic or props)
  // In a real app, these would come from the current active candle
  const [headerOHLC, setHeaderOHLC] = useState({ o: 0, h: 0, l: 0, c: 0 });

  // Just syncing "c" with price for demo
  useEffect(() => {
    setHeaderOHLC((prev) => ({ ...prev, c: currentPrice }));
  }, [currentPrice]);

  return (
    <div className="flex flex-col h-[65px] border-b border-gray-200 bg-white relative">
      {/* Top Row: Symbol Info */}
      <div className="flex items-center justify-between px-3 py-1 h-12">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded">
            <span className="font-bold text-gray-900 text-lg uppercase tracking-tight">
              {symbol}
            </span>
            <span className="text-xs bg-gray-200 px-1 rounded text-gray-600 font-semibold">
              •
            </span>
            <span className="font-bold text-gray-900">{interval}</span>
            <span className="text-gray-500 text-sm">Interval</span>
            <span className="font-bold text-gray-900">7D</span>
            <span className="text-gray-500 text-sm">Range</span>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isUp ? "bg-chart-up" : "bg-chart-down"
                } animate-pulse`}
              ></div>
              <span className={`font-bold text-xl ${colorClass}`}>
                {currentPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className={`flex items-center font-medium ${colorClass}`}>
              {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(diff).toFixed(2)}</span>
              <span className="ml-1">
                ({Math.abs(diffPercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <button className="px-4 py-1.5 hover:bg-gray-100 rounded text-blue-600 font-medium text-sm border border-blue-600 border-box">
            Save
          </button>
          <button className="p-2 hover:bg-gray-100 rounded border border-gray-100 border-box">
            <Settings size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded border border-gray-100 border-box">
            <Maximize size={18} />
          </button>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 border border-blue-600 border-box">
            Publish
          </button>
        </div>
      </div>

      {/* Second Row: Toolbar / Legend */}
      <div className="flex items-center pl-4 text-xs text-gray-500 space-x-4 font-mono">
        <div className="flex space-x-3">
          <div className="flex space-x-1">
            <span className="text-gray-400">O</span>
            <span className={colorClass}>{headerOHLC.o.toFixed(2)}</span>
          </div>
          <div className="flex space-x-1">
            <span className="text-gray-400">H</span>
            <span className={colorClass}>{headerOHLC.h.toFixed(2)}</span>
          </div>
          <div className="flex space-x-1">
            <span className="text-gray-400">L</span>
            <span className={colorClass}>{headerOHLC.l.toFixed(2)}</span>
          </div>
          <div className="flex space-x-1">
            <span className="text-gray-400">C</span>
            <span className={colorClass}>{currentPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Buy/Sell Buttons Overlay (Static Mock as per image) */}
      <div className="absolute top-[64px] left-[49px] z-10 flex space-x-0 bg-white rounded shadow-md border hover:shadow-lg transition-shadow">
        <button className="flex flex-col items-start px-3 py-1 border-r hover:bg-red-50">
          <span className="text-red-500 font-bold text-xs">
            {currentPrice.toFixed(2)}
          </span>
          <span className="text-xs text-red-400 font-semibold">SELL</span>
        </button>
        <div className="flex items-center px-2 text-xs text-gray-400">0.00</div>
        <button className="flex flex-col items-end px-3 py-1 border-l hover:bg-blue-50">
          <span className="text-blue-500 font-bold text-xs">
            {currentPrice.toFixed(2)}
          </span>
          <span className="text-xs text-blue-400 font-semibold">BUY</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
