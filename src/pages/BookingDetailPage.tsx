import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { bookingsAPI } from '@/lib/api'; // Assuming bookingsAPI exists in api.ts
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar, Clock, MapPin, Wrench, DollarSign, User, Info, MessageSquare, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { formatCurrency, formatDate } from '@/lib/api/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Import Alert Dialog


const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isLoading: isAuthLoading } = useAuth(); // Destructure isAuthLoading
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
     // Redirect if not authenticated after auth check
    if (!isAuthLoading && !token) {
        toast.error("Please log in to view booking details.");
        navigate('/auth', { state: { from: location.pathname } });
        return;
    }
    // Fetch details if ID and token are present
    if (id && token) {
      fetchBookingDetails(parseInt(id));
    } else if (!id) {
       // Handle missing ID case
      setError("Booking ID is missing.");
      setIsLoading(false);
      navigate('/dashboard'); // Redirect if no ID
    }
     // If no token but auth loading is done, useEffect dependency will handle redirect
     else if (!token && !isAuthLoading) {
        setIsLoading(false); // Stop loading if redirecting
     }
  }, [id, token, navigate, isAuthLoading]); // Add isAuthLoading dependency

  const fetchBookingDetails = async (bookingId: number) => {
    setIsLoading(true); // Indicate booking fetch starting
    setError(null);
    try {
      const data = await bookingsAPI.get(bookingId); // Use get function
      setBooking(data);
    } catch (err: any) {
      console.error('Failed to fetch booking details:', err);
       if ((err as any)?.response?.status === 404) {
          setError(`Booking with ID ${bookingId} not found or you don't have permission to view it.`);
       } else {
          setError(err.message || 'Failed to load booking details');
       }
      toast.error('Failed to load booking details');
    } finally {
      setIsLoading(false); // Indicate booking fetch complete
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !id) return;
    // Confirmation is handled by AlertDialog

    setIsCancelling(true);
    try {
        await bookingsAPI.cancel(parseInt(id), 'Cancelled by user');
        toast.success("Booking cancelled successfully.");
        // Re-fetch details to show updated status
        fetchBookingDetails(parseInt(id));
    } catch (err: any) {
        console.error('Failed to cancel booking:', err);
        toast.error(err.message || 'Failed to cancel booking.');
    } finally {
        setIsCancelling(false);
    }
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
      switch (status?.toLowerCase()) {
          case 'upcoming': return 'default'; // Blue/Primary
          case 'completed': return 'secondary'; // Grey/Muted Green (Adjust color if needed)
          case 'cancelled': return 'destructive'; // Red
          case 'in_progress': return 'outline'; // Bordered
          default: return 'outline';
      }
  }

  // Show main loading state if either auth or booking data is loading
  if (isAuthLoading || (isLoading && !booking && !error)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

   if (error && !isLoading) { // Show error only after loading attempt
     return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <Navbar />
         <Alert variant="destructive" className="max-w-md mx-auto my-10">
           <AlertCircle className="h-4 w-4" />
           <AlertDescription>{error}</AlertDescription>
         </Alert>
          <Button onClick={() => navigate('/dashboard')}>
             <ArrowLeft className="h-4 w-4 mr-2"/> Back to Dashboard
          </Button>
       </div>
     );
   }

  // Already checked error, if no booking after load, it's not found
  if (!booking && !isLoading) {
    return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <Navbar />
         <p className="text-muted-foreground my-10">Booking not found.</p>
         <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2"/> Back to Dashboard
         </Button>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Navbar />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
           <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2"/> Back to Dashboard
           </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Booking Details</h1>
             <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize text-sm px-3 py-1">
                {booking.status?.replace('_', ' ') || 'Unknown'}
             </Badge>
          </div>

          <Card className="shadow-lg border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                 <Wrench className="h-5 w-5 text-primary" />
                 {booking.service?.name || 'Service Details'}
              </CardTitle>
               <CardDescription className="pt-1">
                   Booking ID: {booking.id} | Placed on: {formatDate(booking.created_at)}
               </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Shop Info */}
              <div className="border p-4 rounded-md bg-accent/30">
                 <h3 className="font-semibold mb-3 text-foreground">Shop Information</h3>
                 <div className="flex items-center gap-3 mb-2">
                   <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                   <span className="text-sm font-medium text-foreground">{booking.shop?.name}</span>
                 </div>
                 <div className="flex items-start gap-3 text-sm text-muted-foreground pl-7"> {/* Indent address */}
                    {/* <MapPin className="h-4 w-4 opacity-0 flex-shrink-0" /> Spacer */}
                    <span>{booking.shop?.address}, {booking.shop?.city}, {booking.shop?.state}</span>
                 </div>
                 {/* Link to Shop Detail Page */}
                  <Button variant="link" size="sm" className="pl-7 h-auto p-0 mt-1" onClick={() => navigate(`/shops/${booking.shop?.id}`)}>
                      View Shop Details
                  </Button>
              </div>

               {/* Booking Time */}
               <div className="flex items-center gap-3">
                 <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                 <span className="font-medium text-foreground w-28 flex-shrink-0">Date & Time:</span>
                 <span className="text-muted-foreground">{formatDate(booking.booking_time, true)}</span>
               </div>

                {/* Service Mode */}
               <div className="flex items-center gap-3">
                 <Info className="h-5 w-5 text-primary flex-shrink-0" />
                 <span className="font-medium text-foreground w-28 flex-shrink-0">Service Mode:</span>
                 <span className="text-muted-foreground capitalize">{booking.service_mode?.replace('_', ' ') || 'N/A'}</span>
               </div>

               {/* Issue Description */}
               {booking.issue_description && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                       <span className="font-medium text-foreground block mb-1">Issue Description:</span>
                       <p className="text-muted-foreground text-sm bg-muted p-3 rounded-md border">{booking.issue_description}</p>
                    </div>
                  </div>
               )}

              {/* Price */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground w-28 flex-shrink-0">Total Price:</span>
                <span className="text-muted-foreground font-semibold">{formatCurrency(booking.final_price)}</span>
              </div>

              {/* Actions */}
               {(booking.status?.toLowerCase() === 'upcoming') && (
                 <div className="pt-6 border-t flex justify-end">
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                           <Button
                                variant="destructive"
                                disabled={isCancelling}
                            >
                               {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                            </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                           <AlertDialogDescription>
                             This action cannot be undone. This will permanently cancel your service booking.
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                           <AlertDialogCancel disabled={isCancelling}>Keep Booking</AlertDialogCancel>
                           <AlertDialogAction onClick={handleCancelBooking} disabled={isCancelling}>
                              {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>

                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BookingDetailPage;

