
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
    
    // Filter suggestions based on input
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
      onSearch(query);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion: typeof mockSymbols[0]) => {
    onSearch(suggestion.symbol);
    setQuery(suggestion.symbol);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search symbols (e.g. AAPL, MSFT)"
          value={query}
          onChange={handleQueryChange}
          className="pl-9 py-2 w-full bg-secondary text-foreground"
        />
        <button 
          type="submit" 
          className="absolute left-2 top-1/2 -translate-y-1/2"
          aria-label="Search"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>
      </form>
      <SearchSuggestions 
        suggestions={suggestions} 
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
};

export default SearchBar;
