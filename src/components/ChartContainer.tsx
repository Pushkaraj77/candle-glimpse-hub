
import { useState } from "react";
import PriceChart from "./PriceChart";
import TimeSelector from "./TimeSelector";
import { Toggle } from "@/components/ui/toggle";
import { ChartCandlestick, ChartLine } from "lucide-react";

interface ChartContainerProps {
  symbol: string;
}

const ChartContainer = ({ symbol }: ChartContainerProps) => {
  const [interval, setInterval] = useState("1m");
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");

  return (
    <div className="bg-background rounded-lg p-1 md:p-4 h-full flex flex-col"> {/* Reduced padding on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 md:mb-4 gap-2"> {/* Stack on xs, row on sm+ */}
        <div className="flex items-center gap-1 sm:gap-2 self-start sm:self-center"> {/* Align to start on mobile */}
          <Toggle
            pressed={chartType === "candlestick"}
            onPressedChange={() => setChartType("candlestick")}
            aria-label="Toggle candlestick chart"
            size="sm"
          >
            <ChartCandlestick className="h-3 w-3 sm:h-4 sm:w-4" />
          </Toggle>
          <Toggle
            pressed={chartType === "line"}
            onPressedChange={() => setChartType("line")}
            aria-label="Toggle line chart"
            size="sm"
          >
            <ChartLine className="h-3 w-3 sm:h-4 sm:w-4" />
          </Toggle>
        </div>
        <div className="w-full sm:w-auto"> {/* Full width on xs for TimeSelector container */}
          <TimeSelector
            selectedInterval={interval}
            onIntervalSelect={setInterval}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0"> {/* Critical for PriceChart to get proper height */}
        <PriceChart symbol={symbol} interval={interval} chartType={chartType} />
      </div>
    </div>
  );
};

export default ChartContainer;
