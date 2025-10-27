import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, ChevronDown } from "lucide-react";

interface LocationSelectorProps {
  initialLocation?: string;
  onChange?: (location: string) => void;
  theme?: "light" | "dark";
  locations?: string[];
  showETA?: boolean;
}

const LocationSelector = ({
  initialLocation = "",
  onChange,
  theme = "light",
  locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"],
  showETA = true,
}: LocationSelectorProps) => {
  const [location, setLocation] = useState(initialLocation);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getETAFor = (loc: string) => {
    const base = loc.length % 30;
    return `${15 + base}m`;
  };

  const handleSelect = (loc: string) => {
    setLocation(loc);
    setOpen(false);
    onChange?.(loc);
  };

  const handleInputChange = (value: string) => {
    setLocation(value);
    setOpen(true);
    onChange?.(value);
  };

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      {/* Main container */}
      <div
        className={`flex items-center justify-between gap-2 px-3 py-0 rounded-full border transition-all duration-300 ${
          theme === "light"
            ? "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
        }`}
      >
        {/* Left section */}
        <div className="flex items-center gap-2 flex-1">
          <MapPin
            className={`h-4 w-4 shrink-0 ${
              theme === "light" ? "text-[#2a59d1]" : "text-[#5ec8ff]"
            }`}
          />
          <Input
            placeholder="Enter location"
            value={location}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setOpen(true)} // only opens, doesn't toggle
            className={`bg-transparent border-none focus-visible:ring-0 focus:outline-none text-sm w-full placeholder:text-gray-400 py-0 ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {showETA && location && (
            <span
              className={`text-xs rounded-full px-2 py-0.5 ${
                theme === "light"
                  ? "bg-sky-50 text-sky-700"
                  : "bg-sky-900 text-sky-100"
              }`}
            >
              Pros • {getETAFor(location)}
            </span>
          )}
          {/* Chevron toggles manually */}
          <ChevronDown
            onClick={(e) => {
              e.stopPropagation(); // prevent parent click
              setOpen((prev) => !prev);
            }}
            className={`h-4 w-4 cursor-pointer transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && filteredLocations.length > 0 && (
        <div
          className={`absolute mt-2 w-full rounded-md shadow-lg z-50 border overflow-hidden ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-gray-700 border-gray-600"
          }`}
        >
          {filteredLocations.map((loc, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(loc)}
              className={`px-4 py-2 cursor-pointer flex justify-between items-center text-sm transition-colors duration-200 ${
                theme === "light"
                  ? "hover:bg-gray-100 text-gray-700"
                  : "hover:bg-gray-600 text-gray-200"
              }`}
            >
              <span>{loc}</span>
              {showETA && (
                <span className="text-xs text-slate-400">{getETAFor(loc)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
