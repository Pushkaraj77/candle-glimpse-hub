import { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { CandlestickInterval, ChartType, QuoteType } from "@/types";

const CHART_ID = "candlestick-chart"; // Define chart ID for ApexCharts API

const getCandleStepMs = (interval: string): number => {
  const value = parseInt(interval.slice(0, -1), 10);
  if (interval.endsWith("m")) return value * 60 * 1000;
  if (interval.endsWith("h")) return value * 60 * 60 * 1000;
  if (interval.endsWith("d")) return value * 24 * 60 * 60 * 1000;
  return 60 * 60 * 1000; // Default to 1 hour if format is unknown
};

// Updated to take numCandles and use candlestickInterval for date stepping
const generateMockCandlestickData = (
  numCandles: number,
  symbol: string,
  candlestickIntervalStr: string,
  chartData: ChartType[] = [],
  predictedData: number[] = []
) => {
  const data: Array<{
    date: Date;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    prediction: number | null;
  }> = [];

  if (!chartData) return data;
  const predictionCount = 5;
  const chartLength = chartData.length;

  // Add all original candles with prediction: null
  chartData.forEach((item) => {
    data.push({
      date: new Date(item.time),
      open: parseFloat(item.open?.toFixed(2)),
      close: parseFloat(item.close?.toFixed(2)),
      high: parseFloat(item.high?.toFixed(2)),
      low: parseFloat(item.low?.toFixed(2)),
      volume: item.volume,
      prediction: null,
    });
  });

  // Add 5 prediction points (not candles) after the last candle
  if (predictedData && predictedData.length >= predictionCount && chartData.length > 0) {
    const lastCandle = chartData[chartLength - 1];
    const lastDate = new Date(lastCandle.time);
    const candleStepMs = getCandleStepMs(candlestickIntervalStr);
    let lastClose = lastCandle.close;

    for (let i = 0; i < predictionCount; i++) {
      const predValue = predictedData[i];
      const predDate = new Date(lastDate.getTime() + candleStepMs * (i + 1));
      // For line chart, keep open/high/low/close as last known close to avoid scale issues
      data.push({
        date: predDate,
        open: lastClose,
        close: lastClose,
        high: lastClose,
        low: lastClose,
        volume: 0,
        prediction: parseFloat(predValue?.toFixed(2)),
      });
      lastClose = parseFloat(predValue?.toFixed(2)) || lastClose;
    }
  }
  return data;
};

interface PriceChartProps {
  symbol: string;
  interval: string; 
  chartType: "candlestick" | "line";
  candlestickInterval: string; // Added prop
  chartData?: Array<ChartType>;
  quoteData?: QuoteType;
  predictedData?: Array<number>;
}

const PriceChart = ({ symbol, interval, chartType, chartData, quoteData, predictedData }: PriceChartProps) => {
  const [candlestickInterval, setCandlestickInterval] = useState<string>("5m"); // Default candlestick duration
  const [data, setData] = useState(() =>
    generateMockCandlestickData(100, symbol, candlestickInterval, chartData, predictedData)
  );
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {

    if ( chartData && chartData.length > 0) {
      const candlestickIntervalMinutes =
        {
  
          "5m": 5,
          "10m": 10,
          "15m": 15,
          "30m": 30,
          "1h": 60,
        }[candlestickInterval] || 60;
  
      const overallIntervalDays =
        {
          "1d": 1,
          "1w": 7,
          "1m": 30,
          //  "3m": 90, "6m": 180, "1y": 365, "5y": 365 * 5,
        }[interval] || 30;
  
      const totalDurationMinutes = overallIntervalDays * 24 * 60;
      let numberOfCandles = Math.floor(
        totalDurationMinutes / candlestickIntervalMinutes
      );
      const newMockData = generateMockCandlestickData(
        numberOfCandles,
        symbol,
        candlestickInterval,
        chartData,
        predictedData // Pass predictedData here
      );
  
      console.log("newMockData", newMockData);
      setData(newMockData);
  
    }
  }, [symbol, interval, candlestickInterval, chartData]); // candlestickInterval is now a prop

  // Custom tooltip component for the Recharts (Line/Area chart)
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const dateLabel =
        entry.date instanceof Date
          ? entry.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : entry.date;

      return (
        <div className="bg-secondary p-2 md:p-3 border border-border rounded shadow-lg text-xs md:text-sm">
          <p className="font-mono">{dateLabel}</p>
          <p>
            <span className="font-semibold">Open:</span>{" "}
            <span className="font-mono">{entry.open?.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">High:</span>{" "}
            <span className="font-mono">{entry.high?.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Low:</span>{" "}
            <span className="font-mono">{entry.low?.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Close:</span>{" "}
            <span className="font-mono">{entry.close?.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Volume:</span>{" "}
            <span className="font-mono">{entry.volume?.toLocaleString()}</span>
          </p>
          {entry.prediction && (
            <p className="text-chart-prediction">
              <span className="font-semibold">Prediction:</span>{" "}
              <span className="font-mono">{entry.prediction?.toFixed(2)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format date for Recharts XAxis
  const formatDateTick = (date: Date | string) => {
    if (date instanceof Date) {
      // Determine formatting based on candlestickInterval for clarity
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };
      if (
        candlestickInterval.endsWith("m") ||
        candlestickInterval.endsWith("h")
      ) {
        options.hour = "2-digit";
        options.minute = "2-digit";
      }
      return date.toLocaleDateString("en-US", options);
    }
    return String(date); // Fallback
  };

  const { yMin, yMax } = useMemo(() => {
    if (!data || data.length === 0) {
      return { yMin: undefined, yMax: undefined }; // Default if no data
    }
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    data.forEach((item) => {
      const lowValue =
        item.prediction !== null && item.prediction < item.low
          ? item.prediction
          : item.low;
      const highValue =
        item.prediction !== null && item.prediction > item.high
          ? item.prediction
          : item.high;
      if (lowValue < minPrice) minPrice = lowValue;
      if (highValue > maxPrice) maxPrice = highValue;
    });

    const paddingPercentage = 0.1; // 10% total padding (5% top, 5% bottom)
    const range = maxPrice - minPrice;
    // Add a small fixed padding if all data points are the same, otherwise use percentage
    const paddingValue = range === 0 ? 10 : range * paddingPercentage;

    const finalMin = Math.floor(minPrice - paddingValue / 2);
    const finalMax = Math.ceil(maxPrice + paddingValue / 2);

    // Ensure min and max are not the same if all data points were identical after padding calc
    if (finalMin === finalMax) {
      return { yMin: finalMin - 5, yMax: finalMax + 5 }; // Add a bit more fixed padding
    }

    return { yMin: finalMin, yMax: finalMax };
  }, [data]);

  // ApexCharts options and series for candlestick
  const apexCandlestickSeries = useMemo(
    () => [
      {
        name: "Candlestick",
        data: data.map((item) => ({
          x: item.date.getTime(), // ApexCharts expects timestamp for datetime x-axis
          y: [item.open, item.high, item.low, item.close],
          isPrediction: item.prediction !== null, // Flag for prediction candles
          predictionValue: item.prediction, // Add prediction data to be used for styling
        })),
      },
    ],
    [data]
  );

  const handleZoomIn = () => {
    if ((window as any).ApexCharts) {
      (window as any).ApexCharts.exec(CHART_ID, "zoomIn");
    }
  };

  const handleZoomOut = () => {
    if ((window as any).ApexCharts) {
      (window as any).ApexCharts.exec(CHART_ID, "zoomOut");
    }
  };

  const candlestickIntervals: CandlestickInterval[] = [
    { label: "5m", value: "5m" },
  // { label: "10m", value: "10m" },
  // { label: "15m", value: "15m" },
  // { label: "30m", value: "30m" },
  // { label: "1h", value: "1h" },
  ];

  const apexCandlestickOptions: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        id: CHART_ID, // Crucial for API calls
        type: "candlestick",
        height: "100%",
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true, // Box selection zoom
            zoomin: true, // Toolbar zoom in button
            zoomout: true, // Toolbar zoom out button
            // pan: true,
            // reset: true,
          },
        },
        background: "transparent",
        zoom: {
          enabled: true, // Enables scroll and selection zoom
          type: "x",
          autoScaleYaxis: true,
        },
        selection: {
          enabled: false,
        },
        animations: {
          enabled: true, // Re-enable for smoother zoom, can be set to false if performance issues
          easing: "easeinout",
          speed: 300,
          animateGradually: {
            enabled: true,
            delay: 50,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 200,
          },
        },
      },
      theme: {
        mode: "dark",
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "8px",
          },
          datetimeUTC: false,
          formatter: function (value, timestamp) {
            const date = new Date(timestamp || value);
            // Adjust formatting based on candlestickInterval for clarity on x-axis
            const options: Intl.DateTimeFormatOptions = {
              month: "short",
              day: "numeric",
            };
            if (
              candlestickInterval.includes("m") ||
              candlestickInterval.includes("h")
            ) {
              options.hour = "numeric";
              options.minute = "numeric";
            }
            return date.toLocaleDateString("en-US", options);
          },
        },
        axisBorder: {
          show: true,
          color: "#1e293b",
        },
        axisTicks: {
          show: true,
          color: "#1e293b",
        },
      },
      yaxis: {
        tickAmount: 5,
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "8px",
          },
          formatter: (value: number) => `INR ${value.toFixed(2)}`,
        },
        axisBorder: {
          show: true,
          color: "#1e293b",
        },
      },
      grid: {
        borderColor: "#1e293b",
        row: { colors: undefined, opacity: 0.5 },
        column: { colors: undefined, opacity: 0.5 },
        padding: { left: 5, right: 5 },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#22c55e",
            downward: "#ef4444",
          },
          wick: {
            useFillColor: true,
          },
        },
      },
      tooltip: {
        theme: "dark",
        x: {
          formatter: function (val) {
            const date = new Date(val);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          },
        },
        custom: ({ seriesIndex, dataPointIndex, w }) => {
          const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
          if (!dataPoint) return "";

          const { x, y, isPrediction, predictionValue } = dataPoint;

          const date = new Date(x);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const [open, high, low, close] = y;

          let tooltipContent = `
          <div class="bg-secondary p-2 border border-border rounded shadow-lg text-xs">
            <div class="font-mono">${formattedDate}</div>
            <div><span class="font-semibold">Open:</span> <span class="font-mono">${open?.toFixed(
              2
            )}</span></div>
            <div><span class="font-semibold">High:</span> <span class="font-mono">${high?.toFixed(
              2
            )}</span></div>
            <div><span class="font-semibold">Low:</span> <span class="font-mono">${low?.toFixed(
              2
            )}</span></div>
            <div><span class="font-semibold">Close:</span> <span class="font-mono">${close?.toFixed(
              2
            )}</span></div>
        `;

          if (
            isPrediction &&
            predictionValue !== null &&
            predictionValue !== undefined
          ) {
            tooltipContent += `
            <div class="text-purple-400">
              <span class="font-semibold">Prediction:</span>
              <span class="font-mono">${predictionValue?.toFixed(2)}</span>
            </div>
          `;
          }
          tooltipContent += `</div>`;
          return tooltipContent;
        },
      },
      states: {
        // ... keep existing code (states)
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },
      markers: {
        // For predicted points if needed as distinct markers
        size: 0, // Default no markers
        colors: ["#9b87f5"], // Prediction marker color
        strokeColors: "#fff",
        strokeWidth: 1,
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
      },
      // Styling predicted candlesticks. We mark them in the series data.
      // ApexCharts doesn't have a direct "predicted candlestick style"
      // but we can use annotations or try to conditionally color in a custom tooltip / data label.
      // The `forecastDataPoints` option is more for line/area charts trend lines.
      // For candlesticks, custom coloring would typically involve manipulating `fillColor` per data point,
      // which is complex or done via `dataPointColors` function if available, or annotations.
      // The current approach with 'isPrediction' flag in data can be used with `annotations.points` or `markers`.
      annotations: {
        points: data
          .filter((item) => item.prediction !== null)
          .map((item, index, arr) => {
            // Highlight the predicted portion of the candle, typically the close or predicted value
            const yValue = item.prediction!;
            return {
              x: item.date.getTime(),
              y: yValue,
              marker: {
                size:
                  item.prediction === arr[arr.length - 1].prediction ? 5 : 3, // Emphasize last prediction
                fillColor: "#a855f7", // Purple for prediction
                strokeColor: "#fff",
                strokeWidth: 1,
                shape: "circle",
                radius: 2,
              },
              label: {
                borderColor: "#a855f7",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#a855f7",
                  fontSize: "8px",
                  padding: { left: 3, right: 3, top: 1, bottom: 1 },
                },
                text: `Pred: ${yValue.toFixed(2)}`,
              },
            };
          }),
      },
    }),
    [symbol, candlestickInterval, data]
  ); // Added data to dependency array for annotations

  return (
    <div className="w-full h-full chart-container flex flex-col">
      <div className=" top-1 left-1 md:top-2 md:left-2 z-10">
        <h3 className="text-sm md:text-lg font-bold">{symbol}</h3>
        {quoteData !== null && (
          <p className="text-lg md:text-2xl font-mono font-semibold">
            INR {quoteData.price}
          </p>
        )}
        <p className="text-[0.6rem] md:text-xs text-muted-foreground">
          {new Date().toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {chartType === "candlestick" && (
        <div className="absolute top-1 right-1 md:top-2 md:right-2 z-10 flex flex-col gap-1 items-end">
          {" "}
          {/* Align items-end */}
          <div className="flex gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-md">
            {candlestickIntervals.map((item) => (
              <Button
                key={item.value}
                variant={
                  candlestickInterval === item.value ? "default" : "outline"
                }
                size="sm"
                className="h-6 px-2 py-0 text-xs"
                onClick={() => setCandlestickInterval(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {/* Custom Zoom Buttons */}
          {/* <div className="flex gap-1 bg-background/50 backdrop-blur-sm p-1 rounded-md">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleZoomIn}
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleZoomOut}
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      )}

      <div className="flex-grow h-[70%] pt-12 md:pt-16">
        {/* Removed ResponsiveContainer for candlestick, Recharts still uses it */}
        {chartType === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPrediction"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateTick}
                tick={{ fill: "#94a3b8", fontSize: 8 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={{ stroke: "#1e293b" }}
                interval="preserveStartEnd"
                minTickGap={20} // Increased minTickGap for better readability
              />
              <YAxis
                domain={yMin && yMax ? [yMin, yMax] : ["auto", "auto"]}
                tick={{ fill: "#94a3b8", fontSize: 8 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={{ stroke: "#1e293b" }}
                width={35} // Slightly increased width for Y-axis labels
              />
              <Tooltip content={<CustomRechartsTooltip />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorClose)"
                strokeWidth={1.5}
                connectNulls // Connect lines even if there are nulls (e.g. for prediction gaps)
              />
              <Area
                type="monotone"
                dataKey="prediction"
                stroke="#a855f7" // Changed to purple to match candlestick prediction
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#colorPrediction)" // Needs a new gradient or adjust existing one
                strokeWidth={1.5}
                connectNulls
              />
              {currentPrice !== null && (
                <ReferenceLine
                  y={currentPrice}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  label={{
                    value: `INR ${currentPrice.toFixed(2)}`,
                    position: "right",
                    fill: "#94a3b8",
                    fontSize: 8,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          // Candlestick chart using ApexCharts
          <div style={{ height: "100%", minHeight: "300px" }}>
            {" "}
            {/* Ensure wrapper has height for ApexChart */}
            <ReactApexChart
              options={apexCandlestickOptions} // Use memoized options
              series={apexCandlestickSeries} // Use memoized series
              type="candlestick"
              height="100%"
              width="100%"
            />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 h-[30%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateTick}
              tick={{ fill: "#94a3b8", fontSize: 8 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={{ stroke: "#1e293b" }}
              interval="preserveStartEnd"
              minTickGap={20} // Increased minTickGap for better readability
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 8 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={{ stroke: "#1e293b" }}
              width={35} // Slightly increased width
              domain={["auto", "auto"]} // Simpler domain for volume, let Recharts decide based on data
              // Allow Recharts to format volume ticks automatically or provide a custom formatter if needed
              // formatter={(value: number) => value > 1000000 ? `${(value/1000000).toFixed(1)}M` : `${(value/1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomRechartsTooltip />} />
            <Bar dataKey="volume" fill="#4b5563" fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
