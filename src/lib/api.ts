import axios, { AxiosError, AxiosResponse } from 'axios';
import { 
  Property, 
  PropertyListResponse, 
  PropertyAPIPayload,
  PropertyFilters, 
  PropertyStats, 
  HealthResponse,
  ApiError,
  PropertyType
} from '@/types/property';
import { 
  Truck, 
  TruckListResponse, 
  TruckApiError 
} from '@/types/truck';
import { 
  Trip, 
  CreateTripPayload, 
  TripListResponse, 
  TripApiError 
} from '@/types/trip';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log errors
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
    } else if (error.response?.status && error.response.status >= 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Utility function to build query string from filters
export const buildQueryString = (filters: PropertyFilters): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  return params.toString();
};

// Health check service
export const healthService = {
  async check(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/properties/health');
    return response.data;
  }
};

// Property services
export const propertyService = {
  // Get paginated property listings with optional filters
  async getProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const queryString = buildQueryString(filters);
    const url = `/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PropertyListResponse>(url);
    return response.data;
  },

  // Get a single property by ID
  async getPropertyById(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },

  // Create a new property
  async createProperty(propertyData: PropertyAPIPayload): Promise<Property> {
    const response = await apiClient.post<Property>('/properties', propertyData);
    return response.data;
  },

  // Update an existing property
  async updateProperty(id: string, propertyData: Partial<PropertyAPIPayload>): Promise<Property> {
    const response = await apiClient.put<Property>(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Get property statistics
  async getStats(): Promise<PropertyStats> {
    const response = await apiClient.get<PropertyStats>('/properties/stats');
    return response.data;
  }
};

// Truck services
export const truckService = {
  // Get all trucks
  async getTrucks(): Promise<Truck[]> {
    const response = await apiClient.get<Truck[]>('/trucks/');
    return response.data;
  },

  // Get a single truck by ID (URL parameter)
  async getTruckById(id: string): Promise<Truck> {
    const response = await apiClient.get<Truck>(`/trucks/${id}`);
    return response.data;
  },

  // Get a single truck by ID (request body) - alternative endpoint
  async getTruckByIdFromBody(id: string): Promise<Truck> {
    const response = await apiClient.post<Truck>('/trucks/get-by-id', { id });
    return response.data;
  },

  // Create a new truck (admin function)
  async createTruck(truckData: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Truck> {
    const response = await apiClient.post<Truck>('/trucks', truckData);
    return response.data;
  },

  // Update an existing truck (admin function)
  async updateTruck(id: string, truckData: Partial<Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Truck> {
    const response = await apiClient.put<Truck>(`/trucks/${id}`, truckData);
    return response.data;
  },

  // Delete a truck (admin function)
  async deleteTruck(id: string): Promise<void> {
    await apiClient.delete(`/trucks/${id}`);
  }
};

// Trip services
export const tripService = {
  // Create a new trip (booking)
  async createTrip(tripData: CreateTripPayload): Promise<Trip> {
    const response = await apiClient.post<Trip>('/trips', tripData);
    return response.data;
  },

  // Get all trips
  async getTrips(): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>('/trips');
    return response.data;
  },

  // Get a single trip by ID
  async getTripById(id: string): Promise<Trip> {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  // Get trips by truck ID
  async getTripsByTruck(truckId: string): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>(`/trips/truck/${truckId}`);
    return response.data;
  },

  // Get trips by date
  async getTripsByDate(date: string): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>(`/trips/date?date=${date}`);
    return response.data;
  },

  // Get trips by time slot
  async getTripsByTimeSlot(timeSlot: string): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>(`/trips/timeslot/${timeSlot}`);
    return response.data;
  },

  // Update an existing trip
  async updateTrip(id: string, tripData: Partial<CreateTripPayload>): Promise<Trip> {
    const response = await apiClient.put<Trip>(`/trips/${id}`, tripData);
    return response.data;
  },

  // Delete a trip
  async deleteTrip(id: string): Promise<void> {
    await apiClient.delete(`/trips/${id}`);
  }
};

// SWR key generators for consistent caching
export const swrKeys = {
  properties: (filters?: PropertyFilters) => 
    filters ? ['properties', filters] : ['properties'],
  property: (id: string) => ['property', id],
  stats: () => ['properties', 'stats'],
  health: () => ['health'],
  trucks: () => ['trucks'],
  truck: (id: string) => ['truck', id],
  trips: () => ['trips'],
  trip: (id: string) => ['trip', id],
  tripsByTruck: (truckId: string) => ['trips', 'truck', truckId],
  tripsByDate: (date: string) => ['trips', 'date', date],
  tripsByTimeSlot: (timeSlot: string) => ['trips', 'timeslot', timeSlot]
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Handle your backend's error format
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    
    // Handle validation errors with details array
    if (axiosError.response?.data?.details) {
      if (Array.isArray(axiosError.response.data.details)) {
        return axiosError.response.data.details
          .map((detail: any) => detail.message || detail)
          .join(', ');
      }
      return String(axiosError.response.data.details);
    }
    
    // Handle general API errors
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    // Handle network errors
    if (axiosError.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your connection.';
    }
    
    // Handle timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    // Handle HTTP status codes
    switch (axiosError.response?.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }
  
  return 'An unexpected error occurred.';
};
