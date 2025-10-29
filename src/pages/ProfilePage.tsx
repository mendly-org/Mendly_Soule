import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { accountAPI, bookingsAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, User, Mail, Phone, Edit, Save, X, Calendar, Clock, MapPin, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '@/lib/api/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfilePage = () => {
  const { user, token, setUser, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    if (!isAuthLoading && !token) {
      toast.error("Please log in to view your profile.");
      navigate('/auth', { state: { from: '/profile' } });
      return;
    }
    
    if (token) {
      fetchProfile();
      fetchBookings();
    }
  }, [token, isAuthLoading]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await accountAPI.getProfile();
      setProfileData(response);
      setEditData({
        username: response.username || '',
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        email: response.email || '',
        phone_number: response.phone_number || ''
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const response = await bookingsAPI.list();
      setBookings(Array.isArray(response) ? response : response.results || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await accountAPI.updateProfile(editData);
      setProfileData(response);
      setUser(user ? { ...user, ...response } : response);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-purple-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

   // Show loading state while checking auth OR fetching profile
   if (isAuthLoading || (isLoading && !profileData && !error)) {
       return (
         <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
           <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-2xl">
               <Card>
                 <CardHeader>
                    <Skeleton className="h-8 w-1/3 mb-2"/>
                    <Skeleton className="h-4 w-1/2"/>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-6 w-1/2" />
                   <Skeleton className="h-6 w-2/3" />
                 </CardContent>
               </Card>
            </div>
         </div>
       );
   }


  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Navbar />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-lg border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                  <div>
                    <CardTitle className="text-2xl">Your Profile</CardTitle>
                    <CardDescription>View and update your account details.</CardDescription>
                  </div>
                  {!isEditing && profileData && (
                     <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} title="Edit Profile">
                        <Edit className="h-4 w-4"/>
                        <span className="sr-only">Edit Profile</span>
                     </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  {error && !isLoading && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {profileData && !isEditing ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground w-20 flex-shrink-0">Username:</span>
                        <span className="text-muted-foreground break-all">{profileData.username}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground w-20 flex-shrink-0">Email:</span>
                        <span className="text-muted-foreground break-all">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground w-20 flex-shrink-0">Phone:</span>
                        <span className="text-muted-foreground">{profileData.phone_number || 'Not provided'}</span>
                      </div>
                       <div className="text-xs text-muted-foreground pt-4 border-t mt-5">
                          Joined: {formatDate(profileData.date_joined) || 'N/A'}
                        </div>
                    </div>
                  ) : profileData && isEditing ? (
                     <form onSubmit={handleUpdateProfile} className="space-y-4">
                         <div>
                             <Label htmlFor="username">Username</Label>
                             <Input
                                 id="username"
                                 name="username"
                                 value={editData.username}
                                 onChange={handleInputChange}
                                 required
                                 disabled={isLoading}
                                 className="mt-1"
                             />
                         </div>
                         <div>
                             <Label htmlFor="email">Email</Label>
                             <Input
                                 id="email"
                                 name="email"
                                 type="email"
                                 value={editData.email}
                                 onChange={handleInputChange}
                                 required
                                 disabled={isLoading}
                                 className="mt-1"
                             />
                         </div>
                         <div>
                             <Label htmlFor="phone_number">Phone Number</Label>
                             <Input
                                 id="phone_number"
                                 name="phone_number"
                                 type="tel"
                                 value={editData.phone_number}
                                 onChange={handleInputChange}
                                 placeholder="+919876543210"
                                  disabled={isLoading}
                                 className="mt-1"
                             />
                         </div>
                         <div className="flex justify-end gap-2 pt-4">
                              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                 <X className="h-4 w-4 mr-2"/> Cancel
                              </Button>
                              <Button type="submit" disabled={isLoading}>
                                  {isLoading ? 'Saving...' : <><Save className="h-4 w-4 mr-2"/> Save Changes</>}
                              </Button>
                         </div>
                     </form>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="shadow-lg border-border">
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>View and manage your service appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBookings ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No bookings yet</h3>
                      <p className="text-muted-foreground mt-2">Your upcoming and past service appointments will appear here.</p>
                      <Button className="mt-4" onClick={() => navigate('/shops')}>
                        Book a Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{booking.service?.name || 'Service'}</h3>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(booking.booking_date)}
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {booking.start_time} - {booking.end_time}
                                  </p>
                                  {booking.shop && (
                                    <p className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {booking.shop.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => navigate(`/bookings/${booking.id}`)}
                                >
                                  View Details
                                </Button>
                                {booking.status?.toLowerCase() === 'confirmed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={async () => {
                                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                                        try {
                                          await bookingsAPI.cancel(booking.id, 'Cancelled by user');
                                          toast.success('Booking cancelled successfully');
                                          fetchBookings();
                                        } catch (error) {
                                          console.error('Error cancelling booking:', error);
                                          toast.error('Failed to cancel booking');
                                        }
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

