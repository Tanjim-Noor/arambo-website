// Furniture types based on the backend model

export type FurnitureType = 
  | 'Commercial Furniture' 
  | 'Residential Furniture';

export type PaymentType = 
  | 'EMI Plan' 
  | 'Lease' 
  | 'Instant Pay';

export type FurnitureCondition = 
  | 'New Furniture' 
  | 'Used Furniture';

// Main Furniture interface matching backend model
export interface Furniture {
  // System fields
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

  // Required fields
  name: string;                    // Customer name
  email?: string;                  // Contact email (optional)
  phone: string;                   // Contact phone
  furnitureType: FurnitureType;    // Type of furniture
  paymentType: PaymentType;        // Payment method
  furnitureCondition: FurnitureCondition; // Condition of furniture
}

// For API requests
export interface CreateFurnitureRequest {
  name: string;
  email?: string;
  phone: string;
  furnitureType: FurnitureType;
  paymentType: PaymentType;
  furnitureCondition: FurnitureCondition;
}

// API response interfaces
export interface FurnitureResponse {
  success: boolean;
  data: Furniture;
  message?: string;
}

export interface FurnituresResponse {
  success: boolean;
  data: Furniture[];
  message?: string;
}