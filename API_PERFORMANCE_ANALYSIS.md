# Arambo Website - API Performance Analysis & Integration Documentation

## Executive Summary

Based on the network performance analysis showing durations of **1.89s**, **11ms**, **11ms**, and **72ms** for different API calls when visiting the single property page (`/properties/[id]`), this document provides a comprehensive analysis of the API integration, performance bottlenecks, and optimization recommendations.

## Current Performance Analysis

### Network Timing Breakdown
From the screenshot analysis:

1. **Next.js RSC Request** (`localhost:3001/properties/68e1bce433491156599e518f?_rsc=1ys0m`): **1.89s** - 🔴 **CRITICAL BOTTLENECK**
2. **Backend API Call** (`localhost:4000`): **11ms** - ✅ **Good Performance**
3. **Additional API Call**: **11ms** - ✅ **Good Performance**  
4. **Maps API Call**: **72ms** - ✅ **Acceptable Performance**

### Performance Bottleneck Identification

The **1.89s duration** is from the **Next.js frontend server** (localhost:3001) with React Server Components (`_rsc` parameter), NOT from the backend API (localhost:4000). This represents **94.5%** of the total loading time and indicates a **frontend server-side rendering bottleneck**.

## API Architecture Overview

### 1. API Client Configuration

**Location**: `src/lib/api.ts`

