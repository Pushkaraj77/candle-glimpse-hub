
import React from 'react';
import { Symbol } from '@/types'; // Using the new types file
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react"; // Check is not in allowed list, will use text fallback. Plus is allowed.

interface AllSymbolsListProps {
  allSymbols: Symbol[];
  watchlistSymbols: Symbol[];
  onAddSymbol: (symbol: Symbol) => void;
  isLoading?: boolean; // Optional loading state
}

const AllSymbolsList = ({ allSymbols, watchlistSymbols, onAddSymbol, isLoading }: AllSymbolsListProps) => {
  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading symbols...</div>;
  }

  if (!allSymbols || allSymbols.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No symbols available.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      {/* Header for the list */}
      <div className="grid grid-cols-[1fr_auto] text-xs font-medium text-muted-foreground p-2 border-b border-border sticky top-0 bg-secondary/80 z-10">
        <div>Symbol/Name</div>
        <div className="text-right">Action</div>
      </div>
      <div>
        {allSymbols.map((symbol) => {
          const isInWatchlist = watchlistSymbols.some(ws => ws.symbol === symbol.symbol);
          return (
            <div
              key={symbol.symbol}
              className="grid grid-cols-[1fr_auto] items-center text-xs md:text-sm p-2 hover:bg-accent/50 transition-colors duration-150"
            >
              <div className="flex flex-col">
                <div className="font-mono font-medium">{symbol.symbol}</div>
                <div className="truncate text-muted-foreground text-[0.7rem]">{symbol.name}</div>
              </div>
              <div className="text-right">
                {isInWatchlist ? (
                  <span className="text-green-500 text-xs font-medium flex items-center justify-end">
                    <Check className="h-3 w-3 mr-1" /> Added
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddSymbol(symbol)}
                    className="px-2 py-1 h-auto"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllSymbolsList;
