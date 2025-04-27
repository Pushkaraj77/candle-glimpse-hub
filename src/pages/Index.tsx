
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import SymbolList from "@/components/SymbolList";
import ChartContainer from "@/components/ChartContainer";
import SymbolDetail from "@/components/SymbolDetail";
import { ChartCandlestick, ChevronLeft, ChevronRight } from "lucide-react";

interface Symbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Index = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<Symbol>({
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 184.92,
    change: 0.65,
    changePercent: 0.35
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [showWatchlist, setShowWatchlist] = useState(true);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // In a real app, this would search for the symbol and update the state
  };

  const handleSelectSymbol = (symbol: Symbol) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <ChartCandlestick className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">StockVision</h1>
        </div>
        <div className="w-[300px]">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`transition-all duration-300 ease-in-out ${showWatchlist ? 'w-[300px]' : 'w-[50px]'} border-r border-border p-4 flex flex-col`}>
          {showWatchlist ? (
            <>
              <h2 className="text-lg font-semibold mb-3">Watchlist</h2>
              <SymbolList onSelectSymbol={handleSelectSymbol} />
              <Button
                variant="ghost"
                size="icon"
                className="mt-4 self-end"
                onClick={() => setShowWatchlist(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="self-center"
              onClick={() => setShowWatchlist(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Chart Panel */}
        <div className="flex-1 p-4 relative">
          <ChartContainer symbol={selectedSymbol.symbol} />
        </div>

        {/* Right Panel (Details) */}
        <div className={`transition-all duration-300 ease-in-out ${showSidebar ? 'w-[300px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
          <div className="h-full border-l border-border p-4">
            <SymbolDetail 
              symbol={selectedSymbol.symbol}
              name={selectedSymbol.name}
              price={selectedSymbol.price}
              change={selectedSymbol.change}
              changePercent={selectedSymbol.changePercent}
            />
          </div>
        </div>
        
        {/* Sidebar Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </main>
    </div>
  );
};

export default Index;
