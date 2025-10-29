// API Configuration
export const API_CONFIG = {
  // Base API URL - defaults to development if not set in environment
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // API Version
  API_VERSION: 'api',
  
  // Full API URL
  get API_BASE_URL() {
    // Ensure there's exactly one slash between base URL and API version
    const base = this.BASE_URL.endsWith('/') 
      ? this.BASE_URL.slice(0, -1) 
      : this.BASE_URL;
    return `${base}/${this.API_VERSION}`;
  },
  
  // Other API endpoints can be added here
  ENDPOINTS: {
    AUTH: '/auth',
    SHOPS: '/shops',
    SERVICES: '/services',
    SHOP_SERVICES: '/shop-services',
    // Add other endpoints as needed
  },
  
  // Environment
  get IS_DEVELOPMENT() {
    return import.meta.env.DEV;
  },
  
  get IS_PRODUCTION() {
    return import.meta.env.PROD;
  },
};

// Export a helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_CONFIG.API_BASE_URL}/${cleanEndpoint}`;
};

// Export default for easier imports
export default {
  ...API_CONFIG,
  getApiUrl,
};
