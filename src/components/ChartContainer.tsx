
import { useState } from "react";
import PriceChart from "./PriceChart";
import TimeSelector from "./TimeSelector";

interface ChartContainerProps {
  symbol: string;
}

const ChartContainer = ({ symbol }: ChartContainerProps) => {
  const [interval, setInterval] = useState("1m");

  return (
    <div className="bg-chart-bg rounded-lg p-4 h-full">
      <div className="flex justify-end mb-4">
        <TimeSelector
          selectedInterval={interval}
          onIntervalSelect={setInterval}
        />
      </div>
      <PriceChart symbol={symbol} interval={interval} />
    </div>
  );
};

export default ChartContainer;
