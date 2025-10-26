import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

const SearchBar = ({ 
  onSearch, 
  initialQuery = "", 
  initialLocation = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = () => {
    onSearch?.(query, location);
  };

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-4 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-3">
        {/* Service Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for services (e.g., Mobile Repair, AC Service)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 h-12 bg-background"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 h-12 bg-background"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          variant="hero"
          size="lg"
          className="h-12 px-8"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
