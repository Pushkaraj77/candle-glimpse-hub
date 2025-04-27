
import { Button } from "@/components/ui/button";

interface SearchSuggestion {
  symbol: string;
  name: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestions = ({ suggestions, onSelect }: SearchSuggestionsProps) => {
  if (!suggestions.length) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-secondary/95 rounded-md shadow-lg border border-border z-50">
      <div className="py-1 max-h-60 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.symbol}
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-left hover:bg-accent"
            onClick={() => onSelect(suggestion)}
          >
            <div>
              <div className="font-mono font-medium">{suggestion.symbol}</div>
              <div className="text-xs text-muted-foreground truncate">
                {suggestion.name}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
