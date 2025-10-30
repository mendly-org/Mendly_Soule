import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Shops",
      description: "All service providers are verified and trusted professionals"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Technicians",
      description: "Skilled professionals with years of experience"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Service",
      description: "Fast turnaround times for all your repair needs"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "100% satisfaction guarantee on all services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mendly</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted platform for connecting with professional repair services
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                At Mendly, we believe that finding reliable repair services shouldn't be a hassle. 
                Our mission is to connect customers with trusted, verified repair professionals who 
                deliver quality service at fair prices.
              </p>
              <p className="text-lg text-muted-foreground">
                We've built a platform that makes it easy to find, compare, and book repair services 
                for everything from electronics to appliances, all in one convenient place.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Mendly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Find the perfect repair service for your needs today
          </p>
          <Button size="lg" onClick={() => navigate('/shops')}>
            Browse Services
          </Button>
        </section>
      </main>
    </div>
  );
};

export default About;
