import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SymbolList from "@/components/SymbolList";
import ChartContainer from "@/components/ChartContainer";
import SymbolDetail from "@/components/SymbolDetail";
import AllSymbolsList from "@/components/AllSymbolsList";
import DashboardLoader from "@/components/DashboardLoader"; // Import the new loader
import { Symbol } from "@/types";
import { 
  ChartCandlestick, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X as MinimizeIcon,
  ChevronDown,
  ChevronUp,
  Home, // Added Home icon
  ZoomIn, // Added for ChartContainer controls
  ZoomOut, // Added for ChartContainer controls
  Move // Added for ChartContainer controls
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

const DashboardPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams(); // For reading URL query
  const navigate = useNavigate(); // For navigation
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const [watchlistSymbols, setWatchlistSymbols] = useState<Symbol[]>(() => {
    return ALL_AVAILABLE_SYMBOLS.slice(0, 2);
  });

  // Initialize selectedSymbol: try URL, then first of watchlist, then first of all available
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>(() => {
    const symbolFromUrl = searchParams.get('symbol');
    if (symbolFromUrl) {
      const found = ALL_AVAILABLE_SYMBOLS.find(s => s.symbol.toLowerCase() === symbolFromUrl.toLowerCase());
      if (found) return found;
    }
    return watchlistSymbols[0] || ALL_AVAILABLE_SYMBOLS[0];
  });
  
  const [showSidebar, setShowSidebar] = useState(!isMobile); 
  const [showWatchlistPanel, setShowWatchlistPanel] = useState(!isMobile);
  const [isAllSymbolsOpen, setIsAllSymbolsOpen] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Simulate a 2.5 second load time
    return () => clearTimeout(timer);
  }, []);

  // Effect to handle symbol changes from URL query parameters
  useEffect(() => {
    const symbolFromQuery = searchParams.get('symbol');
    if (symbolFromQuery) {
      const foundSymbol = ALL_AVAILABLE_SYMBOLS.find(
        (s) => s.symbol.toLowerCase() === symbolFromQuery.toLowerCase()
      );
      if (foundSymbol) {
        if (selectedSymbol.symbol !== foundSymbol.symbol) { // Only update if different
          setSelectedSymbol(foundSymbol);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Symbol Not Found",
          description: `Could not find data for symbol "${symbolFromQuery}" from URL. Displaying default.`,
        });
        // Optionally remove the invalid symbol from URL or navigate to default
        // For now, it will just show default based on initial state logic if symbolFromQuery is bad
        if (watchlistSymbols.length > 0 && selectedSymbol.symbol !== watchlistSymbols[0].symbol) {
            setSelectedSymbol(watchlistSymbols[0]);
        } else if (ALL_AVAILABLE_SYMBOLS.length > 0 && selectedSymbol.symbol !== ALL_AVAILABLE_SYMBOLS[0].symbol) {
            setSelectedSymbol(ALL_AVAILABLE_SYMBOLS[0]);
        }
      }
    }
  }, [searchParams, toast, selectedSymbol.symbol, watchlistSymbols]); // Added dependencies


  // Update selectedSymbol if it's removed from watchlist or watchlist becomes empty
  useEffect(() => {
    if (watchlistSymbols.length > 0) {
      if (!watchlistSymbols.find(s => s.symbol === selectedSymbol.symbol)) {
        setSelectedSymbol(watchlistSymbols[0]);
      }
    } else if (ALL_AVAILABLE_SYMBOLS.length > 0 && (!selectedSymbol || !ALL_AVAILABLE_SYMBOLS.find(s => s.symbol === selectedSymbol.symbol))) {
      setSelectedSymbol(ALL_AVAILABLE_SYMBOLS[0]);
    }
  }, [watchlistSymbols, selectedSymbol?.symbol]);


  const handleSearch = (query: string) => {
    const foundSymbol = ALL_AVAILABLE_SYMBOLS.find(
      (s) => s.symbol.toLowerCase() === query.toLowerCase()
    );

    if (foundSymbol) {
      setSelectedSymbol(foundSymbol);
      setSearchParams({ symbol: foundSymbol.symbol });
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

  const handleSelectSymbolFromWatchlist = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
    setSearchParams({ symbol: symbol.symbol }); // Update URL
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
      if (selectedSymbol.symbol === symbolToRemove.symbol) {
        if (newWatchlist.length > 0) {
          setSelectedSymbol(newWatchlist[0]);
          setSearchParams({ symbol: newWatchlist[0].symbol });
        } else if (ALL_AVAILABLE_SYMBOLS.length > 0) {
          setSelectedSymbol(ALL_AVAILABLE_SYMBOLS[0]);
          setSearchParams({ symbol: ALL_AVAILABLE_SYMBOLS[0].symbol });
        } else {
          // No symbols left
        }
      }
      return newWatchlist;
    });
    toast({ title: "Removed from Watchlist", description: `${symbolToRemove.symbol} has been removed.` });
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center self-start md:self-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
            <Home className="h-5 w-5" />
          </Button>
          <ChartCandlestick className="h-6 w-6 mr-2 text-primary" /> {/* Adjusted logo size slightly */}
          <h1 className="text-xl font-bold">
            <span className="text-primary">StockTrader</span>
            <span className="text-sky-400"> AI</span>
          </h1>
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
                : showWatchlistPanel ? 'w-[280px] md:w-[300px] border-r h-auto' : 'w-[50px] border-r' // ensure h-auto for desktop
              }`}
          >
            {showWatchlistPanel || !isMobile ? ( 
              <>
                <div className="flex items-center justify-end mb-1 md:mb-3"> 
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
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
                    <SymbolList 
                      symbols={watchlistSymbols} 
                      onSelectSymbol={handleSelectSymbolFromWatchlist}
                      onRemoveSymbol={handleRemoveFromWatchlist}
                      selectedSymbolValue={selectedSymbol?.symbol}
                    />
                    <Collapsible
                      open={isAllSymbolsOpen}
                      onOpenChange={setIsAllSymbolsOpen}
                      className="bg-secondary/50 rounded-md overflow-hidden flex-1 flex flex-col min-h-0"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent/50 rounded-t-md">
                        <span className="font-medium text-sm md:text-base">All Market Symbols</span>
                        {isAllSymbolsOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="flex-1 overflow-y-auto min-h-0 p-2">
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
                    aria-label="Show watchlist panel"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
          </div>
        )}

        {/* Chart Panel */}
        <div className={`flex-1 p-1 md:p-4 ${isMobile ? 'order-2 w-full h-1/2 md:h-auto' : 'relative'}`}>
          {isMobile && !showWatchlistPanel && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm border-border" // Ensure border consistency
              onClick={() => {setShowWatchlistPanel(true); setShowSidebar(false);}}
              aria-label="Open watchlist panel"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {selectedSymbol && <ChartContainer symbol={selectedSymbol.symbol} />}
        </div>

        {/* Right Panel (Details) */}
        {((isMobile && showSidebar) || !isMobile) && (
           <div
            className={`transition-all duration-300 ease-in-out border-border
              ${isMobile
                ? showSidebar ? 'w-full order-3 p-2 md:p-4 border-t h-1/2 md:h-auto' : 'hidden'
                : showSidebar ? 'w-[280px] md:w-[300px] opacity-100 p-4 border-l h-auto' : 'w-0 opacity-0 overflow-hidden' // ensure h-auto for desktop
              }`}
          >
            {showSidebar && selectedSymbol && (
              <>
              <div className="flex items-center justify-between mb-1 md:mb-3">
                <h2 className="text-lg font-semibold pl-1">Details</h2>
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(false)}
                    className={isMobile ? '' : 'hidden md:hidden'} 
                    aria-label="Close details panel"
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border" // Ensure border consistency
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
            className="absolute top-2 right-2 z-20 bg-background/80 backdrop-blur-sm border-border" // Ensure border consistency
            onClick={() => {setShowSidebar(true); setShowWatchlistPanel(false);}}
            aria-label="Show details panel"
          >
            <Menu className="h-5 w-5" /> 
          </Button>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
