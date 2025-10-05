# Arambo Website - Complete API Integration Documentation

## Table of Contents
1. [API Architecture Overview](#api-architecture-overview)
2. [Data Models & Types](#data-models--types)
3. [Service Layer Implementation](#service-layer-implementation)
4. [Hook System & State Management](#hook-system--state-management)
5. [Component Integration Patterns](#component-integration-patterns)
6. [Loading States & Error Handling](#loading-states--error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Testing & Debugging](#testing--debugging)

## API Architecture Overview

### Base Configuration

**File**: `src/lib/api.ts`

The API client is built on Axios with comprehensive configuration:

```typescript
export const apiClient = axios.create({
  baseURL: "http://localhost:4000",  // Development endpoint
  timeout: 10000,                    // 10-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request/Response Interceptors

```typescript
// Request logging and authentication
apiClient.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response error handling
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);
```

## Data Models & Types

### Core Property Interface

**File**: `src/types/property.ts`

```typescript
export interface Property {
  // System fields
  id: string;
  createdAt: string;
  updatedAt: string;

  // Core property data
  propertyName: string;
  propertyType: string;
  propertyCategory: PropertyCategory;
  size: number;
  location: string;
  bedrooms: number;
  bathroom: number;
  rent?: number;

  // Media assets
  coverImage?: string;
  otherImages?: string[];

  // Location data
  longitude?: number;
  latitude?: number;
  area?: string;

  // Facilities
  cctv?: boolean;
  gym?: boolean;
  parking?: boolean;
  swimmingPool?: boolean;
  
  // Property history
  propertyValueHistory?: { year: number; value: number; }[];
}
```

### API Response Types

```typescript
export interface PropertyListResponse {
  properties: Property[];
  total: number;
  pagination: Pagination;
}

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
```

### Filter System

```typescript
export interface PropertyFilters {
  page?: number;
  limit?: number;
  propertyCategory?: PropertyCategory;
  propertyType?: PropertyType;
  bedrooms?: number | string;
  bathroom?: number | string;
  minSize?: number;
  maxSize?: number;
  location?: string;
  area?: string;
  minRent?: number;
  maxRent?: number;
  furnishingStatus?: FurnishingStatus;
  
  // GPS coordinate filters
  longitude?: number;
  latitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
  minLatitude?: number;
  maxLatitude?: number;
}
```

## Service Layer Implementation

### Property Service

**File**: `src/lib/api.ts`

```typescript
export const propertyService = {
  // Get paginated property listings with filters
  async getProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const queryString = buildQueryString(filters);
    const url = `/properties${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get<PropertyListResponse>(url);
    return response.data;
  },

  // Get single property by ID
  async getPropertyById(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  async createProperty(propertyData: PropertyAPIPayload): Promise<Property> {
    const response = await apiClient.post<Property>('/properties', propertyData);
    return response.data;
  },

  // Update existing property
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
```

### Query String Builder

```typescript
export const buildQueryString = (filters: PropertyFilters): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  return params.toString();
};
```

### Error Handling Utility

```typescript
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Handle backend error format
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    
    // Handle validation errors
    if (axiosError.response?.data?.details) {
      if (Array.isArray(axiosError.response.data.details)) {
        return axiosError.response.data.details
          .map((detail: any) => detail.message || detail)
          .join(', ');
      }
      return String(axiosError.response.data.details);
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
      case 400: return 'Invalid request. Please check your input.';
      case 404: return 'Resource not found.';
      case 500: return 'Server error. Please try again later.';
      default: return 'An unexpected error occurred.';
    }
  }
  
  return 'An unexpected error occurred.';
};
```

## Hook System & State Management

### SWR Configuration

**File**: `src/hooks/useProperties.ts`

```typescript
const swrConfig = {
  revalidateOnFocus: false,        // Don't refetch on window focus
  revalidateOnReconnect: true,     // Refetch on network reconnection
  shouldRetryOnError: false,       // Don't retry on error
  errorRetryCount: 3,              // Retry 3 times if retry enabled
  errorRetryInterval: 2000,        // 2-second retry interval
};
```

### Single Property Hook

```typescript
export const useProperty = (id: string | null) => {
  const {
    data: property,
    error,
    isLoading,
    mutate
  } = useSWR(
    id ? swrKeys.property(id) : null,
    () => id ? propertyService.getPropertyById(id) : null,
    swrConfig
  );

  return {
    property,
    error: error ? handleApiError(error) : null,
    isLoading,
    refresh: () => mutate(),
  };
};
```

### Property Search Hook

```typescript
export const usePropertySearch = (filters: PropertyFilters, enabled = true) => {
  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(
    enabled ? swrKeys.properties(filters) : null,
    () => enabled ? propertyService.getProperties(filters) : null,
    {
      ...swrConfig,
      dedupingInterval: 1000, // Prevent duplicate requests within 1 second
    }
  );

  return {
    properties: data?.properties || [],
    pagination: data?.pagination,
    total: data?.total || 0,
    error: error ? handleApiError(error) : null,
    isLoading,
    refresh: () => mutate(),
  };
};
```

### Infinite Scroll Hook

```typescript
export const useProperties = (filters: PropertyFilters = {}) => {
  const getKey = (pageIndex: number, previousPageData: PropertyListResponse | null) => {
    if (previousPageData && !previousPageData.pagination.hasNextPage) return null;
    
    if (pageIndex === 0) {
      return swrKeys.properties({ ...filters, page: 1 });
    }
    
    return swrKeys.properties({ 
      ...filters, 
      page: previousPageData!.pagination.nextPage || pageIndex + 1 
    });
  };

  const {
    data,
    error,
    size,
    setSize,
    isValidating,
    isLoading,
    mutate
  } = useSWRInfinite<PropertyListResponse>(
    getKey,
    async ([, filters]: [string, PropertyFilters]) => {
      return await propertyService.getProperties(filters);
    },
    {
      ...swrConfig,
      revalidateFirstPage: false,
    }
  );

  // Flatten all properties from all pages
  const properties = data ? data.flatMap(page => page.properties) : [];
  
  // Check if there are more pages to load
  const hasMore = data && data.length > 0 
    ? data[data.length - 1].pagination.hasNextPage 
    : true;
  
  const total = data?.[0]?.total || 0;
  
  const loadMore = () => {
    if (!isValidating && hasMore) {
      setSize(size + 1);
    }
  };

  return {
    properties,
    total,
    error: error ? handleApiError(error) : null,
    isLoading,
    isValidating,
    hasMore,
    loadMore,
    refresh: () => mutate(),
  };
};
```

### SWR Cache Keys

```typescript
export const swrKeys = {
  properties: (filters?: PropertyFilters) => 
    filters ? ['properties', filters] : ['properties'],
  property: (id: string) => ['property', id],
  stats: () => ['properties', 'stats'],
  health: () => ['health'],
};
```

## Component Integration Patterns

### Property Details Page

**File**: `src/app/properties/[id]/page.tsx`

```typescript
const PropertyDetailsContent = ({ propertyId }: PropertyDetailsContentProps) => {
  const { property, error, isLoading } = useProperty(propertyId);

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

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

  if (!property) {
    return <NotFoundError />;
  }

  return <PropertyDetailsView property={property} />;
};
```

### Property List Integration

**File**: `src/app/residential/page.tsx`

```typescript
const ResidentialPage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
    propertyCategory: 'Residential',
  });
  
  const { 
    properties, 
    error, 
    isLoading,
    isValidating,
    hasMore,
    loadMore,
    total
  } = useProperties(filters);

  return (
    <>
      {/* Error State */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {/* Loading State */}
      {isLoading && properties.length === 0 && (
        <PropertyListSkeleton count={6} />
      )}

      {/* Empty State */}
      {!isLoading && !error && properties.length === 0 && (
        <EmptyState
          title="No Properties Found"
          description="Try adjusting your filters."
        />
      )}

      {/* Properties Grid */}
      {properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMore}
            disabled={isValidating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            {isValidating ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
};
```

### Image Carousel Integration

**File**: `src/components/PropertySingleSwiperAPI.tsx`

```typescript
const PropertySingleSwiperAPI = ({ property }: PropertySingleSwiperAPIProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = "/placeholder.svg";
    setImageErrors(prev => new Set([...prev, target.src]));
  };

  // Combine cover image and other images
  const allImages: Array<{ image: string; hasTag: boolean }> = [];
  
  // Add cover image as first slide
  if (property.coverImage && !imageErrors.has(property.coverImage)) {
    allImages.push({
      image: property.coverImage,
      hasTag: true,
    });
  }
  
  // Add other images
  if (property.otherImages && property.otherImages.length > 0) {
    property.otherImages.forEach((imageUrl, index) => {
      if (imageUrl && imageUrl.trim() && !imageErrors.has(imageUrl)) {
        allImages.push({
          image: imageUrl,
          hasTag: index === 0 && !property.coverImage,
        });
      }
    });
  }
  
  // Fallback to placeholder if no images
  if (allImages.length === 0) {
    allImages.push({
      image: "/property-single/property.jpg",
      hasTag: true,
    });
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={2}
      centeredSlides={true}
      loop={allImages.length > 1}
    >
      {allImages.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative overflow-hidden rounded-2xl">
            {slide.hasTag && (
              <div className="absolute top-8 left-5 z-10">
                <span className="bg-white px-3.5 py-2.5 rounded-full">
                  {property.listingType}
                </span>
              </div>
            )}
            <Image
              src={slide.image}
              alt={`Property image ${index + 1}`}
              width={800}
              height={416}
              className="w-full max-h-[416px] object-cover"
              onError={handleImageError}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
```

## Loading States & Error Handling

### Loading Components

**File**: `src/components/ui/LoadingComponents.tsx`

```typescript
export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PropertyDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-96 bg-gray-200 rounded-lg mb-8"></div>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Error Components

**File**: `src/components/ui/ErrorComponents.tsx`

```typescript
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Error",
  message,
  onRetry,
  className = ""
}) => {
  return (
    <div className={`border border-red-200 bg-red-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        {onRetry && (
          <div className="flex-shrink-0">
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {icon || (
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
```

## Performance Optimization

### Caching Strategy

```typescript
// Enhanced SWR configuration for production
const productionSwrConfig = {
  ...swrConfig,
  dedupingInterval: 60000,        // 1 minute deduping
  focusThrottleInterval: 30000,   // 30 seconds focus throttle
  revalidateIfStale: false,       // Use cached data when available
  refreshInterval: 300000,        // 5 minutes auto-refresh
};
```

### Component Memoization

```typescript
// Memoize expensive components
const PropertyCard = React.memo(({ property }: PropertyCardProps) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.property.id === nextProps.property.id;
});

// Memoize computed values
const PropertyDetailsView = ({ property }: PropertyDetailsViewProps) => {
  const formatPrice = useCallback((price: number | undefined, category: string): string => {
    if (!price) return 'Price on request';
    const formattedPrice = price.toLocaleString();
    if (category === 'rent') {
      return `৳${formattedPrice}/month`;
    }
    return `৳${formattedPrice}`;
  }, []);

  const processedAmenities = useMemo(() => {
    return {
      features: [
        property.baranda && 'Balcony',
        property.lift && 'Elevator',
        property.firstOwner && 'First Owner Property',
      ].filter(Boolean),
      facilities: [
        property.cctv && 'CCTV',
        property.gym && 'Gym',
        property.parking && 'Parking',
        property.swimmingPool && 'Swimming Pool',
      ].filter(Boolean),
    };
  }, [property]);

  // Rest of component
};
```

### Image Optimization

```typescript
// Optimized image loading
const OptimizedPropertyImage = ({ src, alt, priority = false }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={416}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );
};
```

## Testing & Debugging

### Development Debugging

```typescript
// Enhanced logging for development
const debugApiCall = (operation: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 API Debug: ${operation}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', data);
    console.groupEnd();
  }
};

// Usage in hooks
export const useProperty = (id: string | null) => {
  const { data, error, isLoading } = useSWR(
    id ? swrKeys.property(id) : null,
    async () => {
      debugApiCall('Fetching Property', { id });
      const result = await propertyService.getPropertyById(id!);
      debugApiCall('Property Fetched', result);
      return result;
    },
    swrConfig
  );

  return { property: data, error, isLoading };
};
```

### Error Boundary Implementation

```typescript
export class PropertyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Property component error:', error, errorInfo);
    
    // Send to error tracking service
    if (typeof window !== 'undefined') {
      // Analytics or error tracking
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorMessage
          title="Something went wrong"
          message="There was an error loading this component."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
```

### Performance Monitoring

```typescript
// Performance tracking hook
export const usePerformanceMonitoring = (operation: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) { // Log slow operations
        console.warn(`⚠️ Slow operation: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      // Send to analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance', {
          event_category: 'API',
          event_label: operation,
          value: Math.round(duration)
        });
      }
    };
  }, [operation]);
};
```

## Best Practices Summary

### 1. **API Integration**
- ✅ Centralized API client configuration
- ✅ Comprehensive error handling
- ✅ Request/response interceptors
- ✅ Type-safe interfaces
- ✅ Consistent query string building

### 2. **State Management**
- ✅ SWR for caching and synchronization
- ✅ Optimized cache invalidation
- ✅ Proper loading states
- ✅ Error boundaries
- ✅ Memoization for expensive operations

### 3. **Performance**
- ✅ Image optimization with Next.js Image
- ✅ Component memoization
- ✅ Lazy loading strategies
- ✅ Efficient re-rendering patterns
- ✅ Proper caching strategies

### 4. **User Experience**
- ✅ Skeleton loading states
- ✅ Progressive enhancement
- ✅ Graceful error handling
- ✅ Empty state management
- ✅ Retry mechanisms

### 5. **Development**
- ✅ TypeScript for type safety
- ✅ Comprehensive logging
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Development debugging tools

This documentation provides a complete overview of the API integration system in the Arambo website, covering all aspects from basic configuration to advanced optimization techniques.