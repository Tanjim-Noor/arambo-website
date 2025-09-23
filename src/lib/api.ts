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

// SWR key generators for consistent caching
export const swrKeys = {
  properties: (filters?: PropertyFilters) => 
    filters ? ['properties', filters] : ['properties'],
  property: (id: string) => ['property', id],
  stats: () => ['properties', 'stats'],
  health: () => ['health']
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle validation errors
    if (axiosError.response?.data?.details) {
      return axiosError.response.data.details
        .map(detail => detail.message)
        .join(', ');
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

// Utility to convert legacy property format to new format
export const convertLegacyProperty = (legacyProperty: Record<string, unknown>): Partial<Property> => {
  return {
    id: String(legacyProperty.id || ''),
    propertyName: String(legacyProperty.type || ''),
    propertyType: (String(legacyProperty.type || 'apartment')).toLowerCase() as PropertyType,
    location: String(legacyProperty.location || ''),
    bedrooms: Number(legacyProperty.beds) || 0,
    bathroom: Number(legacyProperty.baths) || 0,
    size: Number(legacyProperty.sqft) || 0,
    rent: parseInt(String(legacyProperty.price || '0').replace(/[^0-9]/g, '') || '0'),
    coverImage: String(legacyProperty.image || ''),
    isConfirmed: Boolean(legacyProperty.isVerified),
    category: Boolean(legacyProperty.forSale) ? 'sale' : 'rent',
    // Default required fields
    name: '',
    email: '',
    phone: '',
    baranda: false,
    firstOwner: false,
    lift: false,
    paperworkUpdated: false,
    onLoan: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};