
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SymbolList from "@/components/SymbolList";
import ChartContainer from "@/components/ChartContainer";
import SymbolDetail from "@/components/SymbolDetail";
import { ChartCandlestick, ChevronLeft, ChevronRight, Menu, X as MinimizeIcon } from "lucide-react"; // Renamed X to MinimizeIcon for clarity
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// Moved from SymbolList.tsx to be the source of truth in Index.tsx
const AVAILABLE_SYMBOLS: Symbol[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 184.92, change: 0.65, changePercent: 0.35 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 406.87, change: -2.13, changePercent: -0.52 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 147.60, change: 1.36, changePercent: 0.93 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.75, change: -1.05, changePercent: -0.58 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 177.80, change: 2.30, changePercent: 1.31 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 476.28, change: -3.72, changePercent: -0.77 },
];

const Index = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast(); // Initialize toast
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(AVAILABLE_SYMBOLS[0]); // Initialize with the first symbol from our list
  const [showSidebar, setShowSidebar] = useState(!isMobile); 
  const [showWatchlist, setShowWatchlist] = useState(!isMobile); 

  const handleSearch = (query: string) => {
    console.log("Index.tsx - Searching for:", query);
    const foundSymbol = AVAILABLE_SYMBOLS.find(
      (s) => s.symbol.toLowerCase() === query.toLowerCase()
    );

    if (foundSymbol) {
      setSelectedSymbol(foundSymbol);
      if (isMobile) { // On mobile, after selecting a symbol via search, hide other panels
        setShowWatchlist(false);
        setShowSidebar(false); 
      }
    } else {
      console.warn(`Symbol ${query} not found in AVAILABLE_SYMBOLS.`);
      toast({
        variant: "destructive",
        title: "Symbol Not Found",
        description: `Could not find data for symbol "${query}".`,
      });
    }
  };

  const handleSelectSymbol = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    if (isMobile) { 
      setShowWatchlist(false); // Hide watchlist after selection from list on mobile
      // setShowSidebar(false); // Optionally hide details too
    }
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
        {/* Left Panel (Watchlist) */}
        {((isMobile && showWatchlist) || !isMobile) && (
          <div
            className={`transition-all duration-300 ease-in-out border-border p-2 md:p-4 flex flex-col
              ${isMobile
                ? showWatchlist ? 'w-full order-1 h-1/2 md:h-auto border-b' : 'hidden' 
                : showWatchlist ? 'w-[300px] border-r' : 'w-[50px] border-r'
              }`}
          >
            {showWatchlist || !isMobile ? ( 
              <>
                <div className="flex items-center justify-between mb-1 md:mb-3">
                  <h2 className="text-lg font-semibold">Watchlist</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowWatchlist(false)}
                    className={showWatchlist ? "" : "hidden"} 
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                {/* Pass AVAILABLE_SYMBOLS to SymbolList */}
                {showWatchlist && <SymbolList symbols={AVAILABLE_SYMBOLS} onSelectSymbol={handleSelectSymbol} />} 
              </>
            ) : null}
            {!showWatchlist && !isMobile && ( 
                <Button
                    variant="ghost"
                    size="icon"
                    className="self-center mt-2"
                    onClick={() => setShowWatchlist(true)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
          </div>
        )}

        {/* Chart Panel */}
        <div className={`flex-1 p-1 md:p-4 ${isMobile ? 'order-2 w-full h-1/2 md:h-auto' : 'relative'}`}>
          {isMobile && !showWatchlist && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm"
              onClick={() => {setShowWatchlist(true); setShowSidebar(false);}}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <ChartContainer symbol={selectedSymbol.symbol} />
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
            {showSidebar && (
              <>
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <h2 className="text-lg font-semibold">Details</h2>
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(false)}
                    className={isMobile ? '' : 'hidden md:hidden'} // Explicitly hide on md and up if mobile styles apply
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
            onClick={() => {setShowSidebar(true); setShowWatchlist(false);}}
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

