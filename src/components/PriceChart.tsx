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
  Bar
} from "recharts";

// Static data for candlestick chart
const staticCandlestickData = [
  { date: new Date("2025-01-01T00:00:00.000Z"), open: 150, high: 155, low: 148, close: 152, volume: 5000000, prediction: null },
  { date: new Date("2025-01-02T00:00:00.000Z"), open: 152, high: 158, low: 150, close: 157, volume: 6200000, prediction: null },
  { date: new Date("2025-01-03T00:00:00.000Z"), open: 157, high: 160, low: 155, close: 156, volume: 4800000, prediction: null },
  { date: new Date("2025-01-04T00:00:00.000Z"), open: 156, high: 162, low: 154, close: 161, volume: 7100000, prediction: 163 },
  { date: new Date("2025-01-05T00:00:00.000Z"), open: 161, high: 165, low: 159, close: 160, volume: 5500000, prediction: 162 },
  { date: new Date("2025-01-06T00:00:00.000Z"), open: 160, high: 163, low: 157, close: 158, volume: 6000000, prediction: 159 },
  { date: new Date("2025-01-07T00:00:00.000Z"), open: 158, high: 160, low: 155, close: 159, volume: 4500000, prediction: 160 },
  { date: new Date("2025-01-08T00:00:00.000Z"), open: 159, high: 166, low: 158, close: 165, volume: 7500000, prediction: 167 },
  { date: new Date("2025-01-09T00:00:00.000Z"), open: 165, high: 170, low: 164, close: 168, volume: 6800000, prediction: 170 },
  { date: new Date("2025-01-10T00:00:00.000Z"), open: 168, high: 172, low: 167, close: 170, volume: 7200000, prediction: 171 },
];

interface PriceChartProps {
  symbol: string;
  interval: string; // Interval is kept for potential future use or other chart elements
  chartType: "candlestick" | "line";
}

const PriceChart = ({ symbol, interval, chartType }: PriceChartProps) => {
  // Use static data
  const [data, setData] = useState(staticCandlestickData);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  useEffect(() => {
    // Set static data. Interval changes won't fetch new data for now.
    setData(staticCandlestickData); 
    
    if (staticCandlestickData.length > 0) {
      setCurrentPrice(staticCandlestickData[staticCandlestickData.length - 1].close);
    }
    // Symbol is kept as a dependency as it might be used in titles or other non-data parts.
    // Interval is kept as it's part of the props and might be used elsewhere.
  }, [symbol, interval]);

  // Custom tooltip component for the Recharts (Line/Area chart)
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const dateLabel = entry.date instanceof Date 
        ? entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : entry.date; // Fallback if date is already stringified

      return (
        <div className="bg-secondary p-2 md:p-3 border border-border rounded shadow-lg text-xs md:text-sm">
          <p className="font-mono">{dateLabel}</p>
          <p>
            <span className="font-semibold">Open:</span>{" "}
            <span className="font-mono">{entry.open.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">High:</span>{" "}
            <span className="font-mono">{entry.high.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Low:</span>{" "}
            <span className="font-mono">{entry.low.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Close:</span>{" "}
            <span className="font-mono">{entry.close.toFixed(2)}</span>
          </p>
          <p>
            <span className="font-semibold">Volume:</span>{" "}
            <span className="font-mono">{entry.volume.toLocaleString()}</span>
          </p>
          {entry.prediction && (
            <p className="text-chart-prediction">
              <span className="font-semibold">Prediction:</span>{" "}
              <span className="font-mono">{entry.prediction.toFixed(2)}</span>
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return String(date); // Fallback
  };

  // ApexCharts options and series for candlestick
  const apexCandlestickSeries = useMemo(() => [{
    name: 'Candlestick',
    data: data.map(item => ({
      x: item.date.getTime(),
      y: [item.open, item.high, item.low, item.close]
    }))
  }], [data]); // Data is the primary dependency here

  const apexCandlestickOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'candlestick',
      height: '100%', 
      toolbar: {
        show: false, 
      },
      background: 'transparent',
    },
    theme: {
      mode: 'dark' 
    },
    title: {
      text: `${symbol} Candlestick Chart`,
      align: 'left',
      style: {
        color: '#e0e0e0', 
        fontSize: '12px',
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#94a3b8', 
          fontSize: '8px',
        },
        datetimeUTC: false, 
      },
      axisBorder: {
        show: true,
        color: '#1e293b',
      },
      axisTicks: {
        show: true,
        color: '#1e293b',
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '8px',
        },
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
      axisBorder: {
        show: true,
        color: '#1e293b',
      },
    },
    grid: {
      borderColor: '#1e293b', 
      row: {
        colors: undefined, 
        opacity: 0.5
      },   
      column: {
        colors: undefined,
        opacity: 0.5
      },  
      padding: {
        left: 5,
        right: 5
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22c55e', 
          downward: '#ef4444' 
        },
        wick: {
          useFillColor: true,
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd MMM yyyy HH:mm' 
      }
    },
  }), [symbol]); // Dependency array updated, yMin/yMax removed

  return (
    <div className="w-full h-full chart-container flex flex-col">
      <div className="absolute top-1 left-1 md:top-2 md:left-2 z-10">
        <h3 className="text-sm md:text-lg font-bold">{symbol}</h3>
        {currentPrice && (
          <p className="text-lg md:text-2xl font-mono font-semibold">
            ${currentPrice.toFixed(2)}
          </p>
        )}
        <p className="text-[0.6rem] md:text-xs text-muted-foreground">
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

      <div className="flex-grow h-[70%] pt-12 md:pt-16">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
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
                tickFormatter={formatDateTick}
                tick={{ fill: '#94a3b8', fontSize: 8 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                interval="preserveStartEnd"
                minTickGap={5}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 8 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={{ stroke: '#1e293b' }}
                width={30}
              />
              <Tooltip content={<CustomRechartsTooltip />} />
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
                strokeDasharray="3 3"
                fillOpacity={1} 
                fill="url(#colorPrediction)" 
                strokeWidth={1.5}
              />
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
            </AreaChart>
          ) : ( // Candlestick chart using ApexCharts
            <ReactApexChart 
              options={apexCandlestickOptions} 
              series={apexCandlestickSeries} 
              type="candlestick" 
              height="100%" 
              width="100%"
            />
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex-shrink-0 h-[30%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatDateTick}
              tick={{ fill: '#94a3b8', fontSize: 8 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
              interval="preserveStartEnd"
              minTickGap={5}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 8 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={{ stroke: '#1e293b' }}
              width={30}
            />
            <Tooltip content={<CustomRechartsTooltip />} />
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
