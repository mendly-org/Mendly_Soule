import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopsAPI, servicesAPI, shopServicesAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, MapPin, Wrench, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const ServiceShopsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (serviceId) {
      fetchServiceAndShops();
    }
  }, [serviceId]);

  const fetchServiceAndShops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch service details
      const serviceData = await servicesAPI.list();
      const serviceItem = Array.isArray(serviceData) 
        ? serviceData.find(s => s.id.toString() === serviceId)
        : serviceData;
      
      if (!serviceItem) {
        throw new Error('Service not found');
      }
      
      setService(serviceItem);
      
      // Get all shop services that offer this service
      const shopServicesResponse = await shopServicesAPI.list(
        new URLSearchParams({ 
          'service': serviceId,
          'is_available': 'true'  // Only show available services
        })
      );
      
      const shopServices = Array.isArray(shopServicesResponse) 
        ? shopServicesResponse 
        : shopServicesResponse?.results || [];
      
      if (shopServices.length === 0) {
        setShops([]);
        return;
      }
      
      // Get unique shop IDs
      const shopIds = [...new Set(shopServices.map((s: any) => s.shop))];
      
      // Fetch shop details for each shop ID
      const shopsPromises = shopIds.map((shopId: number) => 
        shopsAPI.get(shopId).catch(() => null)
      );
      
      const shopsResults = await Promise.all(shopsPromises);
      const validShops = shopsResults.filter(shop => shop !== null);
      
      // Enrich shop data with the specific service details
      const enrichedShops = validShops.map(shop => {
        const shopService = shopServices.find((s: any) => s.shop === shop.id);
        return {
          ...shop,
          servicePrice: shopService?.price,
          serviceEta: shopService?.eta_minutes,
          onSiteAvailable: shopService?.on_site_available,
          pickDropAvailable: shopService?.pick_drop_available
        };
      });
      
      setShops(enrichedShops);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to load service information');
      toast.error('Failed to load service information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">
            {service?.name || 'Service'}
          </h1>
          <p className="text-muted-foreground">
            {shops.length} {shops.length === 1 ? 'shop' : 'shops'} offering this service
          </p>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No shops found offering this service.</p>
            <Button variant="outline" onClick={() => navigate('/services')}>
              Browse all services
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Card 
                key={shop.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/shops/${shop.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={shop.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{shop.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{shop.city}, {shop.state}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {shop.average_rating > 0 && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.round(shop.average_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({shop.review_count} {shop.review_count === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {shop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceShopsPage;
