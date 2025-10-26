import { bookingsAPI } from '@/lib/api';

interface CreateBookingData {
  shop_service: number;
  booking_time: string;
  service_mode: 'on_site' | 'appointment' | 'pick_drop';
  issue_description?: string;
}

export const createBooking = async (data: CreateBookingData) => {
  try {
    const response = await bookingsAPI.create({
      shop_service: data.shop_service,
      booking_time: data.booking_time,
      service_mode: data.service_mode,
      issue_description: data.issue_description || '',
    });
    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};