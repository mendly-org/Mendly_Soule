import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { authAPI } from "@/lib/api"; // Keep authAPI for login/signup
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone_number: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number (e.g., +919876543210)"),
});

const Auth = ({ theme = "light" }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location state
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get login function and auth state
  const [isSubmitting, setIsSubmitting] = useState(false); // Local submitting state

  // Where to redirect after successful login/signup
  const from = location.state?.from || "/"; // Default to home page

   // Redirect if already authenticated
   useEffect(() => {
     if (isAuthenticated) {
       navigate(from, { replace: true });
     }
   }, [isAuthenticated, navigate, from]);

  // Login form
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      loginSchema.parse(loginData);
      const response = await authAPI.login(loginData);
      if (response && response.token) {
        await login(response.token, response.user);
        toast.success("Welcome back!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.non_field_errors?.[0] || 
                           error.message || 
                           "Login failed. Please check your credentials.";
        toast.error(errorMessage);
        console.error("Login Error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      signupSchema.parse(signupData);
      const response = await authAPI.signup({
        ...signupData,
        role: "user",
      });
      
      if (response && response.token) {
        await login(response.token, response.user);
        toast.success("Account created successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        let errorMessage = "Signup failed. Please try again.";
        if (error.response?.data) {
          const data = error.response.data;
          if (data.username) errorMessage = `Username: ${data.username[0]}`;
          else if (data.email) errorMessage = `Email: ${data.email[0]}`;
          else if (data.phone_number) errorMessage = `Phone: ${data.phone_number[0]}`;
          else if (data.detail) errorMessage = data.detail;
        }
        toast.error(errorMessage);
        console.error("Signup Error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

   // Show loading or nothing if auth check is in progress and user is potentially authenticated
   if (isAuthLoading && !isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>; // Or a spinner
   }
   // If authenticated after loading, useEffect will redirect

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
         
         <span className="flex items-center font-bold text-3xl">
              <span
                className={
                  theme === "light" ? "text-[#3bb4ff]" : "text-[#5ec8ff]"
                }
              >
                MEND
              </span>
              <span
                className={
                  theme === "light" ? "text-[#4ea4d9]" : "text-[#d0d2db]"
                }
              >
                LY
              </span>
            </span>
        </div>

        <Card className="shadow-[var(--shadow-card-hover)] border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                       disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={signupData.username}
                      onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+919876543210"
                      value={signupData.phone_number}
                      onChange={(e) => setSignupData({ ...signupData, phone_number: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password (min 6 chars)"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                       disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="link" // Changed to link for less emphasis
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
