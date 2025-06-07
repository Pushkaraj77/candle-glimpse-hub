
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SymbolDetailProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high52w : number,
  low52w : number,
  marketCap : number,
  peRatio : number,
  dividendYield : number,
  volume : number,
  avgVolume : number,
  beta : number,
  additionalInfo?: {
    [key: string]: string | number;
  };
}

const SymbolDetail = ({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent,
  high52w,
  low52w,
  marketCap,
  peRatio,
  dividendYield,
  volume,
  avgVolume,
  beta,
  additionalInfo = {} 
}: SymbolDetailProps) => {
  // Add mock data for additional metrics
  const mockData = {
    "52W High": "INR " + high52w,
    "52W Low": "INR " + low52w,
    "Market Cap": "INR " + marketCap + "B",
    "P/E Ratio": peRatio,
    "Dividend Yield": dividendYield + "%",
    "Volume": volume,
    "Avg. Volume": avgVolume,
    "Beta": beta,
    ...additionalInfo
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-mono">{symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-mono font-semibold">INR {price.toFixed(2)}</div>
          <div 
            className={`flex items-center text-sm font-mono ${change >= 0 ? 'trend-up' : 'trend-down'}`}
          >
            {change >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          {Object.entries(mockData).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{key}</span>
              <span className="text-sm font-mono">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymbolDetail;
