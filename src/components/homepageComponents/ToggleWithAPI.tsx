"use client";
import React, { useState } from "react";
import { PropertyCard } from "../PropertyCardSimple";
import Link from "next/link";
import { useProperties } from "@/hooks/useProperties";
import { PropertyListSkeleton } from "@/components/ui/LoadingComponents";
import { ErrorMessage, EmptyState } from "@/components/ui/ErrorComponents";

const ToggleWithAPI = () => {
  const [isResidential, setIsResidential] = useState(true);
  
  // Fetch residential properties
  const { 
    properties: residentialProperties, 
    error: residentialError, 
    isLoading: residentialLoading 
  } = useProperties({
    page: 1,
    limit: 9,
    propertyCategory: 'Residential'
  });
  
  // Fetch commercial properties
  const { 
    properties: commercialProperties, 
    error: commercialError, 
    isLoading: commercialLoading 
  } = useProperties({
    page: 1,
    limit: 9,
    propertyCategory: 'Commercial'
  });

  // Get current properties based on toggle state
  const currentProperties = isResidential ? residentialProperties : commercialProperties;
  const currentError = isResidential ? residentialError : commercialError;
  const currentLoading = isResidential ? residentialLoading : commercialLoading;
  
  // Show up to 6 properties for the homepage
  const displayProperties = currentProperties.slice(0, 6);

  return (
    <div className="flex flex-col w-full max-w-[1200px] px-2 md:px-0 space-y-15">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="h2">Explore Latest Properties to Buy</h2>
        <div className="bg-Arambo-Border rounded-full p-1 space-x-1 flex items-center justify-center h-fit">
          <button
            onClick={() => setIsResidential(true)}
            className={`${isResidential
              ? "bg-Arambo-Accent text-Arambo-White "
              : "text-Arambo-Black bg-Arambo-Border"
              } py-3 px-5 rounded-full transition-all duration-200`}
          >
            Residential
          </button>
          <button
            onClick={() => setIsResidential(false)}
            className={`${!isResidential
              ? "bg-Arambo-Accent text-Arambo-White "
              : "text-Arambo-Black bg-Arambo-Border"
              } py-3 px-5 rounded-full transition-all duration-200`}
          >
            Commercial
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        {currentLoading ? (
          <PropertyListSkeleton />
        ) : currentError ? (
          <ErrorMessage message={currentError} />
        ) : displayProperties.length === 0 ? (
          <EmptyState 
            title={`No ${isResidential ? 'residential' : 'commercial'} properties found`}
            description="Check back later or try adjusting your search criteria."
          />
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
            {displayProperties.map((property, i) => (
              <PropertyCard key={property.id || i} property={property} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link 
          href={isResidential ? "/residential" : "/commercial"} 
          className="flex space-x-2 hover:underline transition-all duration-200"
        >
          <span>See all listings</span>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2485_3135)">
              <path
                d="M21.1601 17C20.2893 18.5083 19.0396 19.7629 17.5348 20.6398C16.03 21.5167 14.3223 21.9854 12.5808 21.9994C10.8392 22.0135 9.12415 21.5725 7.60541 20.72C6.08667 19.8676 4.81689 18.6332 3.92179 17.1392C3.02668 15.6452 2.53728 13.9434 2.50204 12.2021C2.4668 10.4608 2.88694 8.74055 3.72086 7.21155C4.55479 5.68256 5.77358 4.39787 7.25659 3.48467C8.7396 2.57146 10.4354 2.06141 12.1761 2.005L12.5001 2L12.8241 2.005C14.5511 2.061 16.2341 2.56355 17.7091 3.46364C19.1841 4.36373 20.4007 5.63065 21.2402 7.14089C22.0798 8.65113 22.5137 10.3531 22.4997 12.081C22.4856 13.8089 22.0241 15.5036 21.1601 17ZM17.5001 12.02L17.4901 11.857L17.4741 11.771L17.4291 11.629L17.3751 11.516L17.3321 11.446L17.2611 11.351L17.2071 11.293L13.2071 7.293L13.1131 7.21C12.9121 7.05459 12.6595 6.98151 12.4066 7.0056C12.1537 7.02969 11.9194 7.14916 11.7514 7.33972C11.5833 7.53029 11.4941 7.77767 11.5019 8.03162C11.5096 8.28557 11.6138 8.52704 11.7931 8.707L14.0861 11L8.50011 11L8.38311 11.007C8.13001 11.0371 7.89796 11.1627 7.73437 11.3582C7.57078 11.5536 7.488 11.8042 7.50294 12.0586C7.51787 12.313 7.6294 12.5522 7.81474 12.7272C8.00008 12.9021 8.24523 12.9997 8.50011 13L14.0851 13L11.7931 15.293L11.7101 15.387C11.5547 15.588 11.4816 15.8406 11.5057 16.0935C11.5298 16.3464 11.6493 16.5807 11.8398 16.7488C12.0304 16.9168 12.2778 17.006 12.5317 16.9982C12.7857 16.9905 13.0271 16.8863 13.2071 16.707L17.2071 12.707L17.2801 12.625L17.3441 12.536L17.4061 12.423L17.4401 12.342L17.4741 12.229L17.4941 12.117L17.5001 12.019L17.5001 12.02Z"
                fill="#1946BB"
              />
            </g>
            <defs>
              <clipPath id="clip0_2485_3135">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ToggleWithAPI;