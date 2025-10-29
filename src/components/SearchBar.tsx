import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
  theme?: "light" | "dark";
}

const SearchBar = ({
  onSearch,
  initialQuery = "",
  initialLocation = "",
  theme = "light",
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const { servicesAPI } = await import("../lib/api");
        const response = await servicesAPI.categories();
        setCategories(response || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (query.trim() || location.trim()) {
      onSearch?.(query, location);
    }
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (categoryName: string) => {
    setQuery(categoryName);
    setOpen(false);
    onSearch?.(categoryName, location);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 p-2 rounded-full border transition-all duration-300 ${
          theme === "light"
            ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
        }`}
      >
        <FaSearch
          className={`ml-2 ${theme === "light" ? "text-[#2a59d1]" : "text-[#5ec8ff]"}`}
        />

        <input
          type="text"
          aria-label="Search services"
          placeholder="Search services..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`px-3 py-2 flex-1 min-w-0 focus:outline-none text-sm bg-transparent ${
            theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        />

        <div className={`w-px h-6 ${theme === "light" ? "bg-gray-300" : "bg-gray-600"}`} />

        <input
          type="text"
          aria-label="Location"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={`px-3 py-2 w-32 sm:w-40 focus:outline-none text-sm bg-transparent ${
            theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        />

        <button
          onClick={handleSearch}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            theme === "light"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          Search
        </button>
      </div>

      {/* Dropdown Category Suggestions */}
      {open && query && (
        <div
          className={`absolute mt-2 w-full rounded-md shadow-lg z-40 border ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-700 border-gray-600"
          }`}
        >
          {filteredSuggestions.length > 0 ? (
            <div className="flex gap-2 p-3 flex-wrap">
              {filteredSuggestions.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleSelect(category.name)}
                  className={`cursor-pointer text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                      : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center text-sm py-3 ${
                theme === "light" ? "text-gray-500" : "text-gray-300"
              }`}
            >
              No matching categories
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
