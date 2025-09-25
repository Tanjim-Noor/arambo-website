# PropertySingleSwiper API Integration

## Overview
This document outlines the API integration for the PropertySingleSwiper component, which displays property images in a carousel format on the property details page.

## Components Created/Modified

### 1. PropertySingleSwiperAPI.tsx
**Location**: `src/components/PropertySingleSwiperAPI.tsx`

**Purpose**: A new API-integrated version of the PropertySingleSwiper component that displays property images from the API data.

**Key Features**:
- Uses `property.coverImage` as the primary/first image
- Displays all images from `property.otherImages` array
- Handles empty image arrays with fallback placeholder
- Shows property category tag ("For Sale", "For Rent", etc.)
- Includes error handling for failed image loads
- Responsive design with navigation and pagination
- Only shows navigation buttons when there are multiple images

**Props Interface**:
```typescript
interface PropertySingleSwiperAPIProps {
  property: Property; // Full Property interface from API
}
```

### 2. Updated Properties Page
**Location**: `src/app/properties/[id]/page.tsx`

**Changes Made**:
- Imported the new `PropertySingleSwiperAPI` component
- Replaced the static `PropertySingleSwiper` with `PropertySingleSwiperAPI`
- Passes the full `property` object received from the `useProperty` hook
- Removed unused imports

## Data Flow

```
API Response (Property object)
├── coverImage?: string          → First image in carousel (with tag)
├── otherImages?: string[]       → Additional images in carousel  
├── category: Category           → Displayed on tag ("For Sale/Rent")
└── propertyName: string         → Used in alt text for accessibility
```

## API Integration Details

### Data Source
- Uses the `useProperty(propertyId)` hook from `src/hooks/useProperties.ts`
- Fetches property data from the API endpoint
- Property object includes `coverImage` and `otherImages` fields

### Image Handling
1. **Cover Image**: Used as the first slide if available
2. **Other Images**: Added as subsequent slides
3. **Fallback**: Uses placeholder if no images are available
4. **Error Handling**: Gracefully handles failed image loads
5. **Validation**: Filters out empty/invalid image URLs

### Tag Display Logic
- Shows "For [Category]" tag on the first image
- Category mapping: `Sale` → "Sale", `Rent` → "Rent", `Lease` → "Lease"
- Only first image shows the tag to avoid clutter

## Usage Example

```tsx
// In the property details page
const PropertyDetailsView = ({ property }: PropertyDetailsViewProps) => {
  return (
    <>
      <section className="w-full py-4 sm:py-6 lg:py-8">
        <PropertySingleSwiperAPI property={property} />
      </section>
      {/* Rest of the property details */}
    </>
  );
};
```

## API Data Structure Expected

```typescript
interface Property {
  // ... other fields
  coverImage?: string;           // Primary property image URL
  otherImages?: string[];        // Array of additional image URLs
  category: 'Sale' | 'Rent' | 'Lease' | 'Buy';
  propertyName: string;          // For accessibility
}
```

## Benefits of This Integration

1. **Dynamic Content**: Images are loaded from API instead of static files
2. **Better Performance**: Only loads actual property images
3. **Scalable**: Handles any number of images from the API
4. **Error Resilient**: Graceful fallbacks for missing/broken images
5. **SEO Friendly**: Proper alt text using property names
6. **Accessible**: Proper ARIA labels and semantic HTML

## Testing Scenarios

1. **Property with cover image + other images**: Should display all images
2. **Property with only cover image**: Should display cover image only
3. **Property with only other images**: Should display other images (first one gets tag)
4. **Property with no images**: Should display placeholder
5. **Property with broken image URLs**: Should handle errors gracefully

## Future Enhancements

1. **Image Lazy Loading**: Add lazy loading for performance
2. **Image Optimization**: Add different sizes for responsive images  
3. **Zoom Functionality**: Allow users to zoom into images
4. **Full Screen Gallery**: Add lightbox/modal view for images
5. **Image Preloading**: Preload next/previous images for smoother transitions