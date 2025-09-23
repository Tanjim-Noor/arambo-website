"use client";

import { useEffect, useRef, useState } from "react";
import ActionButtonContainer from "@/components/ActionButtonContainer";
import { PropertyCard } from "@/components/PropertyCardNew";
import { PropertyFilter } from "@/components/PropertyFIlter";
import ServiceCards from "@/components/ServiceCards";
import { Search } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters } from "@/types/property";
import { PropertyListSkeleton, LoadingSpinner } from "@/components/ui/LoadingComponents";
import { ErrorMessage, EmptyState } from "@/components/ui/ErrorComponents";

const ResidentialPage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
    propertyCategory: 'Residential'
  });
  
  const { 
    properties, 
    total, 
    error, 
    isLoading, 
    isValidating, 
    hasMore, 
    loadMore 
  } = useProperties(filters);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loaderRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isValidating && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isValidating, hasMore, loadMore]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  return (
    <div className="min-h-screen bg-Arambo-Background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Residential Properties
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Find your perfect home from our verified listings
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-lg p-2">
              <Search className="text-gray-400 ml-3" size={20} />
              <input
                type="text"
                placeholder="Search by location, area, or property type..."
                className="flex-1 p-3 text-gray-800 outline-none"
                onChange={(e) => {
                  const searchValue = e.target.value;
                  handleFilterChange({ 
                    location: searchValue || undefined 
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <PropertyFilter CategoryOptions={['rent', 'sale', 'lease']} />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {total > 0 ? `${total} Properties Found` : 'Properties'}
            </h2>
            {isValidating && properties.length > 0 && (
              <div className="flex items-center text-gray-600">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
            className="mb-8"
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
            description="Try adjusting your filters or search criteria to find more properties."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({
                page: 1,
                limit: 10,
                propertyCategory: 'Residential'
              });
            }}
          />
        )}

        {/* Properties Grid */}
        {properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                />
              ))}
            </div>

            {/* Load More Trigger */}
            <div 
              ref={loaderRef} 
              className="flex justify-center py-8"
            >
              {isValidating && hasMore && (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner />
                  <span className="text-gray-600">Loading more properties...</span>
                </div>
              )}
              
              {!hasMore && properties.length > 0 && (
                <p className="text-gray-500 text-center">
                  You&apos;ve reached the end of the properties list
                </p>
              )}
            </div>
          </>
        )}

        {/* Service Cards Section */}
        <div className="mt-16">
          <ServiceCards />
        </div>

        {/* Action Buttons */}
        <div className="mt-12">
          <ActionButtonContainer defaultSelected="rent" />
        </div>
      </div>
    </div>
  );
};

export default ResidentialPage;