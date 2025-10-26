import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // Added useNavigate
import Navbar from "@/components/Navbar";
import ShopCard from "@/components/ShopCard";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, AlertCircle, MapPin } from "lucide-react"; // Added MapPin
import { shopsAPI } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Shops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Hook for navigation
  const [showFilters, setShowFilters] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Sort State - Initialize from URL params
  const [sortBy, setSortBy] = useState(searchParams.get('ordering') || "rating"); // Default 'rating' corresponds to '-average_rating' later
  const [onlyVerified, setOnlyVerified] = useState(searchParams.get('is_verified') === 'true');
  const [onlyOpen, setOnlyOpen] = useState(searchParams.get('is_open') === 'true');
  // Initialize search bar state from URL params as well
  const [initialSearch, setInitialSearch] = useState(searchParams.get('search') || '');
  const [initialLocation, setInitialLocation] = useState(searchParams.get('location') || searchParams.get('city') || '');
  const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '');


  useEffect(() => {
    // Update state if URL parameters change externally (e.g., browser back/forward)
     setSortBy(searchParams.get('ordering') || "rating");
     setOnlyVerified(searchParams.get('is_verified') === 'true');
     setOnlyOpen(searchParams.get('is_open') === 'true');
     setInitialSearch(searchParams.get('search') || '');
     setInitialLocation(searchParams.get('location') || searchParams.get('city') || '');
     setServiceFilter(searchParams.get('service') || '');
     fetchShops();
  }, [searchParams]); // Re-fetch when searchParams change

    // Update URL when filters change
   useEffect(() => {
     const params = new URLSearchParams(searchParams);
     if (sortBy === 'rating') params.set('ordering', '-average_rating');
     else if (sortBy === 'name') params.set('ordering', 'name');
     else params.delete('ordering');

     if (onlyVerified) params.set('is_verified', 'true'); else params.delete('is_verified');
     if (onlyOpen) params.set('is_open', 'true'); else params.delete('is_open');

      // Keep existing search/location/service params
     const search = params.get('search');
     const location = params.get('location') || params.get('city');
     const service = params.get('service');

     if(search) params.set('search', search); else params.delete('search');
     if(location) params.set('location', location); else { params.delete('location'); params.delete('city'); }
     if(service) params.set('service', service); else params.delete('service');


     // Use navigate to update URL without full reload (replace: true prevents history spam)
     navigate(`?${params.toString()}`, { replace: true });
     // fetchShops is called by the useEffect watching searchParams

   }, [sortBy, onlyVerified, onlyOpen, navigate]); // Depend on filter states

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams(searchParams); // Use current URL params

      // Ensure sorting param matches API expectation
      if (params.get('ordering') === 'rating') {
          params.set('ordering', '-average_rating');
      }

      // If location param exists, use it for city filter if city not already set
      const location = params.get('location');
      if (location && !params.has('city')) {
          params.set('city', location);
          params.delete('location'); // Clean up - use 'city' consistently if that's the API param
      }

      // If service param exists, add it to the search query for the API
      // Note: Adapt this if your API has a dedicated 'service_name' or 'service_id' filter
      const service = params.get('service');
      const currentSearch = params.get('search') || '';
      if (service) {
         params.set('search', `${currentSearch} ${service}`.trim());
         // Don't delete 'service' param from URL, keep it for user clarity maybe?
         // params.delete('service');
      }


      console.log("Fetching shops with params:", params.toString()); // Debugging

      const response = await shopsAPI.list(params);
      setShops(response.results || response || []);
    } catch (err: any) {
      console.error('Failed to fetch shops:', err);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      setError(`Failed to load shops from ${apiBaseUrl}. Ensure it's running and CORS is configured.`);
      toast.error('Failed to load shops from server');
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, location: string) => {
      // Update URL parameters, which triggers the useEffect to re-fetch
      const newParams = new URLSearchParams(searchParams);
      if (query) newParams.set('search', query); else newParams.delete('search');
      if (location) {
          newParams.set('location', location); // Keep 'location' for consistency with search bar
          newParams.delete('city'); // Remove city if location is set
      } else {
          newParams.delete('location');
      }

      // Keep service filter if it exists
      const currentService = newParams.get('service');
      if (currentService) newParams.set('service', currentService); else newParams.delete('service');


      setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header & Search */}
      <section className="bg-gradient-to-br from-accent via-background to-muted py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
            Find the Perfect Repair Shop
          </h1>
          {/* Pass initial values from URL params to SearchBar */}
          <SearchBar
              key={`${initialSearch}-${initialLocation}`} // Force re-render if params change
              initialQuery={initialSearch}
              initialLocation={initialLocation}
              onSearch={handleSearch}
          />
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
                        <SelectValue placeholder="Select sorting"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                         {/* Add more sort options if API supports */}
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

                   {/* Add Service Type Filter if needed */}
                   {/* <div>
                       <Label className="mb-2 block">Service Type</Label>
                       <Input placeholder="e.g., Screen Repair" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} />
                       <Button size="sm" variant="outline" className="mt-2" onClick={() => updateServiceFilter(serviceFilter)}>Apply</Button>
                   </div> */}


                  {/* Price Range - Mock */}
                  {/* <div>
                    <Label className="mb-2 block">Price Range</Label>
                    <Slider defaultValue={[0, 100]} max={100} step={10} disabled/>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹0</span>
                      <span>₹5000+</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Shops Grid */}
            <div className="flex-1">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mb-4 text-muted-foreground">
                {isLoading ? 'Loading shops...' : `${shops.length} shop${shops.length !== 1 ? 's' : ''} found`}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-[300px] rounded-xl" /> // Match ShopCard approx height
                  ))}
                </div>
              ) : (
                <>
                  {shops.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {shops.map((shop) => (
                          <ShopCard
                            key={shop.id}
                            id={shop.id}
                            name={shop.name}
                            description={shop.description}
                            city={shop.city}
                            state={shop.state}
                            rating={shop.average_rating || 0} // Use average_rating
                            isOpen={shop.is_open}
                            isVerified={shop.is_verified}
                            cover_image={shop.cover_image} // Pass cover_image
                          />
                        ))}
                     </div>
                  ) : (
                    <div className="text-center py-16">
                      <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg mb-4">
                        No shops found matching your criteria.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Reset state and URL params
                          setSortBy("rating");
                          setOnlyVerified(false);
                          setOnlyOpen(false);
                          setInitialSearch('');
                          setInitialLocation('');
                          setSearchParams({});
                        }}
                      >
                        Clear Filters & Search
                      </Button>
                    </div>
                  )}
                </>
              )}

                {/* Optional: Add Pagination if API supports it */}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shops;
