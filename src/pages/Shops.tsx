import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ShopCard from "@/components/ShopCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, AlertCircle } from "lucide-react";
import { shopsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Shops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sortBy, setSortBy] = useState("rating");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [sortBy, onlyVerified, onlyOpen, searchParams]);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Apply filters
      if (onlyVerified) params.append('is_verified', 'true');
      if (onlyOpen) params.append('is_open', 'true');
      
      // Apply sorting
      if (sortBy === 'rating') params.append('ordering', '-average_rating');
      if (sortBy === 'name') params.append('ordering', 'name');
      
      // Apply search params from URL
      const search = searchParams.get('search');
      const location = searchParams.get('location');
      if (search) params.append('search', search);
      if (location) params.append('city', location);

      const response = await shopsAPI.list(params);
      setShops(response.results || response || []);
    } catch (err: any) {
      console.error('Failed to fetch shops:', err);
      setError(err.message || 'Failed to load shops');
      toast.error('Failed to load shops from server');
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, location: string) => {
    setSearchParams({ search: query, location });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-accent via-background to-muted py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
            Find the Perfect Repair Shop
          </h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Sort By */}
                  <div>
                    <Label className="mb-2 block">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Verified Only */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified">Verified Only</Label>
                    <Switch
                      id="verified"
                      checked={onlyVerified}
                      onCheckedChange={setOnlyVerified}
                    />
                  </div>

                  {/* Open Now */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="open">Open Now</Label>
                    <Switch
                      id="open"
                      checked={onlyOpen}
                      onCheckedChange={setOnlyOpen}
                    />
                  </div>

                  {/* Price Range - Mock for now */}
                  <div>
                    <Label className="mb-2 block">Price Range</Label>
                    <Slider defaultValue={[0, 100]} max={100} step={10} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹0</span>
                      <span>₹5000+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shops Grid */}
            <div className="flex-1">
              {error && (
                <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-500">
                    Unable to connect to backend API. Please ensure CORS is enabled on {import.meta.env.VITE_API_BASE_URL}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mb-4 text-muted-foreground">
                {isLoading ? 'Loading...' : `${shops.length} shops found`}
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {shops.map((shop) => (
                      <ShopCard 
                        key={shop.id}
                        id={shop.id}
                        name={shop.name}
                        description={shop.description}
                        city={shop.city}
                        state={shop.state}
                        rating={shop.average_rating || shop.rating || 0}
                        isOpen={shop.is_open}
                        isVerified={shop.is_verified}
                      />
                    ))}
                  </div>

                  {shops.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No shops found matching your criteria
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setOnlyVerified(false);
                          setOnlyOpen(false);
                          setSearchParams({});
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shops;
