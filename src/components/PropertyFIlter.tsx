"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Slider } from "@mui/material";
import FormSelect from "./FormSelect";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PropertyFilters } from "@/types/property";

interface PropertyFilterProps {
  CategoryOptions: string[];
  onFiltersChange?: (filters: PropertyFilters) => void;
  categoryType?: 'tenantType' | 'furnishingStatus'; // New prop to determine parameter type
}

export function PropertyFilter({ CategoryOptions, onFiltersChange, categoryType = 'tenantType' }: PropertyFilterProps) {
  const CATEGORY_OPTIONS = CategoryOptions;
  const { currentFilters, updateFilters, categoryValues, updateCategoryValues } = useUrlParams(categoryType);
  
  // Initialize local state only once
  const [localForm, setLocalForm] = useState(() => ({
    location: "",
    minRent: currentFilters.minRent || 10000,
    maxRent: currentFilters.maxRent || 32000,
    categories: categoryValues,
    propertyType: currentFilters.propertyType || "",
    area: currentFilters.area || "",
    beds: currentFilters.bedrooms?.toString() || "",
    bathroom: currentFilters.bathroom?.toString() || "",
    apartmentType: currentFilters.apartmentType || "",
    bathroom2: "",
  }));

  const [sliderValue, setSliderValue] = useState<number[]>(() => [
    currentFilters.minRent || 10000, 
    currentFilters.maxRent || 32000
  ]);

  // Create a debounced version of updateOtherFilters
  const debouncedUpdateOtherFilters = useDebouncedCallback(() => {
    const filters: Partial<PropertyFilters> = {
      minRent: localForm.minRent !== 10000 ? localForm.minRent : undefined,
      maxRent: localForm.maxRent !== 32000 ? localForm.maxRent : undefined,
      propertyType: localForm.propertyType ? (localForm.propertyType as PropertyFilters['propertyType']) : undefined,
      area: localForm.area || undefined,
      bedrooms: localForm.beds ? (localForm.beds.includes('+') ? localForm.beds : parseInt(localForm.beds, 10)) : undefined,
      bathroom: localForm.bathroom ? (localForm.bathroom.includes('+') ? localForm.bathroom : parseInt(localForm.bathroom, 10)) : undefined,
      apartmentType: localForm.apartmentType || undefined,
    };
    
    // Check if there are actual changes to prevent unnecessary updates
    const currentValues = {
      minRent: currentFilters.minRent,
      maxRent: currentFilters.maxRent,
      propertyType: currentFilters.propertyType,
      area: currentFilters.area,
      bedrooms: currentFilters.bedrooms,
      bathroom: currentFilters.bathroom,
      apartmentType: currentFilters.apartmentType,
    };

    // Better change detection that handles clearing values (undefined vs actual values)
    const hasChanges = Object.keys(filters).some(key => {
      const newValue = filters[key as keyof typeof filters];
      const oldValue = currentValues[key as keyof typeof currentValues];
      
      // Handle the case where we're clearing a value (setting to undefined)
      if (newValue === undefined && oldValue !== undefined) return true;
      if (newValue !== undefined && oldValue === undefined) return true;
      if (newValue !== oldValue) return true;
      
      return false;
    });

    if (hasChanges) {
      updateFilters(filters, true);
      onFiltersChange?.(filters as PropertyFilters);
    }
  }, 300);

  // Trigger debounced update when other filters change
  useEffect(() => {
    debouncedUpdateOtherFilters();
  }, [localForm.minRent, localForm.maxRent, localForm.propertyType, localForm.area, localForm.beds, localForm.bathroom, localForm.apartmentType, debouncedUpdateOtherFilters]);

  // Sync local form with URL params when they change externally (simplified logic)
  useEffect(() => {
    setLocalForm(prev => {
      const newFormData = {
        location: currentFilters.location || "",
        minRent: currentFilters.minRent || 10000,
        maxRent: currentFilters.maxRent || 32000,
        categories: categoryValues,
        propertyType: currentFilters.propertyType || "",
        area: currentFilters.area || "",
        beds: currentFilters.bedrooms?.toString() || "",
        bathroom: currentFilters.bathroom?.toString() || "",
        apartmentType: currentFilters.apartmentType || "",
        bathroom2: prev.bathroom2,
      };

      // Only update if there's actually a meaningful change
      const hasLocationChange = prev.location !== newFormData.location;
      const hasRentChange = prev.minRent !== newFormData.minRent || prev.maxRent !== newFormData.maxRent;
      const hasTypeChange = prev.propertyType !== newFormData.propertyType;
      const hasAreaChange = prev.area !== newFormData.area;
      const hasBedsChange = prev.beds !== newFormData.beds;
      const hasBathroomChange = prev.bathroom !== newFormData.bathroom;
      const hasApartmentTypeChange = prev.apartmentType !== newFormData.apartmentType;
      const hasCategoriesChange = JSON.stringify(prev.categories) !== JSON.stringify(newFormData.categories);

      if (hasLocationChange || hasRentChange || hasTypeChange || hasAreaChange || hasBedsChange || hasBathroomChange || hasApartmentTypeChange || hasCategoriesChange) {
        setSliderValue([newFormData.minRent, newFormData.maxRent]);
        return newFormData;
      }
      
      return prev;
    });
  }, [currentFilters.location, currentFilters.minRent, currentFilters.maxRent, currentFilters.propertyType, currentFilters.area, currentFilters.bedrooms, currentFilters.bathroom, currentFilters.apartmentType, categoryValues]);

  // Generic handleChange for text/select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Separate handler for location input with debounced API call
  const debouncedLocationUpdate = useDebouncedCallback((...args: unknown[]) => {
    const locationValue = args[0] as string;
    if (locationValue?.trim()) {
      const locationFilters: Partial<PropertyFilters> = {
        location: locationValue.trim(),
      };
      
      updateFilters(locationFilters, true);
      onFiltersChange?.(locationFilters as PropertyFilters);
    } else {
      // If location is cleared, update filters to remove location
      const clearedLocationFilters: Partial<PropertyFilters> = {
        location: undefined,
      };
      
      updateFilters(clearedLocationFilters, true);
      onFiltersChange?.(clearedLocationFilters as PropertyFilters);
    }
  }, 500);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Trigger debounced update
    debouncedLocationUpdate(value);
  };

  // Handle slider change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderValue(newValue);
      setLocalForm((prev) => ({
        ...prev,
        minRent: newValue[0],
        maxRent: newValue[1],
      }));
    }
  };

  // Handle category toggle with URL params (multi-select support)
  const handleCategoryToggle = (category: string) => {
    const isSelected = localForm.categories.includes(category);
    // For multi-select: if clicking a selected category, remove it; otherwise add it
    const newCategories = isSelected 
      ? localForm.categories.filter(c => c !== category)
      : [...localForm.categories, category];
    
    setLocalForm((prev) => ({
      ...prev,
      categories: newCategories,
    }));
    
    // Update URL with new category values (multiple values supported)
    updateCategoryValues(newCategories);
    
    // Create a complete filter object for the callback
    const categoryFilters: Partial<PropertyFilters> = {};
    
    // Set the appropriate filter based on categoryType (array or undefined)
    if (categoryType === 'tenantType') {
      categoryFilters.tenantType = newCategories.length > 0 ? 
        (newCategories.length === 1 ? newCategories[0] as PropertyFilters['tenantType'] : newCategories as PropertyFilters['tenantType']) : 
        undefined;
    } else if (categoryType === 'furnishingStatus') {
      categoryFilters.furnishingStatus = newCategories.length > 0 ? 
        (newCategories.length === 1 ? newCategories[0] as PropertyFilters['furnishingStatus'] : newCategories as PropertyFilters['furnishingStatus']) : 
        undefined;
    }
    
    // Include all current filter values to ensure complete state
    categoryFilters.minRent = localForm.minRent !== 10000 ? localForm.minRent : undefined;
    categoryFilters.maxRent = localForm.maxRent !== 32000 ? localForm.maxRent : undefined;
    categoryFilters.propertyType = localForm.propertyType ? (localForm.propertyType as PropertyFilters['propertyType']) : undefined;
    categoryFilters.area = localForm.area || undefined;
    categoryFilters.bedrooms = localForm.beds ? (localForm.beds.includes('+') ? localForm.beds : parseInt(localForm.beds, 10)) : undefined;
    categoryFilters.bathroom = localForm.bathroom ? (localForm.bathroom.includes('+') ? localForm.bathroom : parseInt(localForm.bathroom, 10)) : undefined;
    categoryFilters.apartmentType = localForm.apartmentType || undefined;
    
    // Notify parent component with complete filter state
    onFiltersChange?.(categoryFilters as PropertyFilters);
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 text-Arambo-Black shadow-sm border border-gray-200">
      <p className="font-semibold h6 sm:h5 mb-3 sm:mb-4">Search by Location</p>
      <div className="bg-Arambo-Background rounded-lg flex items-center w-full p-3 sm:p-4">
        <Search className="text-Arambo-Black flex-shrink-0" size={18} />
        <input
          type="text"
          name="location"
          value={localForm.location}
          onChange={handleLocationChange}
          placeholder="Search by location..."
          className="flex-1 pl-2 bg-transparent text-Arambo-Black placeholder-Arambo-Text outline-none text-sm sm:text-base min-w-0"
        />
      </div>

      <hr className="text-Arambo-Border my-3 sm:my-4" />

      {/* Filter by Rent */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <p className="font-semibold h6 sm:h5">Filter by rent</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            name="minRent"
            placeholder="Min"
            value={localForm.minRent}
            onChange={handleChange}
            className="w-20 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
          />
          <input
            type="text"
            name="maxRent"
            placeholder="Max"
            value={localForm.maxRent}
            onChange={handleChange}
            className="w-20 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
          />
        </div>

        {/* Slider */}
        <Slider
          getAriaLabel={() => "Price range"}
          value={sliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={0}
          max={32000}
          step={1}
          className="text-Arambo-Accent"
        />

        <hr className="text-Arambo-Background my-3 sm:my-4" />
      </div>
      {/* Select Category by Rent */}
      <div className="flex flex-col space-y-4">
        <p className="font-semibold text-lg mb-4">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = localForm.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className={`py-3 px-6 rounded-full duration-400 ${isSelected
                  ? "bg-Arambo-Accent text-Arambo-White"
                  : "bg-Arambo-Background text-Arambo-Black hover:bg-Arambo-Accent hover:text-Arambo-White"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <hr className="text-Arambo-Background my-4" />
      </div>
      <div>
        <p className="font-semibold h6 sm:h5 mb-3 sm:mb-4">Filter by rent</p>
        <div className="space-y-4 sm:space-y-5">
          {/* Property Type & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormSelect
              label="Property Type"
              name="propertyType"
              value={localForm.propertyType}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "Apartment", label: "Apartment" },
                { value: "House", label: "House" },
                { value: "Villa", label: "Villa" },
              ]}
            />

            <FormSelect
              label="Area"
              name="area"
              value={localForm.area}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "Aftabnagar", label: "Aftabnagar" },
                { value: "Banani", label: "Banani" },
                { value: "Banani DOHs", label: "Banani DOHs" },
                { value: "Banashree", label: "Banashree" },
                { value: "Banasree", label: "Banasree" },
                { value: "Baridhara DOHs", label: "Baridhara DOHs" },
                { value: "Baridhara J Block", label: "Baridhara J Block" },
                { value: "Bashundhara Residential", label: "Bashundhara Residential" },
                { value: "Dhanmondi", label: "Dhanmondi" },
                { value: "DIT & Merul Badda", label: "DIT & Merul Badda" },
                { value: "Greenroad", label: "Greenroad" },
                { value: "Gudaraghat", label: "Gudaraghat" },
                { value: "Gulshan 1", label: "Gulshan 1" },
                { value: "Gulshan 2", label: "Gulshan 2" },
                { value: "Lalmatia", label: "Lalmatia" },
                { value: "Middle Badda", label: "Middle Badda" },
                { value: "Mirpur DOHs", label: "Mirpur DOHs" },
                { value: "Mohakhali Amtoli", label: "Mohakhali Amtoli" },
                { value: "Mohakhali DOHs", label: "Mohakhali DOHs" },
                { value: "Mohakhali TB Gate", label: "Mohakhali TB Gate" },
                { value: "Mohakhali Wireless", label: "Mohakhali Wireless" },
                { value: "Mohanagar Project", label: "Mohanagar Project" },
                { value: "Niketan", label: "Niketan" },
                { value: "Nikunja 1", label: "Nikunja 1" },
                { value: "Nikunja 2", label: "Nikunja 2" },
                { value: "North Badda", label: "North Badda" },
                { value: "Notun Bazar", label: "Notun Bazar" },
                { value: "Shahjadpur Beside & near Suvastu", label: "Shahjadpur Beside & near Suvastu" },
                { value: "Shahjadpur Lakeside", label: "Shahjadpur Lakeside" },
                { value: "Shanti Niketan", label: "Shanti Niketan" },
                { value: "South Badda", label: "South Badda" },
                { value: "South Banasree", label: "South Banasree" },
                { value: "Uttara Sector 1", label: "Uttara Sector 1" },
                { value: "Uttara Sector 2", label: "Uttara Sector 2" },
                { value: "Uttara Sector 3", label: "Uttara Sector 3" },
                { value: "Uttara Sector 4", label: "Uttara Sector 4" },
                { value: "Uttara Sector 5", label: "Uttara Sector 5" },
                { value: "Uttara Sector 6", label: "Uttara Sector 6" },
                { value: "Uttara Sector 7", label: "Uttara Sector 7" },
                { value: "Uttara Sector 8", label: "Uttara Sector 8" },
                { value: "Uttara Sector 9", label: "Uttara Sector 9" },
                { value: "Uttara Sector 10", label: "Uttara Sector 10" },
                { value: "Uttara Sector 11", label: "Uttara Sector 11" },
                { value: "Uttara Sector 12", label: "Uttara Sector 12" },
                { value: "Uttara Sector 13", label: "Uttara Sector 13" },
                { value: "Uttara Sector 14", label: "Uttara Sector 14" },
                { value: "Uttara Sector 15", label: "Uttara Sector 15" },
                { value: "Uttara Sector 16", label: "Uttara Sector 16" },
                { value: "Uttara Sector 17", label: "Uttara Sector 17" },
                { value: "Uttara Sector 18", label: "Uttara Sector 18" },
              ]}
            />
          </div>

          {/* Beds & Bathroom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormSelect
              label="Beds"
              name="beds"
              value={localForm.beds}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "1", label: "1 Bed" },
                { value: "2", label: "2 Beds" },
                { value: "3", label: "3 Beds" },
                { value: "4+", label: "4+ Beds" },
              ]}
            />

            <FormSelect
              label="Bathrooms"
              name="bathroom"
              value={localForm.bathroom}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "1", label: "1 Bath" },
                { value: "2", label: "2 Baths" },
                { value: "3+", label: "3+ Baths" },
              ]}
            />
          </div>

          {/* Apt. Type & Bathroom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormSelect
              label="Apt. Type"
              name="apartmentType"
              value={localForm.apartmentType}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "studio", label: "Studio" },
                { value: "duplex", label: "Duplex" },
                { value: "penthouse", label: "Penthouse" },
              ]}
            />

            <FormSelect
              label="Bathrooms"
              name="bathroom2"
              value={localForm.bathroom2}
              onChange={handleChange}
              options={[
                { value: "", label: "Any" },
                { value: "1", label: "1 Bath" },
                { value: "2", label: "2 Baths" },
                { value: "3", label: "3+ Baths" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
