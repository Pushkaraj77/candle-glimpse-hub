
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SearchSuggestions from "./SearchSuggestions";

// Mock data for suggestions - in a real app, this would come from an API
const mockSymbols = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co."},
  { symbol: "TSLA", name: "Tesla, Inc."}
];

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof mockSymbols>([]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      const filtered = mockSymbols.filter(
        (symbol) =>
          symbol.symbol.toLowerCase().includes(value.toLowerCase()) ||
          symbol.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.toUpperCase());
      setSuggestions([]);
      // setQuery(""); // Optionally clear query after search
    }
  };

  const handleSuggestionSelect = (suggestion: typeof mockSymbols[0]) => {
    onSearch(suggestion.symbol);
    setQuery(suggestion.symbol);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto"> {/* Centering and max-width for the search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT)" // Updated placeholder
          value={query}
          onChange={handleQueryChange}
          className="pl-12 pr-4 py-2 w-full bg-background border-border/70 focus:border-primary transition-colors duration-300 ease-in-out h-12 text-base rounded-lg shadow-sm placeholder:text-muted-foreground/60" // Enhanced styling: larger, prominent, better placeholder
        />
        <button 
          type="submit" 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" /> {/* Slightly larger icon */}
        </button>
      </form>
      {suggestions.length > 0 && (
        <SearchSuggestions 
          suggestions={suggestions} 
          onSelect={handleSuggestionSelect}
        />
      )}
    </div>
  );
};

export default SearchBar;
