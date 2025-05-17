
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
      className="bg-secondary/80 rounded-md overflow-hidden flex-1 flex flex-col min-h-0" // Added flex-1 for height management
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/50">
        <span className="font-medium text-sm md:text-base">Watchlist</span> {/* Responsive text */}
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex-1 overflow-y-auto min-h-0"> {/* Added flex-1 and min-h-0 for scroll */}
        {/* Header Row: Simplified for mobile */}
        <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr] text-xs font-medium text-muted-foreground p-2 border-y border-border sticky top-0 bg-secondary/80 z-10">
          <div className="md:hidden">Symbol/Name</div>
          <div className="hidden md:block">Symbol</div>
          <div className="hidden md:block truncate">Name</div>
          <div className="text-right">Price</div>
          <div className="text-right">Change</div>
        </div>
        {/* Data Rows */}
        {/* Removed fixed max-height, relying on parent flex */}
        <div> 
          {symbols.map((symbol) => (
            <div 
              key={symbol.symbol}
              onClick={() => handleClick(symbol)}
              className={`grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr] items-center text-xs md:text-sm p-2 hover:bg-accent cursor-pointer transition-colors duration-200 ${
                selectedSymbol === symbol.symbol ? "bg-accent" : ""
              }`}
            >
              {/* Mobile: Symbol and Name combined/stacked */}
              <div className="flex flex-col md:hidden">
                <div className="font-mono font-medium">{symbol.symbol}</div>
                <div className="truncate text-muted-foreground text-[0.7rem]">{symbol.name}</div>
              </div>
              {/* Desktop: Separate Symbol and Name */}
              <div className="hidden md:block font-mono font-medium">{symbol.symbol}</div>
              <div className="hidden md:block truncate">{symbol.name}</div>

              <div className="text-right font-mono">{symbol.price.toFixed(2)}</div>
              <div className={`text-right font-mono flex items-center justify-end ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {symbol.change >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-0.5 md:mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-0.5 md:mr-1" />
                )}
                {/* Show full change on desktop, percentage only (or shorter form) on mobile for this column cell */}
                <span className="hidden md:inline">{Math.abs(symbol.change).toFixed(2)}&nbsp;</span>
                <span>({Math.abs(symbol.changePercent).toFixed(2)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SymbolList;
