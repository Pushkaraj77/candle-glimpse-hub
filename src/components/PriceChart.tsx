import { useEffect, useState, useMemo } from "react"; // Added useMemo
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
    
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (days - i));
    
    data.push({
      date: dateObj, // Store as Date object
      open,
      close,
      high,
      low,
      volume,
      prediction: i > days - 5 ? close + (Math.random() - 0.3) * volatility : null
    });
    
    basePrice = close;
  }
  
  return data;
};

interface PriceChartProps {
  symbol: string;
  interval: string;
  chartType: "candlestick" | "line";
}

// Removed CandlestickShape and CustomCandlestickItem as they were for Recharts

const PriceChart = ({ symbol, interval, chartType }: PriceChartProps) => {
  const [data, setData] = useState(generateMockCandlestickData());
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  useEffect(() => {
    const newMockData = generateMockCandlestickData(
      interval === '1d' ? 30 : 
      interval === '1w' ? 60 : 
      interval === '1m' ? 90 : 
      interval === '3m' ? 120 : 
      interval === '6m' ? 180 : 
      interval === '1y' ? 250 : 365
    );
    setData(newMockData);
    
    if (newMockData.length > 0) {
      setCurrentPrice(newMockData[newMockData.length - 1].close);
    }
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

  const { yMin, yMax } = useMemo(() => {
    if (!data || data.length === 0) {
      return { yMin: undefined, yMax: undefined }; // Default if no data
    }
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    data.forEach(item => {
      if (item.low < minPrice) minPrice = item.low;
      if (item.high > maxPrice) maxPrice = item.high;
    });

    const paddingPercentage = 0.10; // 10% total padding (5% top, 5% bottom)
    const range = maxPrice - minPrice;
    // Add a small fixed padding if all data points are the same, otherwise use percentage
    const paddingValue = range === 0 ? 10 : range * paddingPercentage; 

    const finalMin = Math.floor(minPrice - paddingValue / 2);
    const finalMax = Math.ceil(maxPrice + paddingValue / 2);
    
    // Ensure min and max are not the same if all data points were identical after padding calc
    if (finalMin === finalMax) {
        return { yMin: finalMin - 5, yMax: finalMax + 5}; // Add a bit more fixed padding
    }

    return { yMin: finalMin, yMax: finalMax };
  }, [data]);

  // ApexCharts options and series for candlestick
  const apexCandlestickSeries = useMemo(() => [{
    name: 'Candlestick',
    data: data.map(item => ({
      x: item.date.getTime(), // ApexCharts expects timestamp for datetime x-axis
      y: [item.open, item.high, item.low, item.close]
    }))
  }], [data]);

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
      text: `${symbol} Candlestick Chart`, // Dynamic title
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
      min: yMin, // Dynamic min based on data
      max: yMax, // Dynamic max based on data
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
  }), [symbol, yMin, yMax]); // Dependencies for options

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
              options={apexCandlestickOptions} // Use memoized options
              series={apexCandlestickSeries} // Use memoized series
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
