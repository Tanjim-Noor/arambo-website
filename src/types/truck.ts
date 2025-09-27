// Truck types based on backend model
export interface Truck {
  id: string;
  modelNumber: string;
  height: number;
  isOpen: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface TruckListResponse {
  trucks: Truck[];
  total: number;
  page: number;
  limit: number;
}

// Error handling
export interface TruckApiError {
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}