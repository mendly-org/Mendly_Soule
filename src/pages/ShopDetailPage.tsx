import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { shopsAPI, reviewsAPI, shopServicesAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, MapPin, Star, Clock, Phone, Mail, Wrench, MessageSquare, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { formatCurrency, formatDate } from '@/lib/api/utils';
import { API_BASE_URL } from '@/lib/api/config'; // Import base URL

// Function to construct the full image URL
const getFullImageUrl = (relativePath?: string | null): string | null => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const baseUrlClean = API_BASE_URL.replace(/\/api\/?$/, '');
  const imagePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${baseUrlClean}${imagePath}`;
};

const ShopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchShopDetails(parseInt(id));
    } else {
      setError("Shop ID is missing.");
      setIsLoading(false);
      navigate('/shops'); // Redirect if no ID
    }
  }, [id, navigate]);

  const fetchShopDetails = async (shopId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const [shopData, reviewsData, servicesData] = await Promise.all([
        shopsAPI.get(shopId),
        reviewsAPI.list(new URLSearchParams({ shop: shopId.toString() })),
        shopServicesAPI.list(new URLSearchParams({ shop: shopId.toString(), is_available: 'true' }))
      ]);

      setShop(shopData);
      setReviews(reviewsData.results || reviewsData || []);
      setServices(servicesData.results || servicesData || []);

    } catch (err: any) {
      console.error('Failed to fetch shop details:', err);
       if ((err as any)?.response?.status === 404) {
           setError(`Shop with ID ${shopId} not found.`);
       } else {
           setError(err.message || 'Failed to load shop details');
       }
      toast.error('Failed to load shop details');
    } finally {
      setIsLoading(false);
    }
  };

  const fullImageUrl = getFullImageUrl(shop?.cover_image);
  const numericRating = typeof shop?.average_rating === 'string' ? parseFloat(shop?.average_rating) : shop?.average_rating;
  const displayRating = isNaN(numericRating) ? null : numericRating.toFixed(1);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-6 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <Card>
                 <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                 <CardContent>
                   <Skeleton className="h-4 w-full mb-2" />
                   <Skeleton className="h-4 w-5/6" />
                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <Skeleton className="h-6 w-full" />
                       <Skeleton className="h-6 w-full" />
                       <Skeleton className="h-6 w-full sm:col-span-2" />
                   </div>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                 <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                 <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                 </CardContent>
               </Card>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

   if (error) {
     return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <Navbar />
         <Alert variant="destructive" className="max-w-md mx-auto my-10">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
          <Button onClick={() => navigate('/shops')}>Back to Shops</Button>
       </div>
     );
   }

  // Already checked for error, so if !shop, it means not found after loading
  if (!shop) {
    return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <Navbar />
         <p className="text-muted-foreground my-10">Shop not found.</p>
         <Button onClick={() => navigate('/shops')}>Back to Shops</Button>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Navbar />

      {/* Shop Header */}
      <section className="relative h-64 md:h-80 bg-muted overflow-hidden border-b">
        {fullImageUrl ? (
          <img src={fullImageUrl} alt={shop.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/10 text-8xl font-bold">
            {shop.name ? shop.name[0] : '?'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6 container mx-auto px-4 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{shop.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{shop.city}, {shop.state}</span>
            </div>
             {displayRating !== null && (
               <div className="flex items-center gap-1">
                 <Star className="h-4 w-4 fill-current text-amber-400 flex-shrink-0" />
                 <span>{displayRating} ({reviews.length} reviews)</span>
               </div>
             )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{shop.is_open ? 'Open Now' : 'Closed'}</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {shop.is_verified && <Badge className="bg-primary text-primary-foreground"><CheckCircle className="h-3 w-3 mr-1"/> Verified</Badge>}
            {/* Add more badges if needed */}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Details & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {shop.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{shop.description || 'No description provided.'}</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                   {shop.phone_number && (
                     <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                       <a href={`tel:${shop.phone_number}`} className="text-foreground hover:text-primary transition-colors">{shop.phone_number}</a>
                     </div>
                   )}
                   {shop.email && (
                     <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                       <a href={`mailto:${shop.email}`} className="text-foreground hover:text-primary transition-colors">{shop.email}</a>
                     </div>
                   )}
                   {shop.address && (
                     <div className="flex items-start gap-2 sm:col-span-2">
                       <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                       <span className="text-foreground">{shop.address}</span>
                     </div>
                   )}
                   {/* TODO: Add Opening Hours if available in API */}
                 </div>
              </CardContent>
            </Card>

            {/* Services Offered */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(service => (
                      <Card
                        key={service.id}
                        className="p-4 flex flex-col sm:flex-row justify-between items-start hover:bg-accent/50 transition-colors border rounded-lg"
                      >
                        <div className="flex-grow mb-2 sm:mb-0 sm:mr-4">
                           <h4 className="font-medium text-foreground">{service.service.name}</h4>
                           <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.service.description || 'Expert service available.'}</p>
                            <div className="text-xs text-muted-foreground mt-2">
                                Estimate: ~{service.eta_minutes} mins
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 w-full sm:w-auto">
                           <div className="font-semibold text-primary mb-1">{formatCurrency(service.price)}</div>
                           <Button
                             variant="outline"
                             size="sm"
                             className="w-full sm:w-auto"
                             onClick={() => navigate(`/book?shopId=${id}&serviceId=${service.id}`)} // Pass both IDs
                           >
                              Book
                           </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">This shop hasn't listed specific services yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{review.user?.username || 'Anonymous'}</span>
                          <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                             ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-1">{review.comment}</p>
                        <p className="text-xs text-muted-foreground/70">{formatDate(review.created_at)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No reviews yet for this shop.</p>
                )}
                 {/* TODO: Add a "Write Review" button if user is logged in and has used the shop */}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Book Appointment/Map */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                 <CardTitle>Book a Service</CardTitle>
                 <CardDescription>Select a service from the list and book instantly.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Button className="w-full" variant="hero" onClick={() => navigate(`/book?shopId=${id}`)}>
                    Browse & Book Services
                 </Button>
              </CardContent>
            </Card>
            {/* Map Placeholder */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Location</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="h-64 bg-muted rounded-b-lg flex items-center justify-center text-muted-foreground border-t">
                   {/* Basic Map Placeholder - Replace with actual map component if needed */}
                   <iframe
                     width="100%"
                     height="100%"
                     style={{ border: 0 }}
                     loading="lazy"
                     allowFullScreen
                     src={`https://www.google.com/maps?q=${encodeURIComponent(shop.address || `${shop.city}, ${shop.state}`)}&output=embed`}
                   ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ShopDetailPage;

