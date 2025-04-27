
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search symbols (e.g. AAPL, MSFT)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
    </div>
  );
};

export default SearchBar;
