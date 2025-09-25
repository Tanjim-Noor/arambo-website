"use client";

import { useEffect, useRef, useState } from "react";
import ActionButtonContainer from "@/components/ActionButtonContainer";
import { PropertyCard } from "../../components/PropertyCardSimple";
import { PropertyFilter } from "@/components/PropertyFIlter";
import ServiceCards from "@/components/ServiceCards";
import { Search } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters } from "@/types/property";
import { PropertyListSkeleton } from "@/components/ui/LoadingComponents";
import { ErrorMessage, EmptyState } from "@/components/ui/ErrorComponents";
import { useUrlParams } from "@/hooks/useUrlParams";

const ResidentialPage = () => {
  const { currentFilters } = useUrlParams();
  const [heroSearchValue, setHeroSearchValue] = useState("");
  
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
    propertyCategory: 'Residential',
    ...currentFilters
  });
  
  const { 
    properties, 
    error, 
    isLoading, 
    isValidating, 
    hasMore, 
    loadMore 
  } = useProperties(filters);
  
  console.log("Properties:", properties);
  console.log("Error:", error);
  console.log("Filters:", filters);
  console.log("Current URL Filters:", currentFilters);
  
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Update filters when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...currentFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, [currentFilters]);

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

  // Handle hero search input changes (no functionality, just visual)
  const handleHeroSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setHeroSearchValue(searchValue);
  };

  // Handle filter changes from PropertyFilter component
  const handleFiltersChange = (newFilters: PropertyFilters) => {
    console.log("Filter changes received:", newFilters);
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-3">
        <div
          className="relative w-full py-16 sm:py-24 lg:py-32 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: "url('/residential/residential-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black/30 rounded-2xl z-0"></div>

          <div className="relative z-10 font-sans flex flex-col items-center gap-2 sm:gap-4 justify-center h-full text-center px-4 sm:px-6">
            <h1 className="h2 @lg:h1 font-semibold text-white">
              Residential Properties
            </h1>
            <p className="body-md sm:body-lg lg:h6 text-white/80 max-w-md">
              Sort by location to find the best lists
            </p>

            <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md py-3 sm:py-4 flex border-white/[0.09] items-center border-2 gap-2 bg-white/10 backdrop-blur-[20px] pl-3 sm:pl-4 pr-4 sm:pr-6 rounded-[35px]">
              <Search className="text-white/80 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search by location..."
                value={heroSearchValue}
                onChange={handleHeroSearchChange}
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none text-sm sm:text-base min-w-0"
              />
            </div>
          </div>

          <div className="relative z-20 sm:absolute left-1/2 sm:-bottom-12 lg:-bottom-16 items-center -translate-x-1/2 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-4/5 md:w-2/3 justify-center p-3 sm:p-4">
            <ActionButtonContainer defaultSelected="buy" />
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="min-h-screen my-12 sm:my-16 lg:my-20">
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Left Sidebar - Filters */}
              <div className="w-80 flex-shrink-0">
                <PropertyFilter
                  CategoryOptions={["Women", "Family", "Bachelor"]}
                  onFiltersChange={handleFiltersChange}
                />
              </div>

              <div className="flex-1">
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
                      setHeroSearchValue("");
                    }}
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

                {/* Loading Spinner - Only show if there are more items to load */}
                {hasMore && (
                  <div
                    ref={loaderRef}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    {isValidating && (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1946bb]/30 border-t-[#1946bb]"></div>
                        <p className="mt-3 text-Arambo-Accent font-medium">
                          Loading...
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 w-full bg-white">
        <ServiceCards />
      </section>
    </>
  );
};

export default ResidentialPage;