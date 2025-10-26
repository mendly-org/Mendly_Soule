import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import API_BASE_URL directly from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';


interface ShopCardProps {
  id: number;
  name: string;
  description: string;
  city: string;
  state: string;
  rating?: number | string; // Allow string for API flexibility
  isOpen?: boolean;
  isVerified?: boolean;
  cover_image?: string | null; // Expecting cover_image field from API
}

// Function to construct the full image URL
const getFullImageUrl = (relativePath?: string | null): string | null => {
  if (!relativePath) return null;
  // Check if it's already an absolute URL
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Remove '/api' suffix if present in base URL and ensure no double slash
  const baseUrlClean = API_BASE_URL.replace(/\/api\/?$/, '');
  const imagePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${baseUrlClean}${imagePath}`;
};


const ShopCard = ({
  id,
  name,
  description,
  city,
  state,
  rating = 0, // Default to 0
  isOpen = true,
  isVerified = false,
  cover_image,
}: ShopCardProps) => {
  const navigate = useNavigate();
  const fullImageUrl = getFullImageUrl(cover_image);

  // Parse rating safely
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  const displayRating = isNaN(numericRating) ? 'N/A' : numericRating.toFixed(1);

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02]"
      onClick={() => navigate(`/shops/${id}`)}
    >
      <div className="relative h-48 bg-gradient-to-br from-accent to-muted overflow-hidden">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            // Simple placeholder fallback using text
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop if fallback fails
              // Replace with a placeholder or hide image
              target.style.display = 'none'; // Hide broken image icon
              // Optional: Add a placeholder element dynamically if needed
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder && placeholder.classList.contains('image-placeholder')) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        ) : (
          // Always render placeholder initially for SSR/CSR consistency if no image
          <div className="image-placeholder w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
            <div className="text-6xl font-bold opacity-10">{name ? name[0] : '?'}</div>
          </div>
        )}
         {/* Fallback placeholder div (controlled by onError) */}
         {fullImageUrl && (
            <div className="image-placeholder hidden absolute inset-0 w-full h-full items-center justify-center text-muted-foreground bg-muted">
              <div className="text-6xl font-bold opacity-10">{name ? name[0] : '?'}</div>
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
          {description || "No description available."}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{city}, {state}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-medium">
             {displayRating !== 'N/A' && <Star className="h-4 w-4 fill-current" />}
            <span>{displayRating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;

