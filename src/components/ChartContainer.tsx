
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
    <div className="bg-chart-bg rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Toggle
            pressed={chartType === "candlestick"}
            onPressedChange={() => setChartType("candlestick")}
            aria-label="Toggle candlestick chart"
          >
            <ChartCandlestick className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={chartType === "line"}
            onPressedChange={() => setChartType("line")}
            aria-label="Toggle line chart"
          >
            <ChartLine className="h-4 w-4" />
          </Toggle>
        </div>
        <TimeSelector
          selectedInterval={interval}
          onIntervalSelect={setInterval}
        />
      </div>
      <PriceChart symbol={symbol} interval={interval} chartType={chartType} />
    </div>
  );
};

export default ChartContainer;
