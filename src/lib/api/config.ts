export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
  },
  ACCOUNTS: `${API_BASE_URL}/accounts/`,
  SERVICES: `${API_BASE_URL}/services/`,
  SHOPS: {
    BASE: `${API_BASE_URL}/shops/`,
    NEARBY: (lat: number, lng: number, radius: number) => 
      `${API_BASE_URL}/shops/nearby/?lat=${lat}&lng=${lng}&radius_km=${radius}`,
  },
  SHOP_SERVICES: {
    BASE: `${API_BASE_URL}/shop-services/`,
    DISCOVER: `${API_BASE_URL}/shop-services/discover/`,
  },
  BOOKINGS: {
    BASE: `${API_BASE_URL}/bookings/`,
    CANCEL: (id: number) => `${API_BASE_URL}/bookings/${id}/cancel/`,
  },
  BOOKING_ATTACHMENTS: `${API_BASE_URL}/booking-attachments/`,
  REVIEWS: `${API_BASE_URL}/reviews/`,
  OFFERS: `${API_BASE_URL}/offers/`,
  BILLS: `${API_BASE_URL}/bills/`,
};

export const getAuthHeader = (token: string) => ({
  'Authorization': `Token ${token}`,
  'Content-Type': 'application/json',
});

export const getAuthHeaderMultiPart = (token: string) => ({
  'Authorization': `Token ${token}`,
});
