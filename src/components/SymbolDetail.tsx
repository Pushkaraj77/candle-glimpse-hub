
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SymbolDetailProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
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
  additionalInfo = {} 
}: SymbolDetailProps) => {
  // Add mock data for additional metrics
  const mockData = {
    "52W High": "$" + (price + 20).toFixed(2),
    "52W Low": "$" + (price - 30).toFixed(2),
    "Market Cap": "$" + (price * 1000000000 / 150).toFixed(2) + "B",
    "P/E Ratio": (price / (price / 20)).toFixed(2),
    "Dividend Yield": (2.5).toFixed(2) + "%",
    "Volume": (Math.random() * 10000000 + 1000000).toFixed(0),
    "Avg. Volume": (Math.random() * 15000000 + 2000000).toFixed(0),
    "Beta": (1 + Math.random() * 0.5).toFixed(2),
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
          <div className="text-3xl font-mono font-semibold">${price.toFixed(2)}</div>
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
