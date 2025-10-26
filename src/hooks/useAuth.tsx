import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Correct the relative path from src/hooks/ to src/lib/
import { getAuthToken, setAuthToken as storeAuthToken, removeAuthToken, accountAPI } from '../lib/api/index';
interface AuthContextType {
  user: any | null; // Replace 'any' with your User type
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: any) => Promise<void>; // Accept user data optionally
  logout: () => void;
  setUser: (user: any | null) => void; // Allow manually setting user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(() => getAuthToken()); // Initialize token from storage
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          // Fetch user data if token exists
          const userData = await accountAPI.getMe(); // Use getMe
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user on init, logging out:", error);
          removeAuthToken(); // Token might be invalid
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string, userData?: any) => {
    setIsLoading(true);
    storeAuthToken(newToken); // Store token in localStorage
    setToken(newToken);
    if (userData) {
      setUser(userData); // Use provided user data if available
    } else {
      // Fetch user data if not provided
       try {
          const fetchedUserData = await accountAPI.getMe();
          setUser(fetchedUserData);
        } catch (error) {
           console.error("Failed to fetch user after login:", error);
           // Optionally handle this error, maybe keep user null or show error
           setUser(null); // Or keep old user? Decide based on UX
        }
    }
    setIsLoading(false);
  };

  const logout = () => {
    removeAuthToken(); // Remove token from localStorage
    setToken(null);
    setUser(null);
  };

  // User is authenticated if token exists and loading is finished (user might be null initially)
  const isAuthenticated = !isLoading && !!token;

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

