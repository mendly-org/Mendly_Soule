import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { servicesAPI } from "../lib/api";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

interface PopularCategoriesProps {
  onCategoryClick: (categoryName: string) => void;
}

const PopularCategories = ({ onCategoryClick }: PopularCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await servicesAPI.categories();
        setCategories(response || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading || categories.length === 0) return null;

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-3">
      <span className="text-muted-foreground text-sm">Popular:</span>
      {categories.slice(0, 4).map((category) => (
        <Button
          key={category.id}
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => onCategoryClick(category.name)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default PopularCategories;
