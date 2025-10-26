import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { accountAPI } from '@/lib/api'; // Assuming accountAPI exists in api.ts
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, User, Mail, Phone, Edit, Save, X } from 'lucide-react'; // Added Save, X
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/api/utils'; // Import formatDate

const ProfilePage = () => {
  const { user, token, setUser, isLoading: isAuthLoading } = useAuth(); // Destructure isLoading from useAuth
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Separate loading state for profile fetching/updating
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
      username: '',
      email: '',
      phone_number: '',
  });

  useEffect(() => {
    // Redirect only after auth check is complete and user is confirmed not logged in
    if (!isAuthLoading && !token) {
      toast.error("Please log in to view your profile.");
      navigate('/auth', { state: { from: '/profile' } });
      return;
    }
    // Fetch profile if token exists and profileData is not yet loaded
    if (token && !profileData) {
      fetchProfile();
    } else if (!token && !isAuthLoading) {
        // If somehow token disappeared after initial check
         setIsLoading(false);
    } else if (profileData){
        // Already loaded, just ensure loading is false
         setIsLoading(false);
    }
  }, [token, navigate, profileData, isAuthLoading]); // Add profileData and isAuthLoading to dependencies

  const fetchProfile = async () => {
    setIsLoading(true); // Indicate profile fetch is starting
    setError(null);
    try {
      const data = await accountAPI.getMe(); // Use getMe function
      setProfileData(data);
      setEditData({ // Initialize edit form
          username: data.username || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
      })
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false); // Indicate profile fetch is complete
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditData(prev => ({ ...prev, [name]: value }));
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!profileData?.id) return;

      setIsLoading(true); // Use profile loading state for update operation
      try {
          const updatedUser = await accountAPI.update(profileData.id, editData);
          setProfileData(updatedUser);
          setUser(updatedUser); // Update user in auth context
          setIsEditing(false);
          toast.success("Profile updated successfully!");
      } catch (err: any) {
          console.error('Failed to update profile:', err);
           let errorMessage = err.message || 'Failed to update profile.';
             if (err.response?.data) {
                 const data = err.response.data;
                 if (data.username) errorMessage = `Username: ${data.username[0]}`;
                 else if (data.email) errorMessage = `Email: ${data.email[0]}`;
                 else if (data.phone_number) errorMessage = `Phone: ${data.phone_number[0]}`;
             }
          toast.error(errorMessage);
      } finally {
          setIsLoading(false); // Indicate profile update is complete
      }
  }

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
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription>View and update your account details.</CardDescription>
              </div>
              {!isEditing && profileData && ( // Only show edit if not loading and not editing
                 <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} title="Edit Profile">
                    <Edit className="h-4 w-4"/>
                    <span className="sr-only">Edit Profile</span>
                 </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {error && !isLoading && ( // Show error only if not loading
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               {/* Display profile data or edit form */}
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
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;

