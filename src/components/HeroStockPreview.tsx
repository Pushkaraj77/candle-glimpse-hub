
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChartBig, TrendingUp } from "lucide-react";

const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$178.72", change: "+1.32%", changeColor: "text-positive" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$375.68", change: "+1.14%", changeColor: "text-positive" },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$248.48", change: "+2.33%", changeColor: "text-positive" },
];

const HeroStockPreview = () => {
  return (
    <Card className="bg-secondary/70 border-border/30 shadow-xl backdrop-blur-md w-full max-w-md lg:max-w-lg animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChartBig className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-bold text-primary">StockTrader</CardTitle>
          </div>
          <Badge variant="outline" className="border-primary/50 text-primary/80 text-xs">AI Predictions</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {mockStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-3 bg-background/30 rounded-md hover:bg-background/50 transition-colors"
            >
              <div>
                <p className="font-mono font-semibold text-base text-foreground">{stock.symbol}</p>
                <p className="text-xs text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-base text-foreground">{stock.price}</p>
                <p className={`text-xs font-medium ${stock.changeColor}`}>{stock.change}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-background/30 rounded-md">
          <p className="text-xs font-medium text-muted-foreground mb-1">PREDICTION</p>
          <p className="text-sm text-foreground font-semibold">
            AAPL to reach $183.25 next week
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-positive font-medium">+2.54% <span className="text-xs text-muted-foreground">from current price</span></p>
            <Badge className="bg-positive/20 text-positive text-xs hover:bg-positive/30">High Confidence</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroStockPreview;
