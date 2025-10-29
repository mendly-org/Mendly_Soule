import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { servicesAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Wrench, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [searchQuery, categoryFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories first
      const categoriesResponse = await servicesAPI.categories();
      const fetchedCategories = categoriesResponse || [];
      setAllCategories(fetchedCategories);

      // Build params for services fetch
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) {
        const matched = fetchedCategories.find((c: any) => c.name?.toLowerCase() === categoryFilter.toLowerCase());
        if (matched?.id) {
          params.append('category', String(matched.id));
        }
      }

      // Fetch services
      const servicesResponse = await servicesAPI.list(params);
      
      // Handle both paginated response and direct array response
      let fetchedServices;
      if (Array.isArray(servicesResponse)) {
        // Direct array response (from search endpoint)
        fetchedServices = servicesResponse;
      } else if (servicesResponse.results) {
        // Paginated response
        fetchedServices = servicesResponse.results;
      } else {
        // Fallback to empty array
        fetchedServices = [];
      }
      
      setServices(fetchedServices);

      // Group services by category
      const groupedCategories = fetchedServices.reduce((acc: any, service: any) => {
        const categoryId = service.category?.id;
        if (!categoryId) return acc;

        if (!acc[categoryId]) {
          acc[categoryId] = {
            ...service.category,
            services: [],
          };
        }
        acc[categoryId].services.push(service);
        return acc;
      }, {});

      setCategories(Object.values(groupedCategories));

    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      setError(err.message || 'Failed to load services');
      toast.error('Failed to load services from server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-accent via-background to-muted py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(var(--primary-gloss))] bg-clip-text text-transparent">
            {categoryFilter ? `${categoryFilter} Services` : 'Our Services'}
            {searchQuery && `: Results for "${searchQuery}"`}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {searchQuery 
              ? `Showing results for "${searchQuery}"${categoryFilter ? ` in ${categoryFilter}` : ''}`
              : categoryFilter 
                ? `Browse all ${categoryFilter.toLowerCase()} repair services`
                : 'Explore the wide range of repair services offered by verified shops on Mendly.'}
          </p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-2xl relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                value={searchQuery}
                onChange={(e) => {
                  const newSearch = e.target.value;
                  const params = new URLSearchParams(searchParams);
                  if (newSearch) {
                    params.set('search', newSearch);
                  } else {
                    params.delete('search');
                  }
                  setSearchParams(params);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    fetchData();
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    setSearchParams(params);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
          
          {/* Category Pills */}
          {allCategories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant={!categoryFilter && !searchQuery ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchQuery) params.set('search', searchQuery);
                  navigate(`/services?${params.toString()}`);
                }}
                className="rounded-full"
              >
                All Categories
              </Button>
              {allCategories.map((cat: any) => (
                <Button
                  key={cat.id}
                  variant={categoryFilter === cat.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('category', cat.name);
                    if (searchQuery) params.set('search', searchQuery);
                    navigate(`/services?${params.toString()}`);
                  }}
                  className="rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {error && (
            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-500">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2].map(cat => (
                <div key={cat}>
                  <Skeleton className="h-8 w-1/4 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 && !error ? (
             <div className="text-center py-12">
               <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
               <p className="text-muted-foreground text-lg mb-4">
                 No services available{categoryFilter ? ` in ${categoryFilter} category` : ''}.
               </p>
               {categoryFilter && (
                 <Button variant="outline" onClick={() => navigate('/services')}>
                   View All Services
                 </Button>
               )}
             </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category: any) => (
                <div key={category.id}>
                  <h2 className="text-2xl font-semibold mb-4 text-foreground border-b pb-2">{category.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service: any) => (
                      <ServiceCard
                        key={service.id}
                        title={service.name}
                        description={service.description || 'Professional repair service'}
                        image={service.image || 'https://placehold.co/100x100/e2e8f0/adb5bd?text=Service'}
                        serviceId={service.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;