
import { useState } from "react";
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// This interface must match the one in Index.tsx
interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface SymbolListProps {
  symbols: Symbol[]; // Changed: symbols are now passed as a prop
  onSelectSymbol: (symbol: Symbol) => void;
}

const SymbolList = ({ symbols: propSymbols, onSelectSymbol }: SymbolListProps) => {
  // Removed local initialSymbols and useState for 'symbols'
  // The 'selectedSymbol' state here is for highlighting the item in this list
  const [highlightedSymbol, setHighlightedSymbol] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (symbol: Symbol) => {
    setHighlightedSymbol(symbol.symbol);
    onSelectSymbol(symbol);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-secondary/80 rounded-md overflow-hidden flex-1 flex flex-col min-h-0"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/50">
        <span className="font-medium text-sm md:text-base">Watchlist</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr] text-xs font-medium text-muted-foreground p-2 border-y border-border sticky top-0 bg-secondary/80 z-10">
          <div className="md:hidden">Symbol/Name</div>
          <div className="hidden md:block">Symbol</div>
          <div className="hidden md:block truncate">Name</div>
          <div className="text-right">Price</div>
          <div className="text-right">Change</div>
        </div>
        <div> 
          {propSymbols.map((symbol) => ( // Use propSymbols here
            <div 
              key={symbol.symbol}
              onClick={() => handleClick(symbol)}
              className={`grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr] items-center text-xs md:text-sm p-2 hover:bg-accent cursor-pointer transition-colors duration-200 ${
                highlightedSymbol === symbol.symbol ? "bg-accent" : "" // Use highlightedSymbol for local selection style
              }`}
            >
              <div className="flex flex-col md:hidden">
                <div className="font-mono font-medium">{symbol.symbol}</div>
                <div className="truncate text-muted-foreground text-[0.7rem]">{symbol.name}</div>
              </div>
              <div className="hidden md:block font-mono font-medium">{symbol.symbol}</div>
              <div className="hidden md:block truncate">{symbol.name}</div>

              <div className="text-right font-mono">{symbol.price.toFixed(2)}</div>
              <div className={`text-right font-mono flex items-center justify-end ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {symbol.change >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-0.5 md:mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-0.5 md:mr-1" />
                )}
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

