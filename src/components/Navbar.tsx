import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, LogOut, BookOpen } from "lucide-react";
import SearchBar from "../components/SearchBar";
import LocationTab from "../components/Locationtab";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ theme = "light" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (location) params.set("location", location);
    navigate(`/shops?${params.toString()}`);
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border ${
        theme === "light"
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-gray-800 shadow-md border-b border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex items-center font-bold text-3xl">
              <span
                className={
                  theme === "light" ? "text-[#3bb4ff]" : "text-[#5ec8ff]"
                }
              >
                MEND
              </span>
              <span
                className={
                  theme === "light" ? "text-[#4ea4d9]" : "text-[#d0d2db]"
                }
              >
                LY
              </span>
            </span>
          </Link>

          {/* Combined Search + Location */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-3 w-full max-w-3xl">
              <SearchBar
                onSearch={() => handleSearch()}
                initialQuery={query}
              />
              <LocationTab
                initialLocation={location}
                onChange={(val: string) => setLocation(val)}
              />
           
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              How It Works
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              About
            </Link>
            <Link to="/faq" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              FAQ
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Contact
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`p-3 rounded-full shadow-md border transition-all duration-300 ${
                      theme === "light"
                        ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                  >
                    <User
                      className={`h-5 w-5 ${
                        theme === "light" ? "text-gray-800" : "text-white"
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.username || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                        : "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700"
                    }`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      theme === "light"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-[#5ec8ff] text-gray-900 hover:bg-[#3bb4ff]"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-3 rounded-full shadow-md border transition-all duration-300 ${
              theme === "light"
                ? "bg-gray-100 border-gray-300 hover:bg-gray-200"
                : "bg-gray-800 border-gray-700 hover:bg-gray-700"
            }`}
          >
            <Menu
              className={`h-6 w-6 ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden pb-4 ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            <div className="flex flex-col space-y-2 px-4 py-2">
              <Link
                to="/shops"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Shops
              </Link>
              <Link
                to="/services"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/faq"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                      variant="outline"
                      className="flex-1"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                      variant="outline"
                      className="flex-1"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="flex-1">
                      <Button
                        className={`w-full ${
                          theme === "light"
                            ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            : "border border-gray-700 text-gray-200 hover:bg-gray-700"
                        }`}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" className="flex-1">
                      <Button
                        className={`w-full ${
                          theme === "light"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-[#5ec8ff] text-gray-900 hover:bg-[#3bb4ff]"
                        }`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
