import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  initialQuery?: string;
  theme?: "light" | "dark";
}

const QUICK_SERVICES = [
  "AC Service",
  "Mobile Repair",
  "Laptop Repair",
  "Deep Cleaning",

];

const SearchBar = ({
  onSearch,
  initialQuery = "",
  theme = "light",
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (query.trim()) onSearch?.(query);
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

  const filteredSuggestions = QUICK_SERVICES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (service: string) => {
    setQuery(service);
    setOpen(false);
    onSearch?.(service);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 p-1 rounded-full border transition-all duration-300 ${
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
          className={`px-3 py-1 w-40 sm:w-52 md:w-64 focus:outline-none text-sm bg-transparent ${
            theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        />
      </div>

      {/* Dropdown Suggestion List */}
      {open && (
        <div
          className={`absolute mt-2 w-full rounded-md shadow-lg z-40 ${
            theme === "light" ? "bg-white" : "bg-gray-700"
          }`}
        >
          {filteredSuggestions.length > 0 ? (
            <div className="flex gap-2 p-2 flex-wrap">
              {filteredSuggestions.map((service, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(service)}
                  className={`cursor-pointer text-xs px-3 py-1 rounded-full border transition-colors duration-200 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                      : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  {service}
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center text-sm py-2 ${
                theme === "light" ? "text-gray-500" : "text-gray-300"
              }`}
            >
              No matching services
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
