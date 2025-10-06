"use client";
import React, { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "../PropertyCardSimple";
import { useProperties } from "@/hooks/useProperties";
import { PropertyFilters } from "@/types/property";
import { PropertyCardSkeleton } from "../ui/LoadingComponents";

const HyperFiltering = () => {
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>({
    limit: 6, // Show max 6 properties in the preview
    // Don't set any specific filters initially to show mixed results
  });

  // Load properties with current filters
  const { properties, isLoading } = useProperties(activeFilters);

  // Category configuration with proper filter types
  const categories = [
    { 
      value: "Family", 
      link: "/residential?tenantType=Family",
      filterType: "tenantType" as const,
      filterValue: "Family"
    },
    { 
      value: "Women", 
      link: "/residential?tenantType=Women",
      filterType: "tenantType" as const,
      filterValue: "Women"
    },
    { 
      value: "Bachelor", 
      link: "/residential?tenantType=Bachelor",
      filterType: "tenantType" as const,
      filterValue: "Bachelor"
    },
    { 
      value: "Furnished", 
      link: "/commercial?furnishingStatus=Furnished",
      filterType: "furnishingStatus" as const,
      filterValue: "Furnished"
    },
    { 
      value: "Non-Furnished", 
      link: "/commercial?furnishingStatus=Non-Furnished",
      filterType: "furnishingStatus" as const,
      filterValue: "Non-Furnished"
    },
  ];

  // Handle category filter toggle
  const handleCategoryClick = (category: typeof categories[0]) => {
    const { filterType, filterValue } = category;
    
    setActiveFilters(prev => {
      const currentValues = Array.isArray(prev[filterType]) 
        ? prev[filterType] as string[]
        : prev[filterType] 
          ? [prev[filterType] as string]
          : [];

      const isSelected = currentValues.includes(filterValue);
      
      if (isSelected) {
        // Remove from selection
        const newValues = currentValues.filter(val => val !== filterValue);
        
        return {
          ...prev,
          limit: 6,
          [filterType]: newValues.length === 0 ? undefined : (newValues.length === 1 ? newValues[0] : newValues),
        };
      } else {
        // Add to selection
        const newValues = [...currentValues, filterValue];
        
        return {
          ...prev,
          limit: 6,
          [filterType]: newValues.length === 1 ? newValues[0] : newValues,
        };
      }
    });
  };

  // Check if category is active
  const isCategoryActive = (category: typeof categories[0]) => {
    const { filterType, filterValue } = category;
    const currentValues = Array.isArray(activeFilters[filterType]) 
      ? activeFilters[filterType] as string[]
      : activeFilters[filterType] 
        ? [activeFilters[filterType] as string]
        : [];
    
    return currentValues.includes(filterValue);
  };

  // Get current filter description
  const getCurrentFilterDescription = () => {
    const tenantTypes = Array.isArray(activeFilters.tenantType) 
      ? activeFilters.tenantType 
      : activeFilters.tenantType 
        ? [activeFilters.tenantType]
        : [];
    
    const furnishingTypes = Array.isArray(activeFilters.furnishingStatus) 
      ? activeFilters.furnishingStatus 
      : activeFilters.furnishingStatus 
        ? [activeFilters.furnishingStatus]
        : [];

    const allFilters = [...tenantTypes, ...furnishingTypes];
    
    if (allFilters.length === 0) {
      return "Showing available properties";
    }
    
    if (allFilters.length === 1) {
      return `Showing properties for ${allFilters[0]}`;
    }
    
    return `Showing properties for ${allFilters.join(", ")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1200px] items-stretch align-middle rounded-3xl px-2 md:px-0">
      <div className="flex flex-col items-start justify-center space-y-5 w-full md:w-[75%]">
        <div className="h2">Hyper Filtered Listings</div>
        <div className="p-base text-Arambo-Text">
          Find your ideal apartment by applying filters for bachelors, women,
          and families, plus options for furnished or non-furnished units.
        </div>
        
        {/* Current filter description */}
        <div className="text-sm text-Arambo-Accent font-medium">
          {getCurrentFilterDescription()}
        </div>
        
        <div className="flex flex-wrap gap-3 md:gap-6 mt-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`py-3 px-6 duration-400 rounded-full transition-colors ${
                isCategoryActive(category)
                  ? 'text-Arambo-White bg-Arambo-Accent'
                  : 'text-Arambo-Black bg-Arambo-Background hover:text-Arambo-White hover:bg-Arambo-Accent'
              }`}
            >
              {category.value}
            </button>
          ))}
        </div>
        
        {/* Show active filters and link to full page */}
        {(activeFilters.tenantType || activeFilters.furnishingStatus) && (
          <div className="mt-4">
            <Link 
              href={
                activeFilters.tenantType 
                  ? `/residential?${Array.isArray(activeFilters.tenantType) 
                      ? activeFilters.tenantType.map(t => `tenantType=${encodeURIComponent(t)}`).join('&')
                      : `tenantType=${encodeURIComponent(activeFilters.tenantType)}`}`
                  : `/commercial?${Array.isArray(activeFilters.furnishingStatus) 
                      ? activeFilters.furnishingStatus.map(f => `furnishingStatus=${encodeURIComponent(f)}`).join('&')
                      : `furnishingStatus=${encodeURIComponent(activeFilters.furnishingStatus!)}`}`
              }
              className="text-Arambo-Accent hover:text-Arambo-Accent/80 underline text-sm"
            >
              View all filtered properties →
            </Link>
          </div>
        )}
        
        {/* Clear filters button when any filter is active */}
        {(activeFilters.tenantType || activeFilters.furnishingStatus) && (
          <button
            onClick={() => setActiveFilters({ limit: 6 })}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-1 overflow-x-auto space-x-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-w-[300px] h-fit">
              <PropertyCardSkeleton />
            </div>
          ))
        ) : properties.length > 0 ? (
          // Display properties
          properties.slice(0, 10).map((property) => (
            <div key={property.id} className="min-w-[300px] h-fit">
              <PropertyCard property={property} />
            </div>
          ))
        ) : (
          // No properties found
          <div className="min-w-[300px] h-fit flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-500 text-sm">
                No properties found
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Try different filters
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HyperFiltering;
