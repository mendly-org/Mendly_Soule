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
import { SlidersHorizontal } from "lucide-react";

const Shops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock shops data - TODO: Connect to API
  const mockShops = [
    {
      id: 1,
      name: "TechFix Solutions",
      description: "Expert mobile and laptop repairs with 10+ years experience. Same-day service available.",
      city: "Bangalore",
      state: "Karnataka",
      rating: 4.8,
      isOpen: true,
      isVerified: true,
    },
    {
      id: 2,
      name: "Cool Air Services",
      description: "AC installation, repair, and maintenance specialists with certified technicians",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.6,
      isOpen: true,
      isVerified: true,
    },
    {
      id: 3,
      name: "SmartDevice Clinic",
      description: "Premium electronics repair with same-day service and warranty on all repairs",
      city: "Delhi",
      state: "Delhi",
      rating: 4.9,
      isOpen: false,
      isVerified: true,
    },
    {
      id: 4,
      name: "Quick Repair Hub",
      description: "Fast and reliable repairs for all your electronic devices",
      city: "Bangalore",
      state: "Karnataka",
      rating: 4.5,
      isOpen: true,
      isVerified: false,
    },
    {
      id: 5,
      name: "Elite Tech Service",
      description: "Professional tech repair services with affordable pricing",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.7,
      isOpen: true,
      isVerified: true,
    },
    {
      id: 6,
      name: "Digital Solutions Pro",
      description: "Complete electronics repair and maintenance services",
      city: "Hyderabad",
      state: "Telangana",
      rating: 4.4,
      isOpen: true,
      isVerified: false,
    },
  ];

  const [shops, setShops] = useState(mockShops);
  const [sortBy, setSortBy] = useState("rating");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch from API based on filters
    let filtered = [...mockShops];

    if (onlyVerified) {
      filtered = filtered.filter(shop => shop.isVerified);
    }

    if (onlyOpen) {
      filtered = filtered.filter(shop => shop.isOpen);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    setShops(filtered);
  }, [sortBy, onlyVerified, onlyOpen]);

  const handleSearch = (query: string, location: string) => {
    setSearchParams({ search: query, location });
    // TODO: Fetch from API with search params
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
              <div className="mb-4 text-muted-foreground">
                {shops.length} shops found
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <ShopCard key={shop.id} {...shop} />
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
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shops;
