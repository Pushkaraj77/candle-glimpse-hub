
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SymbolList from "@/components/SymbolList";
import ChartContainer from "@/components/ChartContainer";
import SymbolDetail from "@/components/SymbolDetail";
import { ChartCandlestick, ChevronLeft, ChevronRight, Menu, X as Minimize } from "lucide-react"; // Added Menu, Minimize (as X)
import { useIsMobile } from "@/hooks/use-mobile";

interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>({
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 184.92,
    change: 0.65,
    changePercent: 0.35
  });
  const [showSidebar, setShowSidebar] = useState(!isMobile); // Default to true on desktop, false on mobile
  const [showWatchlist, setShowWatchlist] = useState(!isMobile); // Default to true on desktop, false on mobile

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // In a real app, this would search for the symbol and update the state
  };

  const handleSelectSymbol = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    if (isMobile) { // On mobile, after selecting a symbol, one might want to hide the list
      setShowWatchlist(false);
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
                ? showWatchlist ? 'w-full order-1 h-1/2 md:h-auto border-b' : 'hidden' // Takes space or hidden
                : showWatchlist ? 'w-[300px] border-r' : 'w-[50px] border-r' // Desktop behavior
              }`}
          >
            {showWatchlist || !isMobile ? ( // Show content if watchlist is to be shown OR it's not mobile (for the collapsed desktop view)
              <>
                <div className="flex items-center justify-between mb-1 md:mb-3">
                  <h2 className="text-lg font-semibold">Watchlist</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowWatchlist(false)}
                    className={showWatchlist ? "" : "hidden"} // Hide if already collapsed on desktop
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                {showWatchlist && <SymbolList onSelectSymbol={handleSelectSymbol} />} 
              </>
            ) : null}
            {!showWatchlist && !isMobile && ( // Collapsed view button for desktop
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
                    className={isMobile ? '' : 'hidden'}
                  >
                    <Minimize className="h-5 w-5" />
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
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </main>
    </div>
  );
};

export default Index;
