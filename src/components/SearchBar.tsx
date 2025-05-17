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
      onSearch(query.toUpperCase()); // Ensure query is uppercase for consistency
      setSuggestions([]);
      // setQuery(""); // Optionally clear query after search
    }
  };

  const handleSuggestionSelect = (suggestion: typeof mockSymbols[0]) => {
    onSearch(suggestion.symbol);
    setQuery(suggestion.symbol); // Set query to selected symbol
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search symbols (e.g. AAPL)" // Simplified placeholder
          value={query}
          onChange={handleQueryChange}
          className="pl-10 pr-4 py-2 w-full bg-secondary text-foreground placeholder:text-muted-foreground/70 rounded-md text-sm" // Adjusted padding and placeholder style
        />
        <button 
          type="submit" 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>
      {suggestions.length > 0 && ( // Conditionally render suggestions
        <SearchSuggestions 
          suggestions={suggestions} 
          onSelect={handleSuggestionSelect}
        />
      )}
    </div>
  );
};

export default SearchBar;
