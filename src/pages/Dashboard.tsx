import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Settings, ShoppingCart, User } from 'lucide-react';
import { getBookings } from '@/services/bookingService';
import { formatDate } from '@/lib/api/utils';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (activeTab === 'bookings') {
        try {
          setIsLoading(true);
          const bookings = await getBookings({ status: 'UPCOMING', ordering: 'booking_time' });
          setUpcomingBookings(bookings);
          setError('');
        } catch (err) {
          setError('Failed to load bookings. Please try again.');
          console.error('Error fetching bookings:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderBookings = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading bookings...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          {error}
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      );
    }

    if (upcomingBookings.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming bookings found.</p>
          <Button className="mt-4" onClick={() => navigate('/book')}>
            Book a Service
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {upcomingBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{booking.service.name}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(booking.booking_time)}
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {booking.shop.name}
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${booking.final_price}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mendly</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h2>
          <p className="text-gray-500">Here's what's happening with your bookings</p>
        </div>

        <Tabs defaultValue="bookings" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="bookings">
              <ShoppingCart className="h-4 w-4 mr-2" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Upcoming Appointments</h3>
              <Button onClick={() => navigate('/book')}>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
            {renderBookings()}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>View your past service appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No past bookings found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Settings content goes here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
