import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShopCardProps {
  id: number;
  name: string;
  description: string;
  city: string;
  state: string;
  rating?: number;
  isOpen?: boolean;
  isVerified?: boolean;
  image?: string;
}

const ShopCard = ({
  id,
  name,
  description,
  city,
  state,
  rating = 4.5,
  isOpen = true,
  isVerified = false,
  image,
}: ShopCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border border-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02]"
      onClick={() => navigate(`/shops/${id}`)}
    >
      <div className="relative h-48 bg-gradient-to-br from-accent to-muted overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-6xl font-bold opacity-10">{name[0]}</div>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          {isVerified && (
            <Badge className="bg-primary text-primary-foreground">Verified</Badge>
          )}
          {isOpen ? (
            <Badge className="bg-green-500 text-white">
              <Clock className="h-3 w-3 mr-1" />
              Open
            </Badge>
          ) : (
            <Badge variant="destructive">Closed</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{city}, {state}</span>
          </div>
          
          <div className="flex items-center gap-1 text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;
