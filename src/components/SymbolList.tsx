
import { useState } from "react";
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp, Minus } from "lucide-react"; // Added Minus
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button"; // Added Button for remove
import { Symbol } from "@/types"; // Using the new types file

interface SymbolListProps {
  symbols: Symbol[];
  onSelectSymbol: (symbol: Symbol) => void;
  onRemoveSymbol: (symbol: Symbol) => void; // New prop for removing symbol
  selectedSymbolValue?: string; // To highlight based on externally selected symbol value
}

const SymbolList = ({ symbols, onSelectSymbol, onRemoveSymbol, selectedSymbolValue }: SymbolListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (symbol: Symbol) => {
    onSelectSymbol(symbol);
  };

  const handleRemoveClick = (e: React.MouseEvent, symbol: Symbol) => {
    e.stopPropagation(); // Prevent row click event
    onRemoveSymbol(symbol);
  };
  
  if (!symbols) {
    return <div className="p-4 text-muted-foreground">Loading watchlist...</div>;
  }
  if (symbols.length === 0) {
    return <div className="p-4 text-muted-foreground">Your watchlist is empty. Add symbols from the "All Symbols" list.</div>
  }


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
        {/* Adjusted grid to include remove button column */}
        <div className="grid gap-2  grid-cols-[2fr_1fr_1fr_auto] md:grid-cols-[1fr_2fr_1fr_1fr_auto] text-xs font-medium text-muted-foreground p-2 border-y border-border sticky top-0 bg-secondary/80 z-10">
          <div className="md:hidden">Symbol/Name</div>
          <div className="hidden md:block">Symbol</div>
          <div className="hidden md:block truncate">Name</div>
          <div className="text-right pl-2">Price</div>
          <div className="text-right pl-2">Change</div>
          <div className="text-right pl-2">Action</div> {/* Header for remove button */}
        </div>
        <div> 
          {symbols.map((symbol) => (
            <div 
              key={symbol.symbol}
              onClick={() => handleClick(symbol)}
              className={`grid gap-2 grid-cols-[2fr_1fr_1fr_auto] md:grid-cols-[1fr_2fr_1fr_1fr_auto] items-center text-xs md:text-sm p-2 hover:bg-accent cursor-pointer transition-colors duration-200 ${
                selectedSymbolValue === symbol.symbol ? "bg-accent" : ""
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
              <div className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0" // Smaller icon button
                  onClick={(e) => handleRemoveClick(e, symbol)}
                  aria-label={`Remove ${symbol.symbol} from watchlist`}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SymbolList;
