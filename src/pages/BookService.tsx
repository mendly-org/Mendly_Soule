import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Clock, Calendar, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { discoverShopServices, getShops } from '@/services/shopService';
import { createBooking } from '@/services/bookingService';
import { formatCurrency } from '@/lib/api/utils';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

type ServiceMode = 'on_site' | 'appointment' | 'pick_drop';

const BookService = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedMode, setSelectedMode] = useState<ServiceMode | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Data states
  const [services, setServices] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState({
    issue_description: '',
    service_mode: 'appointment' as ServiceMode,
    booking_time: '',
  });

  // Fetch services and shops on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [servicesData, shopsData] = await Promise.all([
          discoverShopServices({ is_available: true }),
          getShops({ is_verified: true })
        ]);
        setServices(servicesData);
        setShops(shopsData);
        setError('');
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle service selection
  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setBookingDetails(prev => ({
      ...prev,
      service_mode: service.on_site_available ? 'on_site' : 
                   service.pick_drop_available ? 'pick_drop' : 'appointment'
    }));
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/book' } });
      return;
    }

    if (!selectedService || !bookingDetails.booking_time) {
      setError('Please select a service and time slot');
      return;
    }

    try {
      await createBooking({
        shop_service: selectedService.id,
        booking_time: bookingDetails.booking_time,
        service_mode: bookingDetails.service_mode,
        issue_description: bookingDetails.issue_description,
      });
      
      // Redirect to bookings page on success
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to book service. Please try again.');
      console.error('Booking error:', err);
    }
  };

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    if (!selectedDate) return [];
    
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18;  // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    
    return slots;
  };

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.shop.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           service.service.category.id.toString() === selectedCategory;
    
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    const matchesMode = !selectedMode || 
                       (selectedMode === 'on_site' && service.on_site_available) ||
                       (selectedMode === 'pick_drop' && service.pick_drop_available);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesMode;
  });

  // Get unique categories for filter
  const categories = [...new Set(
    services.map(service => service.service.category)
  )];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Book a Service</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for services or shops..."
              className="pl-10 w-full max-w-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="flex items-center gap-4">
                    <span>${priceRange[0]}</span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Mode</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedMode === 'on_site' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMode('on_site')}
                    >
                      On-Site
                    </Button>
                    <Button
                      variant={selectedMode === 'pick_drop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMode('pick_drop')}
                    >
                      Pick & Drop
                    </Button>
                    <Button
                      variant={selectedMode === 'appointment' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMode('appointment')}
                    >
                      Appointment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMode(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="text-center py-12">Loading services...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                {error}
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No services found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 1000]);
                  setSelectedMode(null);
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredServices.map((service) => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedService?.id === service.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{service.service.name}</h3>
                        <p className="text-sm text-gray-500">{service.shop.name}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {service.shop.city}, {service.shop.state}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.eta_minutes} min • {service.on_site_available ? 'On-site' : 'Shop only'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(service.price)}</div>
                        {selectedService?.id === service.id && (
                          <div className="text-green-500 text-sm flex items-center justify-end mt-1">
                            <Check className="h-4 w-4 mr-1" /> Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Booking Panel */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>
                  {selectedService 
                    ? `Book ${selectedService.service.name} at ${selectedService.shop.name}`
                    : 'Select a service to continue'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {selectedService ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Mode
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={bookingDetails.service_mode}
                        onChange={(e) => setBookingDetails({
                          ...bookingDetails,
                          service_mode: e.target.value as ServiceMode
                        })}
                      >
                        {selectedService.on_site_available && (
                          <option value="on_site">On-Site Service</option>
                        )}
                        {selectedService.pick_drop_available && (
                          <option value="pick_drop">Pick & Drop</option>
                        )}
                        <option value="appointment">In-Store Appointment</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((days) => {
                          const date = addDays(new Date(), days);
                          const isSelected = selectedDate && 
                            selectedDate.toDateString() === date.toDateString();
                          
                          return (
                            <Button
                              key={days}
                              variant={isSelected ? 'default' : 'outline'}
                              className="flex-col h-auto py-2"
                              onClick={() => setSelectedDate(date)}
                            >
                              <span className="text-xs">
                                {isToday(date) ? 'TODAY' : isTomorrow(date) ? 'TOMORROW' : format(date, 'EEE')}
                              </span>
                              <span className="text-lg font-semibold">{format(date, 'd')}</span>
                              <span className="text-xs">{format(date, 'MMM')}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Time Slot
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {generateTimeSlots().map((slot, index) => (
                            <Button
                              key={index}
                              variant={
                                bookingDetails.booking_time === `${selectedDate.toISOString().split('T')[0]}T${slot.split(' - ')[0]}:00` 
                                  ? 'default' 
                                  : 'outline'
                              }
                              className="text-sm"
                              onClick={() => {
                                const [startTime] = slot.split(' - ');
                                const [hours, minutes] = startTime.split(':').map(Number);
                                const dateTime = new Date(selectedDate);
                                dateTime.setHours(hours, minutes, 0, 0);
                                
                                setBookingDetails({
                                  ...bookingDetails,
                                  booking_time: dateTime.toISOString()
                                });
                              }}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Description (Optional)
                      </label>
                      <textarea
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe the issue you're facing..."
                        value={bookingDetails.issue_description}
                        onChange={(e) => setBookingDetails({
                          ...bookingDetails,
                          issue_description: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between mb-2">
                        <span>Service Fee:</span>
                        <span className="font-medium">{formatCurrency(selectedService.price)}</span>
                      </div>
                      {bookingDetails.service_mode === 'pick_drop' && (
                        <div className="flex justify-between mb-2 text-sm text-gray-600">
                          <span>Pickup & Drop-off:</span>
                          <span>+{formatCurrency(10.00)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          {formatCurrency(
                            bookingDetails.service_mode === 'pick_drop'
                              ? selectedService.price + 10
                              : selectedService.price
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Select a service to book an appointment</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedService || !bookingDetails.booking_time}
                  onClick={handleBookNow}
                >
                  {isAuthenticated ? 'Book Now' : 'Sign in to Book'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookService;
