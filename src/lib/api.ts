import { API_CONFIG, getApiUrl } from '@/config/config';

// Token management
export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');

// API client with auth headers
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  // Use getApiUrl to construct the full URL
  const url = endpoint.startsWith('http') 
    ? endpoint // Use full URL if provided
    : getApiUrl(endpoint); // Otherwise, use our config

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Helper to create API endpoints
const createEndpoint = (basePath: string) => ({
  list: (params?: URLSearchParams) => 
    apiClient(`${basePath}${params ? `?${params.toString()}` : ''}`),
  get: (id: number | string) => 
    apiClient(`${basePath}${id}/`),
  create: (data: any) => 
    apiClient(basePath, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: any) => 
    apiClient(`${basePath}${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number | string) => 
    apiClient(`${basePath}${id}/`, { method: 'DELETE' }),
});

// Auth API
export const authAPI = {
  signup: (data: { username: string; email: string; password: string; phone_number: string; role?: string }) =>
    apiClient('/auth/signup/', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { username: string; password: string }) =>
    apiClient('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
};

// Shops API
export const shopsAPI = {
  ...createEndpoint('/shops/'),
  
  // Shop-specific endpoints
  services: (shopId: number) => ({
    ...createEndpoint(`/shops/${shopId}/services/`)
  }),
};

// Services API
export const servicesAPI = {
  ...createEndpoint('/services/'),
  
  categories: () =>
    apiClient('/services/categories/'),
};

// Categories API (alias for easier access)
export const categoriesAPI = {
  list: () => servicesAPI.categories(),
};

// Shop Services API
export const shopServicesAPI = {
  ...createEndpoint('/shop-services/'),
  
  discover: (params?: URLSearchParams) =>
    apiClient(`/shop-services/discover/${params ? `?${params.toString()}` : ''}`),
};

// Bookings API
export const bookingsAPI = {
  ...createEndpoint('/bookings/'),
  
  cancel: (id: number, reason: string) =>
    apiClient(`/bookings/${id}/cancel/`, { 
      method: 'POST', 
      body: JSON.stringify({ reason }) 
    }),
};

// Reviews API
export const reviewsAPI = {
  ...createEndpoint('/reviews/'),
};

// Offers API
export const offersAPI = {
  ...createEndpoint('/offers/'),
};

// Account API
export const accountAPI = {
  // Legacy endpoints (if present on backend)
  getMe: () => apiClient('/accounts/me/'),
  
  update: (id: number, data: any) =>
    apiClient(`/accounts/${id}/`, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),

  // New profile endpoints (backed by accounts.urls -> /api/profile/)
  getProfile: () => apiClient('/profile/'),
  
  updateProfile: (data: any) =>
    apiClient('/profile/', { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
};
