import { Metadata } from 'next';
import { propertyService } from '@/lib/api';
import { Property } from '@/types/property';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  try {
    const property = await propertyService.getPropertyById(params.id);
    
    const price = property.rent 
      ? `₹${property.rent.toLocaleString()}${property.category === 'rent' ? '/month' : ''}`
      : 'Price on request';
    
    return {
      title: `${property.propertyName} - ${property.location} | Arambo`,
      description: `${property.propertyType} for ${property.category} in ${property.location}. ${property.bedrooms} bedrooms, ${property.bathroom} bathrooms, ${property.size} sq ft. ${price}`,
      keywords: [
        property.propertyType,
        property.category,
        property.location,
        property.area,
        'property',
        'real estate',
        'arambo'
      ].filter(Boolean).join(', '),
      openGraph: {
        title: property.propertyName,
        description: `${property.propertyType} for ${property.category} in ${property.location}`,
        images: property.coverImage ? [{ url: property.coverImage }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: property.propertyName,
        description: `${property.propertyType} for ${property.category} in ${property.location}`,
        images: property.coverImage ? [property.coverImage] : [],
      },
    };
  } catch {
    return {
      title: 'Property Not Found | Arambo',
      description: 'The property you are looking for could not be found.',
    };
  }
}

// Server Component for property details
export default async function PropertyDetailsPage({ params }: PropertyPageProps) {
  let property: Property;
  
  try {
    property = await propertyService.getPropertyById(params.id);
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }

  const formatPrice = (price: number | undefined, category: string): string => {
    if (!price) return 'Price on request';
    const formattedPrice = price.toLocaleString();
    if (category === 'rent') {
      return `₹${formattedPrice}/month`;
    }
    return `₹${formattedPrice}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Residence",
    "name": property.propertyName,
    "description": property.notes || `${property.propertyType} for ${property.category} in ${property.location}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.area || property.location,
      "addressRegion": property.location,
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathroom,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.size,
      "unitCode": "SQF"
    },
    "offers": {
      "@type": "Offer",
      "price": property.rent || 0,
      "priceCurrency": "INR",
      "availability": property.inventoryStatus === 'Available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "image": property.coverImage,
    "datePosted": property.createdAt,
    "dateModified": property.updatedAt
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-96 bg-gray-200">
          {property.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={property.coverImage}
              alt={property.propertyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link href="/residential" className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              ← Back to Properties
            </Link>
          </div>

          {/* Property Status Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium capitalize">
              For {property.category}
            </span>
          </div>

          {/* Verified Badge */}
          {property.isConfirmed && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>✓</span>
                <span>Verified by Arambo</span>
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.propertyName}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>{property.location}</span>
                  </span>
                  {property.area && (
                    <span className="flex items-center space-x-1">
                      <span>🏘️</span>
                      <span>{property.area}</span>
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(property.rent, property.category)}
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Property Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🛏️</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🚿</div>
                    <div className="font-semibold">{property.bathroom}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📐</div>
                    <div className="font-semibold">{property.size}</div>
                    <div className="text-sm text-gray-600">sq ft</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🏗️</div>
                    <div className="font-semibold">{property.yearOfConstruction || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Built</div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium capitalize">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnishing:</span>
                      <span className="font-medium">{property.furnishingStatus || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balcony:</span>
                      <span className="font-medium">{property.baranda ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Elevator:</span>
                      <span className="font-medium">{property.lift ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor:</span>
                      <span className="font-medium">
                        {property.floor ? `${property.floor}` : 'N/A'}
                        {property.totalFloor ? ` of ${property.totalFloor}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Owner:</span>
                      <span className="font-medium">{property.firstOwner ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available From:</span>
                      <span className="font-medium">{formatDate(property.availableFrom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{property.inventoryStatus || 'Available'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {property.notes && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <p className="text-gray-700 leading-relaxed">{property.notes}</p>
                </div>
              )}

              {/* Ratings */}
              {(property.cleanHygieneScore || property.sunlightScore || property.bathroomConditionsScore) && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Property Ratings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {property.cleanHygieneScore && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{property.cleanHygieneScore}/10</div>
                        <div className="text-sm text-gray-600">Cleanliness & Hygiene</div>
                      </div>
                    )}
                    {property.sunlightScore && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{property.sunlightScore}/10</div>
                        <div className="text-sm text-gray-600">Sunlight</div>
                      </div>
                    )}
                    {property.bathroomConditionsScore && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{property.bathroomConditionsScore}/10</div>
                        <div className="text-sm text-gray-600">Bathroom Conditions</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Owner */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">{property.name}</div>
                    <div className="text-gray-600">{property.email}</div>
                    <div className="text-gray-600">{property.phone}</div>
                  </div>
                  <a 
                    href={`tel:${property.phone}`}
                    className="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Contact Owner
                  </a>
                  <a 
                    href={`mailto:${property.email}?subject=Property Inquiry: ${property.propertyName}`}
                    className="block w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
                  >
                    Schedule Visit
                  </a>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Property Information</h3>
                <div className="space-y-3 text-sm">
                  {property.houseId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">House ID:</span>
                      <span className="font-medium">{property.houseId}</span>
                    </div>
                  )}
                  {property.listingId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listing ID:</span>
                      <span className="font-medium">{property.listingId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed:</span>
                    <span className="font-medium">{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(property.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {property.category === 'rent' && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="font-medium">₹{property.rent?.toLocaleString()}</span>
                    </div>
                    {property.serviceCharge && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">₹{property.serviceCharge.toLocaleString()}</span>
                      </div>
                    )}
                    {property.advanceMonths && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advance:</span>
                        <span className="font-medium">{property.advanceMonths} months</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total Monthly:</span>
                      <span>₹{((property.rent || 0) + (property.serviceCharge || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}