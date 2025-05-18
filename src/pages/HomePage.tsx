
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import HeroStockPreview from '@/components/HeroStockPreview'; // New component
import { BarChartBig, Home, Search as SearchIcon, TrendingUp, Zap } from 'lucide-react'; // Added BarChartBig, Home, SearchIcon

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/dashboard?symbol=${query.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* New Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <BarChartBig className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold">StockTrader</h1>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => alert('Sign In clicked!')}> {/* Placeholder action */}
              Sign In
            </Button>
            <Button variant="secondary" onClick={() => alert('Sign Up clicked!')}> {/* Placeholder action */}
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* New Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 md:px-6 py-16 md:py-24 lg:py-32">
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <Badge variant="outline" className="py-1 px-3 text-sm border-primary/50 text-primary bg-primary/10">
              <TrendingUp className="h-4 w-4 mr-2" /> AI-Driven Stock Predictions
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Trade Smarter with <span className="text-primary">AI Predictions</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Get real-time stock data, AI-powered predictions, and intelligent insights to make confident trading decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-cyan-foreground w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
              </Button>
            </div>
            <div className="pt-4">
              <SearchBar onSearch={handleSearch} />
              <p className="text-xs text-muted-foreground mt-2">
                Enter a stock symbol (e.g., AAPL, MSFT) to get started.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-300">
            <HeroStockPreview />
          </div>
        </section>
      </main>
      
      {/* Simplified Footer */}
      <footer className="py-8 text-center border-t border-border/50">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} StockTrader. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Disclaimer: Stock trading involves risk. AI predictions are not financial advice.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
