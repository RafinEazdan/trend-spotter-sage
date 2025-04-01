
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { searchStocks } from "@/lib/stock-utils";

interface StockSearchProps {
  onSelectStock: (symbol: string, name: string) => void;
}

const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get initial popular stocks when component mounts
    if (!query) {
      setResults(searchStocks(""));
    }
  }, []);
  
  useEffect(() => {
    // Update search results when query changes
    setResults(searchStocks(query));
  }, [query]);
  
  useEffect(() => {
    // Handle clicks outside the search component to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      onSelectStock(results[0].symbol, results[0].name);
      setIsOpen(false);
    }
  };
  
  const handleSelect = (symbol: string, name: string) => {
    onSelectStock(symbol, name);
    setQuery("");
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for stocks (e.g., AAPL)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pr-10"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      {isOpen && results.length > 0 && (
        <Card className="absolute w-full mt-1 z-10 max-h-72 overflow-auto custom-scrollbar shadow-lg">
          <ul className="py-1 px-1">
            {results.map((stock) => (
              <li key={stock.symbol}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left py-2 px-3 my-1 h-auto"
                  onClick={() => handleSelect(stock.symbol, stock.name)}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{stock.symbol}</span>
                    <span className="text-sm text-muted-foreground">{stock.name}</span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;
