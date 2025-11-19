
import { Booking, BookingStatus, PaymentStatus, Channel } from "../types";

// Service to handle third-party integrations (Airbnb, Booking.com, etc.)

export const integrationService = {
  /**
   * Syncs bookings from a specific channel.
   * Returns a list of new bookings found.
   */
  syncChannel: async (channelName: string, propertyId: string, propertyName: string, pricePerNight: number): Promise<Booking> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a random mock booking simulating external data
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + Math.floor(Math.random() * 30) + 5); // Future date
    
    const checkOut = new Date(checkIn);
    const stayLen = Math.floor(Math.random() * 7) + 2; // 2 to 9 nights
    checkOut.setDate(checkIn.getDate() + stayLen);

    const checkInStr = checkIn.toISOString().split('T')[0];
    const checkOutStr = checkOut.toISOString().split('T')[0];
    
    const ref = `EXT-${Math.floor(Math.random() * 10000)}`;
    const amount = pricePerNight * stayLen;

    return {
        id: `b-${Date.now()}`,
        reference: ref,
        guestId: 'g_ext', // Placeholder for external guest
        guestName: `Guest from ${channelName}`,
        propertyId: propertyId,
        propertyName: propertyName,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID, // External channels usually handle payment
        totalAmount: amount,
        channel: channelName as Channel
    };
  },

  /**
   * Verifies connection credentials
   */
  verifyConnection: async (channel: string, apiKey: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return apiKey.length > 5; // Mock validation
  }
};
