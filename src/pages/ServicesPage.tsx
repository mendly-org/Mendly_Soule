import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { servicesAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Wrench } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ServicesPage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesAPI.list();
      const fetchedServices = response.results || response || [];
      setServices(fetchedServices);

      // Group services by category
      const groupedCategories = fetchedServices.reduce((acc, service) => {
        const categoryId = service.category?.id;
        if (!categoryId) return acc; // Skip services without category

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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore the wide range of repair services offered by verified shops on Mendly.
          </p>
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
          ) : categories.length === 0 && !error ? (
             <div className="text-center py-12">
               <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
               <p className="text-muted-foreground text-lg">
                 No services available at the moment.
               </p>
             </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id}>
                  <h2 className="text-2xl font-semibold mb-4 text-foreground border-b pb-2">{category.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service: any) => (
                      <Card
                        key={service.id}
                        className="group cursor-pointer hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
                        onClick={() => navigate(`/shops?service=${encodeURIComponent(service.name)}`)} // Encode service name
                      >
                        <CardHeader>
                          <CardTitle className="group-hover:text-primary transition-colors">{service.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{service.description || 'Find shops offering this service.'}</CardDescription>
                        </CardContent>
                      </Card>
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

