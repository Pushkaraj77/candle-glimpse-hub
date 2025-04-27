
import { useState } from "react";
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data for initial symbols
const initialSymbols = [
  { symbol: "AAPL", name: "Apple Inc.", price: 184.92, change: 0.65, changePercent: 0.35 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 406.87, change: -2.13, changePercent: -0.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 147.60, change: 1.36, changePercent: 0.93 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.75, change: -1.05, changePercent: -0.58 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 177.80, change: 2.30, changePercent: 1.31 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 476.28, change: -3.72, changePercent: -0.77 },
];

interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface SymbolListProps {
  onSelectSymbol: (symbol: Symbol) => void;
}

const SymbolList = ({ onSelectSymbol }: SymbolListProps) => {
  const [symbols, setSymbols] = useState<Symbol[]>(initialSymbols);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (symbol: Symbol) => {
    setSelectedSymbol(symbol.symbol);
    onSelectSymbol(symbol);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-secondary/80 rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/50">
        <span className="font-medium">Watchlist</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] text-xs font-medium text-muted-foreground p-2 border-y border-border">
          <div>Symbol</div>
          <div>Name</div>
          <div className="text-right">Price</div>
          <div className="text-right">Change</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {symbols.map((symbol) => (
            <div 
              key={symbol.symbol}
              onClick={() => handleClick(symbol)}
              className={`grid grid-cols-[1fr_2fr_1fr_1fr] text-sm p-2 hover:bg-accent cursor-pointer transition-colors duration-200 ${
                selectedSymbol === symbol.symbol ? "bg-accent" : ""
              }`}
            >
              <div className="font-mono font-medium">{symbol.symbol}</div>
              <div className="truncate">{symbol.name}</div>
              <div className="text-right font-mono">{symbol.price.toFixed(2)}</div>
              <div className={`text-right font-mono flex items-center justify-end ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {symbol.change >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(symbol.change).toFixed(2)} ({Math.abs(symbol.changePercent).toFixed(2)}%)
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SymbolList;
