import React, { useState, useEffect } from 'react';
// Revert back to using alias paths as defined in tsconfig/vite config
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Settings, ShoppingCart, User, Plus, AlertCircle } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/api/utils'; // Corrected alias
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge'; // Added Badge import

const Dashboard = () => {
  const { user, token, logout, isLoading: isAuthLoading } = useAuth(); // Get user, token, logout, isLoading
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]); // For History tab
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated and auth check is complete
    if (!isAuthLoading && !token) {
      navigate('/auth', { state: { from: '/dashboard' } });
      return; // Stop execution if redirecting
    }

    // Fetch data only if authenticated
    if (token) {
       if (activeTab === 'bookings') {
          fetchUpcomingBookings();
       } else if (activeTab === 'history') {
          fetchPastBookings();
       }
       // Add logic for settings tab if needed
    } else if (!isAuthLoading) { // Only set loading false if auth check is done and no token
        // Handle case where token might disappear unexpectedly or user is simply not logged in
        setIsLoadingBookings(false);
    }
  }, [activeTab, token, isAuthLoading, navigate]);

   const fetchUpcomingBookings = async () => {
     try {
       setIsLoadingBookings(true);
       setError('');
       const bookings = await bookingsAPI.list(new URLSearchParams({ status: 'UPCOMING', ordering: 'booking_time' }));
       setUpcomingBookings(bookings.results || bookings || []);
     } catch (err) {
       setError('Failed to load upcoming bookings.');
       console.error('Error fetching upcoming bookings:', err);
       setUpcomingBookings([]); // Clear data on error
     } finally {
       setIsLoadingBookings(false);
     }
   };

    const fetchPastBookings = async () => {
     try {
       setIsLoadingBookings(true);
       setError('');
       // Fetch COMPLETED and CANCELLED bookings, order descending
       const params = new URLSearchParams({ status__in: 'COMPLETED,CANCELLED', ordering: '-booking_time' });
       const bookings = await bookingsAPI.list(params);
       setPastBookings(bookings.results || bookings || []);
     } catch (err) {
       setError('Failed to load booking history.');
       console.error('Error fetching past bookings:', err);
       setPastBookings([]); // Clear data on error
     } finally {
       setIsLoadingBookings(false);
     }
   };


  const handleLogout = () => {
    logout();
    navigate('/auth'); // Redirect to auth page after logout
  };

  const renderBookingsList = (bookings: any[], listType: 'upcoming' | 'past') => {
     if (isLoadingBookings) {
       return (
         <div className="space-y-4">
           {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-lg bg-muted" />)} {/* Use bg-muted */}
         </div>
       );
     }

     if (error && ((listType === 'upcoming' && activeTab === 'bookings') || (listType === 'past' && activeTab === 'history'))) {
       return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" className="ml-2" onClick={listType === 'upcoming' ? fetchUpcomingBookings : fetchPastBookings}>Retry</Button>
            </AlertDescription>
          </Alert>
       );
     }

     if (bookings.length === 0) {
       return (
         <div className="text-center py-12 border border-dashed rounded-lg bg-card">
           <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
           <p className="text-muted-foreground mb-4">
                {listType === 'upcoming' ? 'No upcoming bookings found.' : 'No past bookings found.'}
           </p>
           {listType === 'upcoming' && (
              <Button onClick={() => navigate('/book')}>
                Book a New Service
              </Button>
           )}
         </div>
       );
     }

     return (
       <div className="space-y-4">
         {bookings.map((booking) => (
           <Card key={booking.id} className="hover:shadow-md transition-shadow bg-card border">
             <CardContent className="p-4 md:p-6">
               <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                 <div className="flex-grow">
                   <h3 className="font-semibold text-lg text-foreground">{booking.shop_service?.service?.name || 'Service Name Unavailable'}</h3>
                   <div className="flex items-center mt-2 text-sm text-muted-foreground">
                     <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                     {formatDate(booking.booking_time, true)} {/* Show time */}
                   </div>
                   <div className="flex items-center mt-1 text-sm text-muted-foreground">
                     <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                     {booking.shop?.name || 'Shop Name Unavailable'} - {booking.shop?.city || 'City Unavailable'}
                   </div>
                    <div className="mt-3">
                      {/* Dynamically set Badge variant based on status */}
                      <Badge
                          variant={
                             booking.status === 'UPCOMING' ? 'default' :
                             booking.status === 'COMPLETED' ? 'secondary' : // Or choose another variant like 'outline'
                             booking.status === 'CANCELLED' ? 'destructive' :
                             'outline' // Default fallback
                          }
                          className="capitalize bg-opacity-80" // Slight transparency
                       >
                         {booking.status?.replace('_', ' ').toLowerCase() || 'Unknown Status'}
                      </Badge>
                    </div>
                 </div>
                 <div className="text-right flex-shrink-0 pt-2 sm:pt-0">
                   <div className="text-xl font-bold text-primary mb-2">{formatCurrency(booking.final_price)}</div>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => navigate(`/bookings/${booking.id}`)}
                   >
                     View Details
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     );
   };


  if (isAuthLoading) {
      // Show full page loading state while checking auth status
       return (
           <div className="min-h-screen flex items-center justify-center bg-background">
               <div className="flex flex-col items-center gap-2">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                   <p className="text-muted-foreground">Loading dashboard...</p>
               </div>
           </div>
       );
   }

  // If auth check is done but still no token (e.g., failed init fetch or logged out)
  // This check prevents rendering the dashboard briefly before redirecting
  if (!token) {
      // Optionally show a "Redirecting..." message or just return null for faster redirect
      return null;
  }


  return (
    <div className="min-h-screen bg-muted/30"> {/* Lighter background */}
      <Navbar /> {/* Use Navbar component */}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Welcome back, {user?.username || 'User'}!</h2>
          <p className="text-muted-foreground mt-1">Manage your bookings and account settings.</p>
        </div>

        <Tabs defaultValue="bookings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg mb-6 bg-card border rounded-lg p-1"> {/* Styled TabsList */}
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={() => navigate('/profile')} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"> {/* Navigate to profile */}
              <User className="h-4 w-4 mr-2" /> {/* Changed Icon */}
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="bg-card border shadow-sm"> {/* Added Card wrapper */}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-semibold text-foreground">Upcoming Appointments</CardTitle>
                 <Button onClick={() => navigate('/book')} size="sm">
                   <Plus className="h-4 w-4 mr-2" />
                   New Booking
                 </Button>
              </CardHeader>
              <CardContent>
                 {renderBookingsList(upcomingBookings, 'upcoming')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
             <Card className="bg-card border shadow-sm"> {/* Added Card wrapper */}
                 <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Booking History</CardTitle>
                     <CardDescription>View your past service appointments.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    {renderBookingsList(pastBookings, 'past')}
                 </CardContent>
             </Card>
          </TabsContent>

          {/* Settings content removed as it navigates to ProfilePage */}
           <TabsContent value="settings">
              {/* This content will not be shown due to navigation */}
               <div className="text-center py-12">
                   <p className="text-muted-foreground">Redirecting to profile...</p>
               </div>
           </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