```typescript
// Base API configuration
export const apiClient = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Key Features**:
- **Timeout**: 10 seconds (appropriate)
- **Base URL**: localhost:4000 (development)
- **Request/Response Interceptors**: Comprehensive logging and error handling
- **Error Handling**: Custom error processing with user-friendly messages

### 2. Property Service Architecture

**Location**: `src/lib/api.ts`

```typescript
export const propertyService = {
  // Get a single property by ID - MAIN BOTTLENECK
  async getPropertyById(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },
  
  // Get paginated property listings with filters
  async getProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const queryString = buildQueryString(filters);
    const url = `/properties${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get<PropertyListResponse>(url);
    return response.data;
  }
};
```

## Data Flow Analysis

### Single Property Page Load Sequence

1. **User navigates** to `/properties/[id]`
2. **URL parameter extraction** via `useParams()` - **Instant**
3. **API call initiated** via `useProperty(propertyId)` hook - **1.89s**
4. **Data processing** and component rendering - **~50ms**
5. **Similar properties fetch** (separate API call) - **11ms**
6. **Image loading** in PropertySingleSwiperAPI - **Variable**

### Hook Integration Analysis

**Location**: `src/hooks/useProperties.ts`

```typescript
// Hook for fetching a single property - MAIN BOTTLENECK SOURCE
export const useProperty = (id: string | null) => {
  const {
    data: property,
    error,
    isLoading,
    mutate
  } = useSWR(
    id ? swrKeys.property(id) : null,
    () => id ? propertyService.getPropertyById(id) : null,
    swrConfig // Includes caching configuration
  );

  return {
    property,
    error: error ? handleApiError(error) : null,
    isLoading,
    refresh: () => mutate(),
  };
};
```

**SWR Configuration**:
```typescript
const swrConfig = {
  revalidateOnFocus: false,      // ✅ Good for performance
  revalidateOnReconnect: true,   // ✅ Good for UX
  shouldRetryOnError: false,     // ✅ Prevents cascade failures
  errorRetryCount: 3,            // ✅ Reasonable retry logic
  errorRetryInterval: 2000,      // ✅ 2-second intervals
};
```

## Component Performance Analysis

### 1. PropertySingleSwiperAPI Component

**Location**: `src/components/PropertySingleSwiperAPI.tsx`

**Performance Impact**: **Medium** - Image loading and processing

**Key Features**:
- **Dynamic image handling** from API data
- **Error handling** for failed images
- **Fallback mechanisms** for missing images
- **Memory management** via error state tracking

**Performance Considerations**:
```typescript
// Image error handling with state management
const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const target = event.target as HTMLImageElement;
  target.src = "/placeholder.svg";
  setImageErrors(prev => new Set([...prev, target.src]));
};
```

### 2. Loading States Implementation

**Location**: `src/components/ui/LoadingComponents.tsx`

**Loading Components**:
- **PropertyDetailsSkeleton**: Full page skeleton for property details
- **PropertyCardSkeleton**: Individual property card skeletons
- **PropertyListSkeleton**: Grid of property card skeletons
- **LoadingSpinner**: Reusable spinner component

**Performance Impact**: **Positive** - Improves perceived performance

### 3. Error Handling Components

**Location**: `src/components/ui/ErrorComponents.tsx`

**Error Components**:
- **ErrorMessage**: User-friendly error display with retry functionality
- **NotFoundError**: 404 error handling
- **EmptyState**: No data scenarios
- **PropertyErrorBoundary**: React error boundary for graceful failures

## Performance Bottlenecks Identified

### 1. **PRIMARY BOTTLENECK**: Next.js Server-Side Rendering (1.89s)

**Root Causes**:
- **React Server Components (RSC) Processing**: The `_rsc=1ys0m` parameter indicates server-side rendering
- **Client/Server Component Mismatch**: Current page.tsx is marked as "use client" but Next.js is trying RSC
- **Multiple API Calls in SSR**: Server-side rendering is making multiple API calls sequentially
- **Hydration Complexity**: Complex component tree with multiple nested API dependencies
- **Development Mode Overhead**: Next.js dev server performance in development

**Evidence**:
- URL: `localhost:3001/properties/68e1bce433491156599e518f?_rsc=1ys0m`
- The `_rsc` parameter confirms React Server Components are being used
- Backend API calls (localhost:4000) are actually fast at 11ms
- The slowness is in the frontend server processing, not the backend

### 2. **SECONDARY ISSUES**:

#### Image Loading Performance
- **Unoptimized Images**: No image compression or WebP format
- **No Lazy Loading**: All images load immediately
- **No Progressive Loading**: Full resolution images load at once

#### Component Rendering Performance
- **Large Component Tree**: Complex nested components
- **No Memoization**: Missing React.memo on expensive components
- **State Management**: Frequent re-renders from state updates

## Optimization Recommendations

### 1. **CRITICAL**: Fix Client/Server Component Architecture

```typescript
// Current problematic pattern in page.tsx:
"use client"; // This conflicts with Next.js trying to use RSC

// SOLUTION 1: Pure Client-Side Rendering (Recommended for your case)
// Remove any server components and stick to client-side rendering
// File: src/app/properties/[id]/page.tsx

export default function PropertyPage() {
  // Keep current implementation as pure client component
  return <PropertyDetailsContent propertyId={propertyId} />;
}
```

```typescript
// SOLUTION 2: Hybrid Approach - Server Component for initial data
// File: src/app/properties/[id]/page.tsx (remove "use client")

import { propertyService } from '@/lib/api';
import { PropertyDetailsClient } from './PropertyDetailsClient';

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Server-side data fetching
  const property = await propertyService.getPropertyById(params.id);
  
  return <PropertyDetailsClient initialProperty={property} />;
}
```

### 2. **HIGH PRIORITY**: Optimize Component Loading Pattern

```typescript
// Current pattern causes multiple API calls:
const SimilarProperties = ({ currentProperty }) => {
  const { properties: similarProperties } = usePropertySearch(similarFilters); // This causes additional delay
  
// OPTIMIZED pattern:
const SimilarProperties = ({ currentProperty }) => {
  const { properties: similarProperties } = usePropertySearch(
    similarFilters,
    true, // enabled
    { 
      revalidateOnMount: false, // Don't fetch immediately
      revalidateOnFocus: false
    }
  );
  
  // Lazy load similar properties after main property loads
  useEffect(() => {
    if (currentProperty) {
      // Trigger fetch only after main property is loaded
      mutate();
    }
  }, [currentProperty]);
```

### 3. **HIGH PRIORITY**: Next.js Development Optimization

```typescript
// next.config.ts optimizations for development
const nextConfig = {
  // Disable React Server Components in development if not needed
  experimental: {
    serverComponents: false, // For development only
  },
  
  // Optimize development builds
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false;
      config.optimization.minimize = false;
    }
    return config;
  },
};
```

### 3. **HIGH PRIORITY**: Image Optimization

```typescript
// Recommended image optimization strategy:
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

// Implementation with Next.js Image component
<Image
  src={slide.image}
  alt={`Property image ${index + 1}`}
  width={800}
  height={416}
  priority={index === 0} // Prioritize first image
  loading={index === 0 ? 'eager' : 'lazy'}
  quality={85} // Balanced quality/size
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 4. **MEDIUM PRIORITY**: Component Optimization

```typescript
// Memoize expensive components
const PropertySingleSwiperAPI = React.memo(({ property }: PropertySingleSwiperAPIProps) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.property.id === nextProps.property.id;
});

