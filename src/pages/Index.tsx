import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ServiceCard from "@/components/ServiceCard";
import ShopCard from "@/components/ShopCard";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import mobileRepairIcon from "@/assets/mobile-repair.png";
import acRepairIcon from "@/assets/ac-repair.png";
import laptopRepairIcon from "@/assets/laptop-repair.png";

const Index = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with API calls
  const mockShops = [
    {
      id: 1,
      name: "TechFix Solutions",
      description: "Expert mobile and laptop repairs with 10+ years experience",
      city: "Bangalore",
      state: "Karnataka",
      rating: 4.8,
      isOpen: true,
      isVerified: true,
    },
    {
      id: 2,
      name: "Cool Air Services",
      description: "AC installation, repair, and maintenance specialists",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.6,
      isOpen: true,
      isVerified: true,
    },
    {
      id: 3,
      name: "SmartDevice Clinic",
      description: "Premium electronics repair with same-day service",
      city: "Delhi",
      state: "Delhi",
      rating: 4.9,
      isOpen: false,
      isVerified: true,
    },
  ];

  const services = [
    {
      title: "Mobile Repair",
      image: mobileRepairIcon,
      description: "Screen replacement, battery issues, software problems",
    },
    {
      title: "AC Service",
      image: acRepairIcon,
      description: "Installation, repair, cleaning, and maintenance",
    },
    {
      title: "Laptop Repair",
      image: laptopRepairIcon,
      description: "Hardware upgrades, virus removal, performance tuning",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Shops",
      description: "All shops are verified and background-checked",
    },
    {
      icon: Clock,
      title: "Same-Day Service",
      description: "Get your devices fixed quickly and efficiently",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guaranteed on all repairs",
    },
  ];

  const handleSearch = (query: string, location: string) => {
    navigate(`/shops?search=${query}&location=${location}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-background to-muted">
        <div className="absolute inset-0 opacity-10">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
              Fix Your Devices with Trusted Local Experts
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with verified repair shops near you. Compare prices, read reviews, and book services in minutes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Popular Services */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <span className="text-muted-foreground text-sm">Popular:</span>
            {["Screen Repair", "Battery Replacement", "AC Cleaning", "Laptop Upgrade"].map((service) => (
              <Button
                key={service}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleSearch(service, "")}
              >
                {service}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Popular Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Browse repair services by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                onClick={() => navigate(`/shops?service=${service.title}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">
                Top Rated Shops
              </h2>
              <p className="text-muted-foreground text-lg">
                Trusted by thousands of customers
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/shops")}
              className="hidden md:flex gap-2"
            >
              View All Shops
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockShops.map((shop) => (
              <ShopCard key={shop.id} {...shop} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button 
              variant="outline" 
              onClick={() => navigate("/shops")}
              className="gap-2"
            >
              View All Shops
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Choose Mendly?
            </h2>
            <p className="text-muted-foreground text-lg">
              The most trusted platform for device repairs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] mb-4">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
            Ready to Fix Your Device?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Mendly for their repair needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => navigate("/shops")}
              className="text-lg px-8"
            >
              Browse Shops
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Mendly</h3>
              <p className="text-muted-foreground text-sm">
                Your trusted platform for electronic device repairs
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Mobile Repair</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">AC Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Laptop Repair</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 Mendly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
