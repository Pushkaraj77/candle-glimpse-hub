
import { useState } from "react";
import PriceChart from "./PriceChart";
import TimeSelector from "./TimeSelector";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button"; // Added Button
import { 
  ChartCandlestick, 
  ChartLine, 
  ZoomIn, 
  ZoomOut, 
  Move, // For pan
  Home // For reset view
} from "lucide-react";

interface ChartContainerProps {
  symbol: string;
}

const ChartContainer = ({ symbol }: ChartContainerProps) => {
  const [interval, setInterval] = useState("1m");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");

  // Placeholder functions for zoom/pan - these would typically interact with the chart library
  const handleZoomIn = () => console.log("Zoom In");
  const handleZoomOut = () => console.log("Zoom Out");
  const handlePan = () => console.log("Pan Mode");
  const handleResetView = () => console.log("Reset View");

  return (
    <div className="bg-background rounded-lg p-1 md:p-4 h-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 md:mb-4"> {/* Added mb-3 for space above chart */}
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

        {/* Separator (optional, for visual distinction) */}
        {/* <div className="h-6 w-px bg-border hidden sm:block mx-1"></div> */}

        {/* Time Selector */}
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
        <PriceChart symbol={symbol} interval={interval} chartType={chartType} />
      </div>
    </div>
  );
};

export default ChartContainer;

