import { useEffect, useRef, useState } from "react";
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
  ComposedChart,
  Line,
  Scatter,
  Rectangle
} from "recharts";

// Mock data for candlestick chart
const generateMockCandlestickData = (days: number = 30) => {
  const data = [];
  let basePrice = 150; // Starting price
  
  for (let i = 0; i < days; i++) {
    const volatility = Math.random() * 5; // Random volatility for the day
    const open = basePrice;
    const close = basePrice + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    const volume = Math.floor(Math.random() * 10000000) + 1000000; // Random volume
    
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open,
      close,
      high,
      low,
      volume,
      prediction: i > days - 5 ? close + (Math.random() - 0.3) * volatility : null // Only add predictions for the last 5 days
    });
    
    basePrice = close; // Set next day's base price to today's close
  }
  
  return data;
};

interface PriceChartProps {
  symbol: string;
  interval: string;
  chartType: "candlestick" | "line";
}

// Custom candlestick shape for recharts - FIXED
const CandlestickShape = (props: any) => {
  const { x, y, width, height, open, close, low, high } = props;
  
  // Determine if the stock is rising or falling
  const isRising = close > open;
  const color = isRising ? "#22c55e" : "#ef4444";
  
  // Calculate the y-coordinates based on the actual data values
  const yOpen = props.yAxis.scale(open);
  const yClose = props.yAxis.scale(close);
  const yHigh = props.yAxis.scale(high);
  const yLow = props.yAxis.scale(low);
  
  // Calculate body height based on scaled values
  const bodyHeight = Math.abs(yOpen - yClose);
  // The body should start at the higher of the open/close values (lower y-coordinate in SVG)
  const bodyY = Math.min(yOpen, yClose);

  return (
    <g>
      {/* Wick line from low to high using scaled coordinates */}
      <line
        x1={x + width / 2}
        y1={yLow}
        x2={x + width / 2}
        y2={yHigh}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle from open to close */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight > 1 ? bodyHeight : 1} // Ensure minimum height for visibility
        fill={color}
        stroke={color}
      />
    </g>
  );
};

// Custom component to render candlesticks
const CustomCandlestickItem = (props: any) => {
  if (!props.payload) return null;
  
  const { x, index, payload, width, yAxis } = props;
  
  // Spacing between candlesticks
  const candleWidth = Math.min(20, Math.max(width * 0.8, 10)); // Responsive width
  const xPos = x - (candleWidth / 2); // Center the candle
  
  return (
    <CandlestickShape
      key={`candle-${index}`}
      x={xPos}
      width={candleWidth}
      open={payload.open}
      close={payload.close}
      high={payload.high}
      low={payload.low}
      yAxis={yAxis} // Pass yAxis for proper scaling
    />
  );
};

const PriceChart = ({ symbol, interval, chartType }: PriceChartProps) => {
  const [data, setData] = useState(generateMockCandlestickData());
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // Update data when symbol or interval changes
  useEffect(() => {
    // In a real app, we would fetch real data here based on symbol and interval
    setData(generateMockCandlestickData(interval === '1d' ? 30 : 
                                       interval === '1w' ? 60 : 
                                       interval === '1m' ? 90 : 
                                       interval === '3m' ? 120 : 
                                       interval === '6m' ? 180 : 
                                       interval === '1y' ? 250 : 365));
    
    if (data.length > 0) {
      setCurrentPrice(data[data.length - 1].close);
    }
  }, [symbol, interval]);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary p-2 md:p-3 border border-border rounded shadow-lg text-xs md:text-sm"> {/* Responsive padding and text */}
          <p className="font-mono">{payload[0].payload.date}</p>
          <p>
            <span className="font-semibold">Open:</span>{" "}
            <span className="font-mono">{payload[0].payload.open.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">High:</span>{" "}
            <span className="font-mono">{payload[0].payload.high.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Low:</span>{" "}
            <span className="font-mono">{payload[0].payload.low.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Close:</span>{" "}
            <span className="font-mono">{payload[0].payload.close.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Volume:</span>{" "}
            <span className="font-mono">{payload[0].payload.volume.toLocaleString()}</span>
          </p>
          {payload[0].payload.prediction && (
            <p className="text-chart-prediction">
              <span className="font-semibold">Prediction:</span>{" "}
              <span className="font-mono">{payload[0].payload.prediction.toFixed(2)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full chart-container flex flex-col"> {/* Ensure h-full and flex-col */}
      <div className="absolute top-1 left-1 md:top-2 md:left-2 z-10"> {/* Smaller spacing on mobile */}
        <h3 className="text-sm md:text-lg font-bold">{symbol}</h3>
        {currentPrice && (
          <p className="text-lg md:text-2xl font-mono font-semibold">
            ${currentPrice.toFixed(2)}
          </p>
        )}
        <p className="text-[0.6rem] md:text-xs text-muted-foreground"> {/* Smaller date text on mobile */}
          {new Date().toLocaleString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Top padding to avoid overlap with the title/price info */}
      <div className="flex-grow h-[70%] pt-12 md:pt-16"> {/* pt instead of mt for better layout control with absolute */}
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }} // Reduced margins for mobile
            >
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                interval="preserveStartEnd" // Show more ticks on mobile if possible
                minTickGap={5} // Adjust gap for mobile
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                width={30} // Reduced width for YAxis on mobile
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorClose)" 
                strokeWidth={1.5}
              />
              <Area 
                type="monotone" 
                dataKey="prediction" 
                stroke="#6366f1"
                strokeDasharray="3 3" // Simplified dash for mobile
                fillOpacity={1} 
                fill="url(#colorPrediction)" 
                strokeWidth={1.5}
              />
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#94a3b8" 
                  strokeDasharray="2 2" // Simplified dash
                  label={{ 
                    value: `$${currentPrice.toFixed(2)}`,
                    position: 'right',
                    fill: '#94a3b8',
                    fontSize: 8, // Smaller label
                  }} 
                />
              )}
            </AreaChart>
          ) : (
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }} // Reduced margins for mobile
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                interval="preserveStartEnd"
                minTickGap={5}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                width={30} // Reduced width for YAxis on mobile
              />
              <Tooltip content={<CustomTooltip />} />
              {data.map((entry, index) => (
                <Scatter
                  key={`candle-${index}`}
                  data={[entry]} // Scatter expects an array of data points for its `data` prop
                  shape={ // Pass the necessary props to CustomCandlestickItem
                    <CustomCandlestickItem 
                      payload={entry} // The actual data for the candle
                      // x, y, width, height are provided by Scatter internally based on layout
                    />
                  }
                  // Removed fill="none" as shape handles rendering
                />
              ))}
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#94a3b8" 
                  strokeDasharray="2 2" 
                  label={{ 
                    value: `$${currentPrice.toFixed(2)}`,
                    position: 'right',
                    fill: '#94a3b8',
                    fontSize: 8,
                  }} 
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex-shrink-0 h-[30%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}> {/* Adjusted top margin */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
              interval="preserveStartEnd"
              minTickGap={5}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 8 }} // Smaller ticks for mobile
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
              width={30} // Reduced width for YAxis on mobile
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="volume" 
              fill="#4b5563" 
              fillOpacity={0.8} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
