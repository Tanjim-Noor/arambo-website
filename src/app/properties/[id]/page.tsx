"use client";

import { useProperty, usePropertySearch } from '@/hooks/useProperties';
import { PropertyDetailsSkeleton } from '@/components/ui/LoadingComponents';
import { ErrorMessage, NotFoundError } from '@/components/ui/ErrorComponents';
import { Property } from '@/types/property';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import PropertySingleSwiperAPI from "@/components/PropertySingleSwiperAPI";
import PropertyDetailsCard from "@/components/PropertyDetailsContent";
import { PropertyCard } from "@/components/PropertyCardSimple";
import EstimateHistory from '@/components/EstimateHistory';
import { MapViewer } from '@/components/MapViewer';

interface PropertyDetailsContentProps {
  propertyId: string;
}

// Similar Properties Component
interface SimilarPropertiesProps {
  currentProperty: Property;
}

const SimilarProperties = ({ currentProperty }: SimilarPropertiesProps) => {
  // Determine the property category, defaulting to 'Residential' if not available
  const propertyCategory = currentProperty.propertyCategory || 'Residential';
  
  // Create filters for similar properties
  const similarFilters = {
    propertyCategory,
    limit: 3,
    page: 1,
  };

  const { properties: similarProperties, isLoading, error } = usePropertySearch(similarFilters);

  // Filter out the current property from similar properties
  const filteredProperties = similarProperties.filter(property => property.id !== currentProperty.id);
  
  // Take only first 3 properties
  const displayProperties = filteredProperties.slice(0, 3);

  // Determine the route based on property category
  const exploreRoute = propertyCategory === 'Commercial' ? '/commercial' : '/residential';

  if (isLoading) {
    return (
      <section className="mt-12 sm:mt-16 lg:mt-20 py-16 sm:py-20 lg:py-28 bg-Arambo-White">
        <div className="max-w-[1222px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <h2 className="h2">View Similar Properties</h2>
            <Link
              href={exploreRoute}
              className="py-3 sm:py-4 px-6 sm:px-10 bg-Arambo-Accent text-white rounded-lg text-sm sm:text-base"
            >
              Explore Properties
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 sm:mt-10 lg:mt-12 gap-4 sm:gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full h-[302px] bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12 sm:mt-16 lg:mt-20 py-16 sm:py-20 lg:py-28 bg-Arambo-White">
        <div className="max-w-[1222px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <h2 className="h2">View Similar Properties</h2>
            <Link
              href={exploreRoute}
              className="py-3 sm:py-4 px-6 sm:px-10 bg-Arambo-Accent text-white rounded-lg text-sm sm:text-base"
            >
              Explore Properties
            </Link>
          </div>
          <div className="mt-8 sm:mt-10 lg:mt-12 text-center text-gray-500">
            <p>Unable to load similar properties at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 sm:mt-16 lg:mt-20 py-16 sm:py-20 lg:py-28 bg-Arambo-White">
      <div className="max-w-[1222px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <h2 className="h2">View Similar Properties</h2>
          <Link
            href={exploreRoute}
            className="py-3 sm:py-4 px-6 sm:px-10 bg-Arambo-Accent text-white rounded-lg text-sm sm:text-base"
          >
            Explore Properties
          </Link>
        </div>
        
        {displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 sm:mt-10 lg:mt-12 gap-4 sm:gap-6">
            {displayProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
            <p className="text-gray-500 mb-4">No similar properties found at the moment.</p>
            <Link
              href={exploreRoute}
              className="inline-block py-3 px-6 bg-Arambo-Accent text-white rounded-lg text-sm"
            >
              Browse All Properties
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

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

interface PropertyDetailsViewProps {
  property: Property;
}

const PropertyDetailsView = ({ property }: PropertyDetailsViewProps) => {
  const formatPrice = (price: number | undefined, category: string): string => {
    if (!price) return 'Price on request';
    const formattedPrice = price.toLocaleString();
    if (category === 'rent') {
      return `৳${formattedPrice}/month`;
    }
    return `৳${formattedPrice}`;
  };

  return (
    <>
      <section className="w-full py-4 sm:py-6 lg:py-8">
        <PropertySingleSwiperAPI property={property} />
      </section>

      <section className="mt-6 sm:mt-8 lg:mt-10 max-w-[1222px] mx-auto px-3 sm:px-4 lg:px-6">
        {/* Property Heading Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-3 w-full">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-2">
                  <Image src="/about/location.svg" alt="" width={16} height={16} />
                  <p className="p-base text-Arambo-Text">{property.area}</p>
                </div>
                <div className="py-2 sm:py-2.5 px-3 sm:px-[15px] rounded-full bg-Arambo-Accent/10 text-Arambo-Accent caption-14 font-medium w-fit">
                  {property.listingType}
                </div>
              </div>
              <h3 className="h3">{property.propertyName}</h3>
              <p className="p-base text-black/64">
                {property.area ? `${property.area}, ${property.location}` : property.location}
              </p>
            </div>
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 items-center lg:items-end justify-between lg:justify-start">
              <div className="flex items-center gap-3 lg:mb-3 order-2 lg:order-1">
                <button className="border border-Arambo-Border rounded-full">
                  <Image
                    className="rounded-full p-2  bg-Arambo-White"
                    src="/property-single/heart.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </button>
                <button className="cursor-pointer flex py-2 px-3 rounded-[10px] border border-Arambo-Border bg-Arambo-White gap-2.5">
                  <Image src="/property-single/share.svg" alt="" width={16} height={16} />
                  <p className="text-sm text-Arambo-Black font-semibold">Share</p>
                </button>
              </div>
              <div className="flex flex-col items-start lg:items-end order-1 lg:order-2">
                <p className="caption-12 text-Arambo-Text">Best price at</p>
                <h3 className="text-Arambo-Accent h3">{formatPrice(property.rent, property.category)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content + Agent Card */}
        <div className=" gap-8 sm:gap-10 lg:gap-12 grid items-start grid-cols-1 xl:grid-cols-3">
          {/* Left Content */}
          <div className="flex-1 lg:col-span-2 flex flex-col gap-8 sm:gap-10 lg:gap-12 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Area */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="text-xs text-gray-500 uppercase">Area</span>
                <div className="flex gap-2 sm:gap-2.5 items-center">
                  <Image
                    className="p-2 sm:p-3 bg-Arambo-White rounded-lg flex-shrink-0"
                    src="/property-single/area.svg"
                    alt=""
                    width={48}
                    height={48}
                  />
                  <p className="text-Arambo-Accent font-semibold text-lg sm:text-xl">{property.size} sqft</p>
                </div>
              </div>

              {/* Bedroom */}
              <PropertyDetailsCard
                label="Bedroom"
                src="/property-single/bed.svg"
                content={property.bedrooms?.toString() || "0"}
              />

              {/* Bathroom */}
              <PropertyDetailsCard
                label="Bathroom"
                src="/property-single/bathroom.svg"
                content={property.bathroom?.toString() || "0"}
              />

              {/* Balcony */}
              <PropertyDetailsCard
                label="Balcony"
                src="/property-single/parking.svg"
                content={property.baranda ? "Available" : "Not Available"}
              />

              {/* Type */}
              <PropertyDetailsCard
                label="Type"
                src="/property-single/apartment.svg"
                content={property.propertyType}
              />

              {/* Built-in Year */}
              <PropertyDetailsCard
                label="Built-in year"
                src="/property-single/calendar.svg"
                content={property.yearOfConstruction?.toString() || "N/A"}
              />
            </div>

            {/* Overview */}
            <div>
              <h4 className="mb-3 sm:mb-4 h4 text-Arambo-Black">Overview</h4>
              <p className="p-base text-Arambo-Text mb-3 sm:mb-4">
                {property.notes || `A ${property.propertyType.toLowerCase()} in ${property.location}. This property features ${property.bedrooms} bedrooms and ${property.bathroom} bathrooms with ${property.size} sq ft of living space.`}
              </p>
              {property.furnishingStatus && (
                <p className="p-base text-Arambo-Text">
                  Furnishing: {property.furnishingStatus}. 
                  {property.baranda && " Includes balcony."}
                  {property.lift && " Elevator access available."}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <h4 className="mb-3 sm:mb-4 h4 text-Arambo-Black">Amenities</h4>
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2.5">
                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                      <h3 className="label-16 mb-2 font-medium">Features</h3>
                      <ul className="space-y-1 sm:space-y-2 list-disc list-inside label-16">
                        {property.baranda && <li>Balcony</li>}
                        {property.lift && <li>Elevator</li>}
                        {property.firstOwner && <li>First Owner Property</li>}
                        <li>Furnished: {property.furnishingStatus || "Not specified"}</li>
                        {property.totalFloor && <li>Floor: {property.floor} of {property.totalFloor}</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="label-16 mb-2 font-medium">Facilities</h3>
                      <ul className="space-y-1 sm:space-y-2 list-disc list-inside label-16">
                        {property.cctv && <li>CCTV</li>}
                        {property.communityHall && <li>Community Hall</li>}
                        {property.gym && <li>Gym</li>}
                        {property.masjid && <li>Masjid</li>}
                        {property.parking && <li>Parking</li>}
                        {property.petsAllowed && <li>Pets Allowed</li>}
                        {property.swimmingPool && <li>Swimming Pool</li>}
                        {property.trainedGuard && <li>Trained Security</li>}
                      </ul>
                    </div>

                    {(property.cleanHygieneScore || property.sunlightScore || property.bathroomConditionsScore) && (
                      <div>
                        <h3 className="label-16 mb-2 font-medium">Quality Ratings</h3>
                        <ul className="space-y-1 sm:space-y-2 list-disc list-inside label-16">
                          {property.cleanHygieneScore && <li>Cleanliness: {property.cleanHygieneScore}/10</li>}
                          {property.sunlightScore && <li>Sunlight: {property.sunlightScore}/10</li>}
                          {property.bathroomConditionsScore && <li>Bathroom Quality: {property.bathroomConditionsScore}/10</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div>
                      <h3 className="label-16 mb-2 font-medium">Property Details</h3>
                      <ul className="space-y-1 sm:space-y-2 list-disc list-inside label-16">
                        <li>Floor: {property.floor || "Not specified"}</li>
                        <li>Status: {property.inventoryStatus || "Available"}</li>
                        {property.houseId && <li>House ID: {property.houseId}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between items-center text-sm font-medium cursor-pointer">
                <h4 className="mb-3 sm:mb-4 text-Arambo-Black h4">Location</h4>
                <button className="underline text-Arambo-Accent text-sm">
                  View on maps
                </button>
              </div>
              <MapViewer lat={property.latitude} lng={property.longitude} />
            </div>

            {/* Estimate History */}
            
            <div>
              <h4 className="mb-3 sm:mb-4 text-Arambo-Black h4">
                Property Value History
              </h4>
              <EstimateHistory property={property} />
            </div>
           
          </div>

          {/* Right Agent Card */}
          <div className="w-full mx-auto max-w-[386px] lg:flex-shrink-0">
            <div className="bg-Arambo-White rounded-xl shadow border flex flex-col gap-8 border-Arambo-Border p-4 sm:px-6 sm:py-8 justify-between h-full">
              {/* Agent Profile */}
              <div className="flex items-center gap-5">
                <div className="w-22 h-22 rounded-full bg-Arambo-White border-2 border-Arambo-Border flex items-center justify-center p-2">
                  <Image
                    src="/Logo.svg"
                    alt="Arambo Logo"
                    className="w-full h-full object-contain"
                    width={80}
                    height={80}
                  />
                </div>
                <div>
                  <h4 className="font-semibold h4 text-Arambo-Black mb-2">
                    Arambo
                  </h4>
                </div>
              </div>

              {/* Message */}
              <div className="">
                <h5 className="font-semibold h5 text-Arambo-Black mb-2">
                  Message
                </h5>
                <p className="text-sm text-Arambo-Text leading-relaxed">
                  Hello from Arambo! Thanks for viewing this property. If you feel
                  like this property is what you need or you have a similar
                  interest, feel free to contact us.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button className="bg-Arambo-Background flex justify-center items-center flex-1 text-gray-800 px-4 py-3 rounded-md font-medium transition">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <SimilarProperties currentProperty={property} />
    </>
  );
};

const PropertySinglePageNew = () => {
  const params = useParams();
  const propertyId = params.id as string;

  if (!propertyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          title="Invalid Property"
          message="No property ID provided. Please select a property from the listings."
          onRetry={() => window.location.href = '/residential'}
        />
      </div>
    );
  }

  return <PropertyDetailsContent propertyId={propertyId} />;
};

export default PropertySinglePageNew;