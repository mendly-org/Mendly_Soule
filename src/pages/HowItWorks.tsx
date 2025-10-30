import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Wrench, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Search className="w-12 h-12" />,
      title: "Search for Services",
      description: "Browse our wide selection of repair services or use the search bar to find exactly what you need. Filter by location, category, and ratings."
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Book Your Service",
      description: "Choose your preferred service provider, select a convenient date and time, and provide details about your repair needs."
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Get It Fixed",
      description: "Our verified professionals will provide quality service at your location or their shop, depending on your preference."
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "Leave a Review",
      description: "After your service is complete, share your experience to help other customers make informed decisions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Mendly Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your devices and appliances repaired in four simple steps
          </p>
        </section>

        {/* Steps Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4 text-primary mt-4">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">For Customers</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to verified and trusted service providers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Easy booking and tracking of your repairs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Read reviews from other customers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Multiple service options: on-site, pick & drop, or walk-in</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">For Service Providers</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reach more customers in your area</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Manage bookings and schedules easily</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Build your reputation with customer reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Flexible service options to suit your business</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Grow your business with our platform</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of satisfied customers who trust Mendly for their repair needs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/shops')}>
              Find Services
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              Become a Provider
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;