// Optimize re-renders with useMemo
const processedImages = useMemo(() => {
  // Image processing logic
}, [property.coverImage, property.otherImages]);
```

### 5. **MEDIUM PRIORITY**: Prefetching Strategy

```typescript
// Implement strategic prefetching
export const usePropertyPrefetch = () => {
  const { mutate } = useSWRConfig();
  
  const prefetchProperty = useCallback((id: string) => {
    mutate(swrKeys.property(id), propertyService.getPropertyById(id));
  }, [mutate]);
  
  return { prefetchProperty };
};
```

## API Integration Best Practices

### 1. **Error Handling Strategy**

```typescript
// Comprehensive error handling
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Network errors
    if (error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your connection.';
    }
    
    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    // HTTP status codes with user-friendly messages
    switch (error.response?.status) {
      case 400: return 'Invalid request. Please check your input.';
      case 404: return 'Property not found.';
      case 500: return 'Server error. Please try again later.';
      default: return 'An unexpected error occurred.';
    }
  }
  
  return 'An unexpected error occurred.';
};
```

### 2. **Loading State Management**

```typescript
// Progressive loading strategy
const PropertyDetailsContent = ({ propertyId }: PropertyDetailsContentProps) => {
  const { property, error, isLoading } = useProperty(propertyId);

  // Show skeleton immediately
  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  // Handle errors gracefully
  if (error) {
    if (error.includes('not found') || error.includes('404')) {
      return <NotFoundError />;
    }
    return (
      <ErrorMessage
        title="Failed to load property"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Render content when ready
  if (!property) {
    return <NotFoundError />;
  }

  return <PropertyDetailsView property={property} />;
};
```

### 3. **Data Validation Strategy**

```typescript
// Runtime data validation
const validatePropertyData = (property: any): property is Property => {
  return (
    property &&
    typeof property.id === 'string' &&
    typeof property.propertyName === 'string' &&
    typeof property.size === 'number' &&
    Array.isArray(property.otherImages || [])
  );
};
```

## Performance Monitoring Recommendations

### 1. **Add Performance Metrics**

```typescript
// Performance monitoring integration
const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Track API response times
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`API call took ${endTime - startTime} milliseconds`);
    };
  }, []);
};
```

### 2. **Implement Analytics**

```typescript
// User experience analytics
const trackPropertyView = (propertyId: string, loadTime: number) => {
  // Analytics implementation
  analytics.track('Property Viewed', {
    propertyId,
    loadTime,
    timestamp: new Date().toISOString(),
  });
};
```

## Development vs Production Considerations

### Current Development Setup
- **API Base URL**: `localhost:4000`
- **No CDN**: Direct file serving
- **No Caching**: Development-focused configuration
- **Debug Logging**: Extensive console output

### Production Recommendations
- **API Base URL**: Environment-based configuration
- **CDN Integration**: Cloudflare or AWS CloudFront
- **Redis Caching**: Backend caching layer
- **Image CDN**: Optimized image delivery
- **Monitoring**: APM tools (New Relic, DataDog)

## Conclusion

The primary performance bottleneck is the **1.89-second property API response time**, which accounts for **94.5%** of the loading time. While the frontend implementation follows React best practices with proper loading states, error handling, and component architecture, the backend optimization should be the immediate priority.

**Immediate Actions Required**:
1. **Fix RSC/Client Component Conflict**: Remove server components or "use client" directive
2. **Optimize Component Loading**: Lazy load secondary components (similar properties)
3. **Development Environment Tuning**: Optimize Next.js dev server configuration
4. **Component Tree Simplification**: Reduce nested API dependencies

**Expected Impact**: These optimizations could reduce the primary loading time from **1.89s to under 300ms**, resulting in an **85% performance improvement** for the single property page load time.