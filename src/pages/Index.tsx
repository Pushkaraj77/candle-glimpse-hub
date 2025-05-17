import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SymbolList from "@/components/SymbolList";
import ChartContainer from "@/components/ChartContainer";
import SymbolDetail from "@/components/SymbolDetail";
import AllSymbolsList from "@/components/AllSymbolsList"; // Import new component
import { Symbol } from "@/types"; // Import Symbol from types.ts
import { 
  ChartCandlestick, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X as MinimizeIcon,
  ChevronDown, // For new collapsible
  ChevronUp    // For new collapsible
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // For AllSymbolsList

// Renamed to ALL_AVAILABLE_SYMBOLS and serves as the master list of all possible symbols
const ALL_AVAILABLE_SYMBOLS: Symbol[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 184.92, change: 0.65, changePercent: 0.35 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 406.87, change: -2.13, changePercent: -0.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 147.60, change: 1.36, changePercent: 0.93 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.75, change: -1.05, changePercent: -0.58 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 177.80, change: 2.30, changePercent: 1.31 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 476.28, change: -3.72, changePercent: -0.77 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 900.50, change: 10.20, changePercent: 1.15 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 190.75, change: -0.50, changePercent: -0.26 },
];

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // State for the user's personal watchlist
  const [watchlistSymbols, setWatchlistSymbols] = useState<Symbol[]>(() => {
    // Initialize watchlist with first 2 symbols from ALL_AVAILABLE_SYMBOLS
    return ALL_AVAILABLE_SYMBOLS.slice(0, 2);
  });

  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(watchlistSymbols[0] || ALL_AVAILABLE_SYMBOLS[0]);
  
  const [showSidebar, setShowSidebar] = useState(!isMobile); 
  const [showWatchlistPanel, setShowWatchlistPanel] = useState(!isMobile); // Renamed for clarity
  const [isAllSymbolsOpen, setIsAllSymbolsOpen] = useState(false); // For AllSymbolsList collapsible

  // Update selectedSymbol if it's removed from watchlist or watchlist becomes empty
  useEffect(() => {
    if (watchlistSymbols.length > 0) {
      if (!watchlistSymbols.find(s => s.symbol === selectedSymbol.symbol)) {
        setSelectedSymbol(watchlistSymbols[0]);
      }
    } else if (ALL_AVAILABLE_SYMBOLS.length > 0) {
      setSelectedSymbol(ALL_AVAILABLE_SYMBOLS[0]);
    }
    // If both are empty, selectedSymbol could be an issue, but ALL_AVAILABLE_SYMBOLS is constant here
  }, [watchlistSymbols, selectedSymbol.symbol]);


  const handleSearch = (query: string) => {
    const foundSymbol = ALL_AVAILABLE_SYMBOLS.find(
      (s) => s.symbol.toLowerCase() === query.toLowerCase()
    );

    if (foundSymbol) {
      setSelectedSymbol(foundSymbol);
      if (isMobile) {
        setShowWatchlistPanel(false);
        setShowSidebar(false); 
      }
    } else {
      toast({
        variant: "destructive",
        title: "Symbol Not Found",
        description: `Could not find data for symbol "${query}".`,
      });
    }
  };

  // Called when a symbol is selected from SymbolList (watchlist)
  const handleSelectSymbolFromWatchlist = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    if (isMobile) { 
      setShowWatchlistPanel(false);
    }
  };

  const handleAddToWatchlist = (symbolToAdd: Symbol) => {
    if (!watchlistSymbols.find(s => s.symbol === symbolToAdd.symbol)) {
      setWatchlistSymbols(prev => [...prev, symbolToAdd]);
      toast({ title: "Added to Watchlist", description: `${symbolToAdd.symbol} has been added.` });
    } else {
      toast({ variant: "default", title: "Already in Watchlist", description: `${symbolToAdd.symbol} is already in your watchlist.` });
    }
  };

  const handleRemoveFromWatchlist = (symbolToRemove: Symbol) => {
    setWatchlistSymbols(prev => {
      const newWatchlist = prev.filter(s => s.symbol !== symbolToRemove.symbol);
       // If the removed symbol was selected, and the new watchlist is not empty, select its first item.
      if (selectedSymbol.symbol === symbolToRemove.symbol && newWatchlist.length > 0) {
        setSelectedSymbol(newWatchlist[0]);
      } else if (selectedSymbol.symbol === symbolToRemove.symbol && newWatchlist.length === 0 && ALL_AVAILABLE_SYMBOLS.length > 0) {
        // If watchlist becomes empty, select first from all available
        setSelectedSymbol(ALL_AVAILABLE_SYMBOLS[0]);
      }
      return newWatchlist;
    });
    toast({ title: "Removed from Watchlist", description: `${symbolToRemove.symbol} has been removed.` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
        <div className="flex items-center self-start md:self-center">
          <ChartCandlestick className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">StockVision</h1>
        </div>
        <div className="w-full md:w-[300px]">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex flex-1 overflow-hidden ${isMobile ? 'flex-col relative' : 'relative'}`}>
        {/* Left Panel (Watchlist & All Symbols) */}
        {((isMobile && showWatchlistPanel) || !isMobile) && (
          <div
            className={`transition-all duration-300 ease-in-out border-border p-2 md:p-4 flex flex-col
              ${isMobile
                ? showWatchlistPanel ? 'w-full order-1 h-1/2 md:h-auto border-b' : 'hidden' 
                : showWatchlistPanel ? 'w-[300px] border-r' : 'w-[50px] border-r'
              }`}
          >
            {showWatchlistPanel || !isMobile ? ( 
              <>
                <div className="flex items-center justify-between mb-1 md:mb-3">
                  {/* This title is for the whole panel now, SymbolList has its own */}
                  <h2 className="text-lg font-semibold">Market Lists</h2> 
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowWatchlistPanel(false)}
                    className={showWatchlistPanel ? "" : "hidden"} 
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                {showWatchlistPanel && (
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto"> {/* Container for both lists */}
                    <SymbolList 
                      symbols={watchlistSymbols} 
                      onSelectSymbol={handleSelectSymbolFromWatchlist}
                      onRemoveSymbol={handleRemoveFromWatchlist}
                      selectedSymbolValue={selectedSymbol.symbol}
                    />
                    <Collapsible
                      open={isAllSymbolsOpen}
                      onOpenChange={setIsAllSymbolsOpen}
                      className="bg-secondary/80 rounded-md overflow-hidden flex-1 flex flex-col min-h-0"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/50">
                        <span className="font-medium text-sm md:text-base">All Symbols</span>
                        {isAllSymbolsOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="flex-1 overflow-y-auto min-h-0">
                        <AllSymbolsList
                          allSymbols={ALL_AVAILABLE_SYMBOLS}
                          watchlistSymbols={watchlistSymbols}
                          onAddSymbol={handleAddToWatchlist}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </>
            ) : null}
            {!showWatchlistPanel && !isMobile && ( 
                <Button
                    variant="ghost"
                    size="icon"
                    className="self-center mt-2"
                    onClick={() => setShowWatchlistPanel(true)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
          </div>
        )}

        {/* Chart Panel */}
        <div className={`flex-1 p-1 md:p-4 ${isMobile ? 'order-2 w-full h-1/2 md:h-auto' : 'relative'}`}>
          {isMobile && !showWatchlistPanel && ( // Corrected state variable here
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm"
              onClick={() => {setShowWatchlistPanel(true); setShowSidebar(false);}} // Corrected state variable
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {/* Ensure selectedSymbol is valid before rendering ChartContainer */}
          {selectedSymbol && <ChartContainer symbol={selectedSymbol.symbol} />}
        </div>

        {/* Right Panel (Details) */}
        {((isMobile && showSidebar) || !isMobile) && (
           <div
            className={`transition-all duration-300 ease-in-out border-border
              ${isMobile
                ? showSidebar ? 'w-full order-3 p-2 md:p-4 border-t h-1/2 md:h-auto' : 'hidden'
                : showSidebar ? 'w-[300px] opacity-100 p-4 border-l' : 'w-0 opacity-0 overflow-hidden'
              }`}
          >
            {showSidebar && selectedSymbol && ( // Ensure selectedSymbol exists
              <>
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <h2 className="text-lg font-semibold">Details</h2>
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(false)}
                    className={isMobile ? '' : 'hidden md:hidden'} 
                  >
                    <MinimizeIcon className="h-5 w-5" />
                  </Button>
              </div>
              <SymbolDetail
                symbol={selectedSymbol.symbol}
                name={selectedSymbol.name}
                price={selectedSymbol.price}
                change={selectedSymbol.change}
                changePercent={selectedSymbol.changePercent}
              />
              </>
            )}
          </div>
        )}
        
        {/* Desktop Right Sidebar Toggle Button */}
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? "Hide details sidebar" : "Show details sidebar"}
          >
            {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
         {/* Mobile Details Toggle Button */}
         {isMobile && !showSidebar && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-20 bg-background/80 backdrop-blur-sm"
            onClick={() => {setShowSidebar(true); setShowWatchlistPanel(false);}} // Corrected state variable
            aria-label="Show details"
          >
            <Menu className="h-5 w-5" /> 
          </Button>
        )}
      </main>
    </div>
  );
};

export default Index;
