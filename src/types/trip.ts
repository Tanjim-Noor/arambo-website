// Trip types matching backend model exactly
export type ProductType = 'Perishable Goods' | 'Non-Perishable Goods' | 'Fragile' | 'Other';
export type TimeSlot = 'Morning (8AM - 12PM)' | 'Afternoon (12PM - 4PM)' | 'Evening (4PM - 8PM)';

export interface Trip {
  id: string;
  name: string;
  phone: string;                    // Backend uses 'phone', not 'phoneNumber'
  email: string;
  productType: ProductType;
  pickupLocation: string;
  dropOffLocation: string;          // Backend uses 'dropOffLocation', not 'dropoffLocation'
  preferredDate: string;            // Will be converted to Date by backend
  preferredTimeSlot: TimeSlot;
  additionalNotes?: string;
  truck?: string;
  truckId?: string;
  createdAt: string;
  updatedAt: string;
}

// API Payload types matching backend requirements
export interface CreateTripPayload {
  name: string;
  phone: string;                    // Match backend field name
  email: string;                    // Required in backend
  productType: ProductType;
  pickupLocation: string;
  dropOffLocation: string;          // Match backend field name
  preferredDate: string;            // Backend will convert to Date
  preferredTimeSlot: TimeSlot;
  additionalNotes?: string;
  truck?: string;
  truckId?: string;
}

// API Response types
export interface TripListResponse {
  trips: Trip[];
  total: number;
  page: number;
  limit: number;
}

// Error handling
export interface TripApiError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}