import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  image: string;
  description: string;
  onClick?: () => void;
  id?: string | number;
  serviceId?: string | number;
}

const ServiceCard = ({ title, image, description, onClick, serviceId, id }: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (serviceId || id) {
      // Navigate to ServiceShopsPage with the serviceId or id
      navigate(`/services/${serviceId || id}/shops`);
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border border-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="relative mb-4 h-32 flex items-center justify-center bg-gradient-to-br from-accent to-muted rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="h-24 w-24 object-contain transition-transform group-hover:scale-110"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
          Explore Services
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
