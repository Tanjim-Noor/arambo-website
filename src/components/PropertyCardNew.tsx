import Link from "next/link";
import { Property, LegacyProperty } from "@/types/property";

interface PropertyCardProps {
  property: Property | LegacyProperty;
}

// Type guard to check if property is new API format
const isNewProperty = (property: Property | LegacyProperty): property is Property => {
  return typeof property.id === 'string';
};

// Helper function to format price
const formatPrice = (price: number | string, category?: string): string => {
  if (typeof price === 'string') {
    return price; // Legacy format
  }
  
  // Format number with commas
  const formattedPrice = price.toLocaleString();
  
  // Add currency and context
  if (category === 'rent') {
    return `৳${formattedPrice}/month`;
  }
  return `৳${formattedPrice}`;
};

// Helper function to get property link
const getPropertyLink = (property: Property | LegacyProperty): string => {
  if (isNewProperty(property)) {
    return `/properties/${property.id}`;
  }
  return `/property-single?id=${property.id}`;
};

export function PropertyCard({ property }: PropertyCardProps) {
  // Extract common properties with fallbacks
  const image = isNewProperty(property) 
    ? property.coverImage || "/placeholder.svg?height=302&width=396&query=modern apartment interior"
    : property.image || "/placeholder.svg?height=302&width=396&query=modern apartment interior";
  
  const price = isNewProperty(property) 
    ? formatPrice(property.rent || 0, property.category)
    : property.price;
  
  const propertyType = isNewProperty(property) 
    ? property.propertyType 
    : property.type;
  
  const location = property.location;
  
  const beds = isNewProperty(property) 
    ? property.bedrooms 
    : property.beds;
  
  const baths = isNewProperty(property) 
    ? property.bathroom 
    : property.baths;
  
  const sqft = isNewProperty(property) 
    ? property.size 
    : property.sqft;
  
  const isVerified = isNewProperty(property) 
    ? property.isConfirmed 
    : property.isVerified;
  
  const forSale = isNewProperty(property) 
    ? property.category === 'sale' 
    : property.forSale;

  return (
    <Link
      href={getPropertyLink(property)}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
    >
      <div className="relative overflow-hidden transition-transform">
        <img
          src={image}
          alt={isNewProperty(property) ? property.propertyName : "Property"}
          className="w-full group-hover:scale-105 transition-all aspect-[396/302] object-cover"
        />

        {/* For Sale/Rent Badge */}
        {(forSale || isNewProperty(property)) && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-Arambo-White text-Arambo-Accent px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-gray-200">
            {isNewProperty(property) 
              ? `For ${property.category.charAt(0).toUpperCase() + property.category.slice(1)}`
              : forSale ? 'For Sale' : 'For Rent'
            }
          </div>
        )}

        {isVerified && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-[#1946BB] text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center justify-start gap-1 sm:gap-1.5">
              <img
                src={"/commercial/verified.svg"}
                className="w-3 h-3 sm:w-4 sm:h-4"
                alt="Verified"
              />
              <span className="text-xs sm:text-sm">Verified By Arambo</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        {/* Price and Type */}
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
            <div className="h4 font-bold text-Arambo-Accent min-w-0 flex-1">
              {!price.includes('৳') && <span className="font-bold">৳ </span>}
              {price}
            </div>
            <div className="text-xs sm:text-sm border border-Arambo-Border rounded-full text-Arambo-Text bg-gray-50 px-2 sm:px-3 py-1 whitespace-nowrap capitalize">
              {propertyType}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-3 sm:mb-4">
            <img
              src="/commercial/location.svg"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-Arambo-Text body-sm sm:body-md min-w-0" title={location}>
              {location}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center font-medium p-2 sm:p-3 bg-Arambo-Background rounded-xl text-Arambo-Black justify-between body-sm sm:body-md gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <img
              src="/commercial/bed.svg"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              {beds} Bed{beds !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <img
              src="/commercial/bath.svg"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              {baths} Bath{baths !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <img
              src="/commercial/sqft.svg"
              alt=""
              className="w-4 h-4 flex-shrink-0"
            />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              {sqft} sqft
            </span>
          </div>
        </div>

        {/* Additional info for new properties */}
        {isNewProperty(property) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              {property.area && (
                <span className="truncate">📍 {property.area}</span>
              )}
              {property.yearOfConstruction && (
                <span>🏗️ {property.yearOfConstruction}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}