import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar';
import HeroStockPreview from '@/components/HeroStockPreview';
import { BarChartBig, Home, Search as SearchIcon, TrendingUp, Zap, Lightbulb, ShieldCheck, Rocket, Linkedin, Twitter, Github } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/dashboard?symbol=${query.toUpperCase()}`);
    }
  };

  const featureItems = [
    {
      icon: <Zap className="h-10 w-10 text-primary mb-4" />,
      title: "AI-Powered Predictions",
      description: "Leverage cutting-edge AI to forecast market trends and make informed decisions.",
    },
    {
      icon: <BarChartBig className="h-10 w-10 text-primary mb-4" />,
      title: "Real-Time Data",
      description: "Access up-to-the-minute stock prices, historical data, and comprehensive analytics.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
      title: "Secure & Reliable",
      description: "Trade with confidence on a platform built with robust security and high availability.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary mb-4" />,
      title: "Actionable Insights",
      description: "Gain clear, actionable insights from complex data, simplified for you.",
    },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Sign Up in Minutes",
      description: "Create your free account quickly and start exploring the platform.",
    },
    {
      step: "02",
      title: "Search & Analyze",
      description: "Use our powerful search to find stocks and analyze their performance with AI tools.",
    },
    {
      step: "03",
      title: "Trade with Confidence",
      description: "Make smarter trades backed by AI predictions and comprehensive market data.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
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
             <Button variant="ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              How it Works
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            {/* Sign In and Sign Up buttons removed as per request */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center px-4 md:px-6 py-16 md:py-24 lg:py-32">
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
            <div className="pt-6"> {/* Increased top padding for SearchBar */}
              <SearchBar onSearch={handleSearch} />
              <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left"> {/* Centered on small screens */}
                Enter a stock symbol (e.g., AAPL, MSFT) to get started.
              </p>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-cyan-foreground w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
                <Rocket className="ml-2 h-5 w-5"/>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-300">
            <HeroStockPreview />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StockTrader?</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Our platform is packed with features designed to give you a trading edge.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-background/70 p-8 rounded-xl shadow-lg hover:shadow-primary/20 border border-transparent hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 text-center animate-fade-in" 
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <div className="flex justify-center mb-6">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Easy Steps</h2>
              <p className="text-muted-foreground md:text-lg max-w-xl mx-auto">
                Begin your journey to smarter trading in just a few minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Dashed line connector for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                  <svg width="100%" height="2" className="overflow-visible">
                    <line x1="15%" y1="1" x2="85%" y2="1" strokeDasharray="5,5" className="stroke-border/70" strokeWidth="2"/>
                  </svg>
              </div>
              {howItWorksSteps.map((item, index) => (
                <div 
                  key={index} 
                  className="relative bg-secondary/60 p-8 rounded-xl shadow-xl text-center animate-fade-in z-10 transform transition-all duration-300 hover:scale-105 hover:shadow-primary/25" 
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold shadow-2xl">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mt-10 mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section 
          className="py-20 md:py-28"
          style={{ background: 'linear-gradient(75deg, hsl(var(--secondary)) 0%, hsl(var(--background) / 0.8) 100%)' }}
        >
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary animate-fade-in">
              Ready to Elevate Your Trading?
            </h2>
            <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
              Join StockTrader today and unlock the future of investment with powerful AI insights, real-time data, and a seamless trading experience.
            </p>
            <Button 
              size="lg" 
              className="bg-cyan-500 hover:bg-cyan-600 text-cyan-foreground text-lg px-12 py-7 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 animate-fade-in animation-delay-300"
              onClick={() => alert('Sign Up from CTA clicked!')}
            >
              Sign Up For Free
              <Rocket className="ml-2 h-6 w-6"/>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="py-12 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChartBig className="h-7 w-7 text-primary" />
                <h3 className="text-xl font-bold text-foreground">StockTrader</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-driven insights for smarter stock trading.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#features" onClick={(e) => {e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });}} className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-border/50 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} StockTrader. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            </div>
          </div>
           <p className="text-xs text-muted-foreground mt-6 text-center">
            Disclaimer: Stock trading involves risk. AI predictions are not financial advice. Past performance is not indicative of future results. Consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
