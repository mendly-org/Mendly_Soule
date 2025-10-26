import { shopServicesAPI, shopsAPI } from '@/lib/api';

export interface ShopServiceParams {
  is_available?: boolean;
  shop_id?: string;
  [key: string]: any;
}

export interface ShopParams {
  is_verified?: boolean;
  [key: string]: any;
}

export const discoverShopServices = async (params?: ShopServiceParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    return await shopServicesAPI.discover(searchParams);
  } catch (error) {
    console.error('Error discovering shop services:', error);
    throw error;
  }
};

export const getShops = async (params?: ShopParams) => {
  try {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    return await shopsAPI.list(searchParams);
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};