import { useState } from "react";
import PriceChart from "./PriceChart";
import TimeSelector from "./TimeSelector";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { 
  ChartCandlestick, 
  ChartLine, 
  // ZoomIn, ZoomOut, Move, Home are removed as they are no longer used here
} from "lucide-react";
import { CandlestickInterval } from "@/types"; // Assuming CandlestickInterval type is defined in types.ts

interface ChartContainerProps {
  symbol: string;
}

// Define candlestickIntervals here or import if they are shared
const candlestickIntervals: CandlestickInterval[] = [
  { label: "15m", value: "15m" },
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1d", value: "1d" },
];

const ChartContainer = ({ symbol }: ChartContainerProps) => {
  const [interval, setInterval] = useState("1m"); // Overall time interval (1D, 1W etc)
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  const [candlestickChartInterval, setCandlestickChartInterval] = useState<string>("1h"); // Candlestick interval (15m, 1h etc)

  // Placeholder functions for zoom/pan are removed.
  // const handleZoomIn = () => console.log("Zoom In");
  // const handleZoomOut = () => console.log("Zoom Out");
  // const handlePan = () => console.log("Pan Mode");
  // const handleResetView = () => console.log("Reset View");

  return (
    <div className="bg-background rounded-lg p-1 md:p-4 h-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 md:mb-4">
        {/* Chart Type Toggles */}
        <div className="flex items-center gap-1">
          <Toggle
            pressed={chartType === "candlestick"}
            onPressedChange={() => setChartType("candlestick")}
            aria-label="Toggle candlestick chart"
            size="sm"
            className="p-1.5 sm:p-2"
          >
            <ChartCandlestick className="h-4 w-4 sm:h-5 sm:w-5" />
          </Toggle>
          <Toggle
            pressed={chartType === "line"}
            onPressedChange={() => setChartType("line")}
            aria-label="Toggle line chart"
            size="sm"
            className="p-1.5 sm:p-2"
          >
            <ChartLine className="h-4 w-4 sm:h-5 sm:w-5" />
          </Toggle>
        </div>

        {/* Time Selector for overall interval */}
        <div className="flex-shrink-0">
          <TimeSelector
            selectedInterval={interval}
            onIntervalSelect={setInterval}
          />
        </div>
        
        {/* Separator (optional) */}
        <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>

        {/* Zoom and Pan Controls */}
        {/* <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-8 w-8 sm:h-9 sm:w-9 p-1.5">
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-8 w-8 sm:h-9 sm:w-9 p-1.5">
            <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePan} className="h-8 w-8 sm:h-9 sm:w-9 p-1.5">
            <Move className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResetView} className="h-8 w-8 sm:h-9 sm:w-9 p-1.5">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div> */}
      </div>

      {/* Price Chart */}
      <div className="flex-1 min-h-0 max-h-screen">
        <PriceChart 
          symbol={symbol} 
          interval={interval} 
          chartType={chartType} 
          candlestickInterval={candlestickChartInterval} // Pass the new prop
        />
      </div>
    </div>
  );
};

export default ChartContainer;
