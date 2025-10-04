import Link from "next/link";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

// Helper function to format price
const formatPrice = (price: number): string => {
  // Format number with commas
  const formattedPrice = price.toLocaleString();
  
  // Add currency symbol
  return `৳${formattedPrice}`;
};

// Helper function to get property link
const getPropertyLink = (property: Property): string => {
  return `/properties/${property.id}`;
};

export function PropertyCard({ property }: PropertyCardProps) {
  // Extract properties
  const image = property.coverImage || "/building.png";
  
  const price = formatPrice(property.rent || 0);
  
  const propertyType = property.listingType;

  const area = property.area;

  const beds = property.bedrooms;
  
  const baths = property.bathroom;
  
  const sqft = property.size;

  return (
    <Link
      href={getPropertyLink(property)}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
    >
      <div className="relative overflow-hidden transition-transform">
        <img
          src={image}
          alt={property.propertyName}
          className="w-full group-hover:scale-105 transition-all aspect-[396/302] object-cover"
        />

        {property.isVerified && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-[#1946BB] text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center justify-start gap-1 sm:gap-1.5">
              <img
                src={"/commercial/verified.svg"}
                alt="Verified"
                className="w-3 h-3 sm:w-4 sm:h-4"
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
            <span className="text-Arambo-Text body-sm sm:body-md min-w-0" title={area}>
              {area}
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
      </div>
    </Link>
  );
}