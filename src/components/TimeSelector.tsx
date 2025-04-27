
import { Button } from "@/components/ui/button";

interface TimeSelectorProps {
  selectedInterval: string;
  onIntervalSelect: (interval: string) => void;
}

const intervals = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
];

const TimeSelector = ({ selectedInterval, onIntervalSelect }: TimeSelectorProps) => {
  return (
    <div className="flex space-x-1">
      {intervals.map((interval) => (
        <Button
          key={interval.value}
          variant={selectedInterval === interval.value ? "default" : "outline"}
          className="px-3 py-1 h-8 text-xs"
          onClick={() => onIntervalSelect(interval.value)}
        >
          {interval.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeSelector;
