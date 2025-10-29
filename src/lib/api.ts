// API configuration for Mendly backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signup: (data: { username: string; email: string; password: string; phone_number: string; role?: string }) =>
    apiClient('/auth/signup/', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { username: string; password: string }) =>
    apiClient('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
};

// Shops API
export const shopsAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/shops/${params ? `?${params.toString()}` : ''}`),
  
  get: (id: number) =>
    apiClient(`/shops/${id}/`),
  
  nearby: (lat: number, lng: number, radius_km: number = 5) =>
    apiClient(`/shops/nearby/?lat=${lat}&lng=${lng}&radius_km=${radius_km}`),
};

// Services API
export const servicesAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/services/${params ? `?${params.toString()}` : ''}`),
  
  categories: () =>
    apiClient('/services/categories/'),
};

// Categories API (alias for easier access)
export const categoriesAPI = {
  list: () => apiClient('/services/categories/'),
};

// Shop Services API
export const shopServicesAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/shop-services/${params ? `?${params.toString()}` : ''}`),
  
  discover: (params?: URLSearchParams) =>
    apiClient(`/shop-services/discover/${params ? `?${params.toString()}` : ''}`),
};

// Bookings API
export const bookingsAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/bookings/${params ? `?${params.toString()}` : ''}`),
  
  get: (id: number) =>
    apiClient(`/bookings/${id}/`),
  
  create: (data: any) =>
    apiClient('/bookings/', { method: 'POST', body: JSON.stringify(data) }),
  
  cancel: (id: number, reason: string) =>
    apiClient(`/bookings/${id}/cancel/`, { method: 'POST', body: JSON.stringify({ reason }) }),
};

// Reviews API
export const reviewsAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/reviews/${params ? `?${params.toString()}` : ''}`),
  
  create: (data: { booking: number; rating: number; comment: string }) =>
    apiClient('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
};

// Offers API
export const offersAPI = {
  list: (params?: URLSearchParams) =>
    apiClient(`/offers/${params ? `?${params.toString()}` : ''}`),
};

// Account API
export const accountAPI = {
  // Legacy endpoints (if present on backend)
  getMe: () => apiClient('/auth/me/'),
  update: (id: number, data: any) =>
    apiClient(`/auth/users/${id}/`, {
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
