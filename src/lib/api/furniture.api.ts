import axios from 'axios';

// Types based on your backend models
export type FurnitureType = 'Commercial Furniture' | 'Residential Furniture';
export type PaymentType = 'EMI Plan' | 'Lease' | 'Instant Pay';
export type FurnitureCondition = 'New Furniture' | 'Used Furniture';

export interface FurnitureData {
  name: string;
  email: string;
  phone: string;
  furnitureType: FurnitureType;
  paymentType?: PaymentType;
  furnitureCondition?: FurnitureCondition;
}

export interface FurnitureResponse extends FurnitureData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FurnitureListResponse {
  data: FurnitureResponse[];
  total: number;
  page: number;
  totalPages: number;
}

// API Client
export const furnitureApi = {
  // Create a new furniture item
  create: async (data: FurnitureData): Promise<FurnitureResponse> => {
    const response = await axios.post('/api/furniture', data);
    return response.data;
  },

  // Get all furniture items with optional filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    furnitureType?: FurnitureType;
    paymentType?: PaymentType;
    furnitureCondition?: FurnitureCondition;
  }): Promise<FurnitureListResponse> => {
    const response = await axios.get('/api/furniture', { params });
    return response.data;
  },

  // Get furniture item by ID
  getById: async (id: string): Promise<FurnitureResponse> => {
    const response = await axios.get(`/api/furniture/${id}`);
    return response.data;
  },

  // Update furniture item
  update: async (id: string, data: Partial<FurnitureData>): Promise<FurnitureResponse> => {
    const response = await axios.put(`/api/furniture/${id}`, data);
    return response.data;
  },

  // Delete furniture item
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/furniture/${id}`);
    return response.data;
  }
};