import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { 
  PropertyListResponse, 
  PropertyFilters,
  PropertyAPIPayload
} from '@/types/property';
import { propertyService, swrKeys, handleApiError } from '@/lib/api';

// Configuration for SWR
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
  errorRetryCount: 3,
  errorRetryInterval: 2000,
};

// Hook for fetching paginated properties with infinite scroll
export const useProperties = (filters: PropertyFilters = {}) => {
  const getKey = (pageIndex: number, previousPageData: PropertyListResponse | null) => {
    // If no more data, return null to stop fetching
    if (previousPageData && !previousPageData.pagination.hasNextPage) return null;
    
    // First page, we don't have `previousPageData`
    if (pageIndex === 0) {
      return swrKeys.properties({ ...filters, page: 1 });
    }
    
    // Add the cursor to the API endpoint
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
  
  // Total count from the first page
  const total = data?.[0]?.total || 0;
  
  // Loading more pages
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

// Hook for fetching a single property
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

// Hook for fetching property statistics
export const usePropertyStats = () => {
  const {
    data: stats,
    error,
    isLoading,
    mutate
  } = useSWR(
    swrKeys.stats(),
    () => propertyService.getStats(),
    {
      ...swrConfig,
      revalidateOnFocus: true, // Stats might change more frequently
    }
  );

  return {
    stats,
    error: error ? handleApiError(error) : null,
    isLoading,
    refresh: () => mutate(),
  };
};

// Hook for searching properties with debounced filters
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

// Hook for creating a property
export const useCreateProperty = () => {
  const createProperty = async (propertyData: PropertyAPIPayload) => {
    try {
      const property = await propertyService.createProperty(propertyData);
      return { property, error: null };
    } catch (error) {
      return { property: null, error: handleApiError(error) };
    }
  };

  return { createProperty };
};

// Hook for updating a property
export const useUpdateProperty = () => {
  const updateProperty = async (id: string, propertyData: Partial<PropertyAPIPayload>) => {
    try {
      const property = await propertyService.updateProperty(id, propertyData);
      return { property, error: null };
    } catch (error) {
      return { property: null, error: handleApiError(error) };
    }
  };

  return { updateProperty };
};