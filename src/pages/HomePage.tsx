
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Zap } from 'lucide-react';
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar'; // Re-using the existing SearchBar

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/dashboard?symbol=${query.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="py-4 px-6 md:px-10 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center">
          <TrendingUp className="h-7 w-7 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">StockVision AI</h1>
        </div>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          Go to Dashboard
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        <Zap className="h-16 w-16 md:h-20 md:w-20 text-primary mb-6" />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
          Smart Stock Trading, <span className="text-primary">AI Powered</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
          Leverage cutting-edge AI predictions to make smarter investment decisions. Analyze market trends and discover opportunities with StockVision AI.
        </p>
        <div className="w-full max-w-md md:max-w-lg">
          <SearchBar onSearch={handleSearch} />
          <p className="text-xs text-muted-foreground mt-2">
            Enter a stock symbol (e.g., AAPL, MSFT, TSLA) to get started.
          </p>
        </div>
      </main>

      {/* Features Section (Example) */}
      <section className="py-16 md:py-24 bg-secondary/30 w-full">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why StockVision AI?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-background/50 rounded-lg shadow-md">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">AI Predictions</h4>
              <p className="text-muted-foreground text-sm">
                Harness the power of artificial intelligence for insightful stock forecasts.
              </p>
            </div>
            <div className="p-6 bg-background/50 rounded-lg shadow-md">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Comprehensive Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Access detailed charts, historical data, and market indicators.
              </p>
            </div>
            <div className="p-6 bg-background/50 rounded-lg shadow-md">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">User-Friendly Interface</h4>
              <p className="text-muted-foreground text-sm">
                Navigate effortlessly through a clean, intuitive, and responsive platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border/50">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} StockVision AI. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Disclaimer: Stock trading involves risk. AI predictions are not financial advice.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

