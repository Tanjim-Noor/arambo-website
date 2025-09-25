import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { PropertyFilters } from '@/types/property';

/**
 * Hook to manage URL search parameters for property filters
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current filters from URL params - memoized to prevent re-computation
  const currentFilters = useMemo((): PropertyFilters => {
    const params: PropertyFilters = {};
    
    // String parameters
    const location = searchParams.get('location');
    if (location) params.location = location;
    
    const area = searchParams.get('area');
    if (area) params.area = area;
    
    const category = searchParams.get('category');
    if (category) params.category = category as PropertyFilters['category'];
    
    const propertyType = searchParams.get('propertyType');
    if (propertyType) params.propertyType = propertyType as PropertyFilters['propertyType'];
    
    const propertyCategory = searchParams.get('propertyCategory');
    if (propertyCategory) params.propertyCategory = propertyCategory as PropertyFilters['propertyCategory'];
    
    const inventoryStatus = searchParams.get('inventoryStatus');
    if (inventoryStatus) params.inventoryStatus = inventoryStatus as PropertyFilters['inventoryStatus'];
    
    const furnishingStatus = searchParams.get('furnishingStatus');
    if (furnishingStatus) params.furnishingStatus = furnishingStatus as PropertyFilters['furnishingStatus'];
    
    const houseId = searchParams.get('houseId');
    if (houseId) params.houseId = houseId;
    
    const listingId = searchParams.get('listingId');
    if (listingId) params.listingId = listingId;
    
    // Number parameters (with special handling for strings like "4+", "3+")
    const page = searchParams.get('page');
    if (page) params.page = parseInt(page, 10);
    
    const limit = searchParams.get('limit');
    if (limit) params.limit = parseInt(limit, 10);
    
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      // Keep string values like "4+" as strings, convert regular numbers to integers
      params.bedrooms = bedrooms.includes('+') ? bedrooms : parseInt(bedrooms, 10);
    }
    
    const bathroom = searchParams.get('bathroom');
    if (bathroom) {
      // Keep string values like "3+" as strings, convert regular numbers to integers
      params.bathroom = bathroom.includes('+') ? bathroom : parseInt(bathroom, 10);
    }
    
    const minSize = searchParams.get('minSize');
    if (minSize) params.minSize = parseInt(minSize, 10);
    
    const maxSize = searchParams.get('maxSize');
    if (maxSize) params.maxSize = parseInt(maxSize, 10);
    
    const minRent = searchParams.get('minRent');
    if (minRent) params.minRent = parseInt(minRent, 10);
    
    const maxRent = searchParams.get('maxRent');
    if (maxRent) params.maxRent = parseInt(maxRent, 10);
    
    const floor = searchParams.get('floor');
    if (floor) params.floor = parseInt(floor, 10);
    
    // Boolean parameters
    const firstOwner = searchParams.get('firstOwner');
    if (firstOwner === 'true') params.firstOwner = true;
    if (firstOwner === 'false') params.firstOwner = false;
    
    const onLoan = searchParams.get('onLoan');
    if (onLoan === 'true') params.onLoan = true;
    if (onLoan === 'false') params.onLoan = false;
    
    const isConfirmed = searchParams.get('isConfirmed');
    if (isConfirmed === 'true') params.isConfirmed = true;
    if (isConfirmed === 'false') params.isConfirmed = false;
    
    const apartmentType = searchParams.get('apartmentType');
    if (apartmentType) params.apartmentType = apartmentType;
    
    // Handle multiple tenantType values
    const tenantTypes = searchParams.getAll('tenantType');
    if (tenantTypes.length === 1) {
      params.tenantType = tenantTypes[0] as PropertyFilters['tenantType'];
    }
    
    return params;
  }, [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback((newFilters: Partial<PropertyFilters>, replace = false) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Remove existing filter params to avoid duplicates
    Object.keys(newFilters).forEach(key => {
      current.delete(key);
    });
    
    // Add new filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array values (like multiple tenantTypes)
          value.forEach(v => current.append(key, v.toString()));
        } else {
          current.set(key, value.toString());
        }
      }
    });
    
    // Create the new URL
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    if (replace) {
      router.replace(`${pathname}${query}`);
    } else {
      router.push(`${pathname}${query}`);
    }
  }, [pathname, router, searchParams]);

  // Clear specific filters
  const clearFilters = useCallback((filterKeys: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    filterKeys.forEach(key => {
      current.delete(key);
    });
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.replace(`${pathname}${query}`);
  }, [pathname, router, searchParams]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  // Handle special tenantType array for the category buttons
  const tenantTypes = useMemo(() => {
    return searchParams.getAll('tenantType');
  }, [searchParams]);

  const updateTenantTypes = useCallback((types: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Remove all existing tenantType params
    current.delete('tenantType');
    
    // Add new tenantType params
    types.forEach(type => {
      current.append('tenantType', type);
    });
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.replace(`${pathname}${query}`);
  }, [pathname, router, searchParams]);

  return {
    currentFilters,
    updateFilters,
    clearFilters,
    clearAllFilters,
    tenantTypes,
    updateTenantTypes,
  };
}