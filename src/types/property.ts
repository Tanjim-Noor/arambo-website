// Property types based on API documentation
export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'villa' 
  | 'townhouse' 
  | 'studio' 
  | 'duplex' 
  | 'penthouse' 
  | 'commercial' 
  | 'land' 
  | 'other';

export type Category = 'sale' | 'rent' | 'lease' | 'buy';

export type InventoryStatus = 
  | 'Looking for Rent' 
  | 'Looking for Sale' 
  | 'Looking for Lease' 
  | 'Available' 
  | 'Rented' 
  | 'Sold' 
  | 'Leased' 
  | 'Unavailable';

export type TenantType = 'Family' | 'Bachelor' | 'Office' | 'Commercial' | 'Any';

export type PropertyCategory = 'residential' | 'commercial' | 'industrial' | 'mixed';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Non-Furnished';

// Main Property interface matching API documentation
export interface Property {
  // System fields
  id: string;
  createdAt: string;
  updatedAt: string;

  // Required fields
  name: string;                    // Owner/contact name
  email: string;                   // Contact email
  phone: string;                   // Contact phone
  propertyName: string;            // Property title
  propertyCategory: PropertyCategory;      // Residential, Commercial, etc.
  size: number;                    // Size in square feet
  location: string;                // Property location
  bedrooms: number;                // Number of bedrooms
  bathroom: number;                // Number of bathrooms
  baranda: boolean;               // Has balcony
  category: Category;             // rent, sale, lease, buy
  firstOwner: boolean;            // Is first owner
  lift: boolean;                  // Has elevator
  isConfirmed: boolean;           // Property listing confirmed
  paperworkUpdated: boolean;      // Paperwork status
  onLoan: boolean;               // Property on loan

  // Optional fields
  notes?: string;                 // Additional notes
  houseId?: string;              // House identifier
  streetAddress?: string;         // Street address
  landmark?: string;             // Nearby landmark
  area?: string;                 // Area/locality
  listingId?: string;            // Listing identifier
  inventoryStatus?: InventoryStatus;
  tenantType?: TenantType;
  furnishingStatus?: FurnishingStatus;
  availableFrom?: string;        // ISO date string
  floor?: number;                // Floor number
  totalFloor?: number;           // Total floors in building
  yearOfConstruction?: number;   // Construction year
  rent?: number;                 // Monthly rent
  serviceCharge?: number;        // Monthly service charge
  advanceMonths?: number;        // Advance payment months
  cleanHygieneScore?: number;    // 1-10 rating
  sunlightScore?: number;        // 1-10 rating
  bathroomConditionsScore?: number; // 1-10 rating
  coverImage?: string;           // Cover image URL
  otherImages?: string[];        // Additional image URLs
}

// Property form data for creating/updating properties
export interface PropertyFormData {
  // Required fields from Form.tsx - these are the ones in the UI and sent as payload
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  propertyCategory: string; 
  size: string; 
  location: string;
  bedrooms: string; 
  bathroom: string; 
  baranda: string; 
  category: string; 
  notes: string; 
  firstOwner: string; 
  paperworkUpdated: string; 
  onLoan: string; 
  
  // Optional fields - keeping these for API flexibility when editing/creating properties
  lift?: boolean;
  houseId?: string;
  streetAddress?: string;
  landmark?: string;
  area?: string;
  listingId?: string;
  inventoryStatus?: InventoryStatus;
  tenantType?: TenantType;
  furnishingStatus?: FurnishingStatus;
  availableFrom?: string;
  floor?: number;
  totalFloor?: number;
  yearOfConstruction?: number;
  rent?: number;
  serviceCharge?: number;
  advanceMonths?: number;
  cleanHygieneScore?: number;
  sunlightScore?: number;
  bathroomConditionsScore?: number;
  coverImage?: string;
  otherImages?: string[];
}

// Property API payload interface - what the backend actually expects
export interface PropertyAPIPayload {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  propertyCategory: PropertyCategory;
  size: number;
  location: string;
  bedrooms: number;
  bathroom: number;
  baranda: number;
  category: string;
  notes: string;
  firstOwner: boolean;
  paperworkUpdated: boolean;
  onLoan: boolean;
  
  // Optional fields
  lift?: boolean;
  houseId?: string;
  streetAddress?: string;
  landmark?: string;
  area?: string;
  listingId?: string;
  inventoryStatus?: InventoryStatus;
  tenantType?: TenantType;
  furnishingStatus?: FurnishingStatus;
  availableFrom?: string;
  floor?: number;
  totalFloor?: number;
  yearOfConstruction?: number;
  rent?: number;
  serviceCharge?: number;
  advanceMonths?: number;
  cleanHygieneScore?: number;
  sunlightScore?: number;
  bathroomConditionsScore?: number;
  coverImage?: string;
  otherImages?: string[];
}

// Pagination information
export interface Pagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

// API response for property listings
export interface PropertyListResponse {
  properties: Property[];
  total: number;
  pagination: Pagination;
}

// Property filter parameters
export interface PropertyFilters {
  page?: number;
  limit?: number;
  category?: Category;
  propertyType?: PropertyType;
  bedrooms?: number;
  minSize?: number;
  maxSize?: number;
  location?: string;
  area?: string;
  firstOwner?: boolean;
  onLoan?: boolean;
  inventoryStatus?: InventoryStatus;
  tenantType?: TenantType;
  propertyCategory?: PropertyCategory;
  furnishingStatus?: FurnishingStatus;
  minRent?: number;
  maxRent?: number;
  floor?: number;
  houseId?: string;
  listingId?: string;
  isConfirmed?: boolean;
}

// Property statistics response
export interface PropertyStats {
  total: number;
  byCategory: Record<Category, number>;
  byPropertyType: Record<PropertyType, number>;
  avgSize: number;
  avgBedrooms: number;
}

// API Error response
export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

// Health check response
export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  version: string;
}

// Legacy property interface for backward compatibility with existing components
export interface LegacyProperty {
  id: number;
  image: string;
  price: string;
  type: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  isVerified: boolean;
  forSale: boolean;
}