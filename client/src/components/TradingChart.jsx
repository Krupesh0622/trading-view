import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, TickMarkType } from "lightweight-charts";
import socket from "../services/socket";

const TradingChart = ({ onPriceUpdate }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const volumeSeriesRef = useRef();

  const tickMarkFormatter = (time, tickMarkType, locale) => {
    const date = new Date(time * 1000); // Convert timestamp to Date object

    // Use the built-in adaptive behavior for most cases
    if (
      tickMarkType === TickMarkType.Month ||
      tickMarkType === TickMarkType.Year
    ) {
      // Return null to use the default formatting for months and years
      return null;
    }

    // Custom format for days (e.g., just the day number)
    if (tickMarkType === TickMarkType.DayOfMonth) {
      return date.getDate().toString();
    }

    // Custom format for time (e.g., HH:mm)
    if (
      tickMarkType === TickMarkType.Time ||
      tickMarkType === TickMarkType.TimeWithSeconds
    ) {
      return date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Fallback to default for any other unexpected types
    return null;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      grid: {
        vertLines: { color: "#d4dff9ff" },
        horzLines: { color: "#f0f3fa" },
      },
      rightPriceScale: {
        borderColor: "#d1d5db",
      },
      timeScale: {
        borderColor: "#d1d5db",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter,
      },
    });

    // Candlestick Series
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#089981",
      downColor: "#F23645",
      borderDownColor: "#F23645",
      borderUpColor: "#089981",
      wickDownColor: "#F23645",
      wickUpColor: "#089981",
    });

    // Volume Series (Overlay)
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "", // Overlay on main chart
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // Place volume at bottom
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Resize Observer
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    // Fetch Historical Data
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        const candleData = data
          .filter(
            (d) =>
              d.open != null &&
              d.high != null &&
              d.low != null &&
              d.close != null
          )
          .map((d) => ({
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));

        const volumeData = data
          .filter(
            (d) =>
              d.open != null &&
              d.high != null &&
              d.low != null &&
              d.close != null &&
              d.volume != null
          )
          .map((d) => ({
            time: d.time,
            value: d.volume,
            color:
              d.close >= d.open
                ? "rgba(8, 153, 129, 0.5)"
                : "rgba(242, 54, 69, 0.5)",
          }));

        candleSeries.setData(candleData);
        volumeSeries.setData(volumeData);

        // Set initial price in parent
        if (candleData.length > 0) {
          const last = candleData[candleData.length - 1];
          onPriceUpdate(
            last.close,
            candleData[candleData.length - 2]?.close || last.open
          );
        }
      })
      .catch((err) => console.error("Failed to fetch history:", err));

    // Socket Listeners
    socket.on("priceUpdate", (tick) => {
      const data = candleSeries.data();
      if (data.length > 0) {
        const lastBar = data[data.length - 1];

        // Calculate the 5-minute interval start time for this tick
        // 1 minute = 60 seconds
        const INTERVAL = 1 * 60;
        const tickBarTime = tick.time - (tick.time % INTERVAL);

        // Check if we are updating the current bar or starting a new one
        if (tickBarTime === lastBar.time) {
          // Update existing bar
          const updatedBar = {
            ...lastBar,
            close: tick.price,
            high: Math.max(lastBar.high, tick.price),
            low: Math.min(lastBar.low, tick.price),
            // volume update? simplified for now
          };
          candleSeries.update(updatedBar);
          onPriceUpdate(
            tick.price,
            data[data.length - 2]?.close || lastBar.open
          );
        } else if (tickBarTime > lastBar.time) {
          // Create NEW bar
          // Open of new bar should ideally be previous close, but for live tick we use tick price
          // or we could assume the open is the first tick price of this interval.
          const newBar = {
            time: tickBarTime,
            open: tick.price, // Or lastBar.close
            high: tick.price,
            low: tick.price,
            close: tick.price,
          };
          candleSeries.update(newBar);
          onPriceUpdate(tick.price, lastBar.close);
        }
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      socket.off("priceUpdate");
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full relative" />;
};

export default TradingChart;
