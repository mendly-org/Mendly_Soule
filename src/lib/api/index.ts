import { API_ENDPOINTS, } from './config';
import { API_BASE_URL } from './config';
export { API_ENDPOINTS } from './config';
export { API_BASE_URL } from './config';

// Token management
export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');

// API client with auth headers
export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Token ${token}`;

  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const detail = (data && (data.detail || data.message)) || res.statusText || 'Request failed';
    throw Object.assign(new Error(detail), { response: { status: res.status, data } });
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: (data: { username: string; email: string; password: string; phone_number: string; role?: string }) =>
    apiClient('/auth/signup/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    apiClient('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
};

// Account API
export const accountAPI = {
  getMe: () => apiClient('/accounts/me/'),
  update: (id: number, data: any) => apiClient(`/accounts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Shops API
export const shopsAPI = {
  list: (params?: URLSearchParams) => apiClient(`/shops/${params ? `?${params.toString()}` : ''}`),
  get: (id: number) => apiClient(`/shops/${id}/`),
  nearby: (lat: number, lng: number, radius_km: number = 5) =>
    apiClient(`/shops/nearby/?lat=${lat}&lng=${lng}&radius_km=${radius_km}`),
};

// Services API
export const servicesAPI = {
  list: (params?: URLSearchParams) => apiClient(`/services/${params ? `?${params.toString()}` : ''}`),
};

// Categories API
export const categoriesAPI = {
  list: () => apiClient('/services/categories/'),
};

// Shop Services API
export const shopServicesAPI = {
  list: (params?: URLSearchParams) => apiClient(`/shop-services/${params ? `?${params.toString()}` : ''}`),
  discover: (params?: URLSearchParams) => apiClient(`/shop-services/discover/${params ? `?${params.toString()}` : ''}`),
};

// Bookings API
export const bookingsAPI = {
  list: (params?: URLSearchParams) => apiClient(`/bookings/${params ? `?${params.toString()}` : ''}`),
  get: (id: number) => apiClient(`/bookings/${id}/`),
  create: (data: any) => apiClient('/bookings/', { method: 'POST', body: JSON.stringify(data) }),
  cancel: (id: number, reason: string) => apiClient(`/bookings/${id}/cancel/`, { method: 'POST', body: JSON.stringify({ reason }) }),
};

// Reviews API
export const reviewsAPI = {
  list: (params?: URLSearchParams) => apiClient(`/reviews/${params ? `?${params.toString()}` : ''}`),
  create: (data: { booking: number; rating: number; comment: string }) =>
    apiClient('/reviews/', { method: 'POST', body: JSON.stringify(data) }),
};

// Offers API
export const offersAPI = {
  list: (params?: URLSearchParams) => apiClient(`/offers/${params ? `?${params.toString()}` : ''}`),
};
