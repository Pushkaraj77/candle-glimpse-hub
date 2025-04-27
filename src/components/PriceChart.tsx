
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

// Custom candlestick shape for recharts
const CandlestickShape = (props: any) => {
  const { x, y, width, height, open, close, low, high } = props;
  
  const isRising = close > open;
  const color = isRising ? "#22c55e" : "#ef4444";
  const bodyHeight = Math.abs(open - close);
  const bodyY = isRising ? close : open;

  // Draw a thin line from low to high
  return (
    <g>
      {/* Wick line from low to high */}
      <line
        x1={x + width / 2}
        y1={low}
        x2={x + width / 2}
        y2={high}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle from open to close */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={bodyHeight}
        fill={color}
        stroke={color}
      />
    </g>
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
        <div className="bg-secondary p-3 border border-border rounded shadow-lg">
          <p className="font-mono text-sm">{payload[0].payload.date}</p>
          <p className="text-sm">
            <span className="font-semibold">Open:</span>{" "}
            <span className="font-mono">{payload[0].payload.open.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">High:</span>{" "}
            <span className="font-mono">{payload[0].payload.high.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Low:</span>{" "}
            <span className="font-mono">{payload[0].payload.low.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Close:</span>{" "}
            <span className="font-mono">{payload[0].payload.close.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold">Volume:</span>{" "}
            <span className="font-mono">{payload[0].payload.volume.toLocaleString()}</span>
          </p>
          {payload[0].payload.prediction && (
            <p className="text-sm text-chart-prediction">
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
    <div className="w-full h-[500px] chart-container">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-lg font-bold">{symbol}</h3>
        {currentPrice && (
          <p className="text-2xl font-mono font-semibold">
            ${currentPrice.toFixed(2)}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
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

      <div className="h-[70%]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <AreaChart
              data={data}
              margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
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
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorClose)" 
              />
              <Area 
                type="monotone" 
                dataKey="prediction" 
                stroke="#6366f1"
                strokeDasharray="5 5" 
                fillOpacity={1} 
                fill="url(#colorPrediction)" 
              />
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#94a3b8" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `$${currentPrice.toFixed(2)}`,
                    position: 'right',
                    fill: '#94a3b8',
                    fontSize: 10,
                  }} 
                />
              )}
            </AreaChart>
          ) : (
            <ComposedChart
              data={data}
              margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              <Tooltip content={<CustomTooltip />} />
              {data.map((entry, index) => (
                <Rectangle
                  key={`candle-${index}`}
                  x={index * 40 + 20}
                  y={0}
                  width={20}
                  height={0}
                  dataKey="none"
                  shape={<CandlestickShape 
                    open={entry.open} 
                    close={entry.close} 
                    high={entry.high} 
                    low={entry.low} 
                  />}
                />
              ))}
              {currentPrice && (
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#94a3b8" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `$${currentPrice.toFixed(2)}`,
                    position: 'right',
                    fill: '#94a3b8',
                    fontSize: 10,
                  }} 
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="h-[30%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="date"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
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
