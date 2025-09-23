# Arambo Website - API Integration Guide

## Overview

This guide documents the API integration implementation for the Arambo property website. The integration follows modern Next.js best practices with optimal SEO performance and user experience.

## Architecture Decision

After evaluation, we chose **Next.js Server Components + SWR** approach for the following reasons:

### ✅ Benefits
- **SEO Optimization**: Server Components provide excellent SEO as property listings are rendered server-side
- **Performance**: Fast initial page loads with server-side rendering
- **Infinite Scroll**: SWR handles client-side pagination and caching efficiently
- **Simplicity**: No complex state management setup required
- **Data Freshness**: SWR provides automatic revalidation and optimistic updates
- **TypeScript Support**: Full type safety throughout the application

### 🔄 Implementation Strategy
- **Server Components** for initial property listings and details pages (SEO-friendly)
- **SWR** for client-side infinite scroll, filtering, and real-time updates  
- **Axios** as HTTP client with proper error handling and interceptors
- **TypeScript** for complete type safety

## Project Structure

```
src/
├── types/
│   └── property.ts           # Property types and interfaces
├── lib/
│   └── api.ts               # API service layer with Axios config
├── hooks/
│   └── useProperties.ts     # SWR hooks for data fetching
├── components/
│   ├── ui/
│   │   ├── LoadingComponents.tsx
│   │   └── ErrorComponents.tsx
│   ├── PropertyCardNew.tsx   # Updated property card component
│   └── list-property/
│       └── FormNew.tsx      # Updated form with API integration
└── app/
    ├── residential/
    │   └── pageNew.tsx      # New residential page with API
    ├── properties/[id]/
    │   ├── page.tsx         # Client-side property details
    │   └── pageServer.tsx   # Server-side property details (SEO)
    └── list-property-form/
        └── page.tsx         # Form page
```

## Key Features Implemented

### 1. Type-Safe API Layer
- Complete TypeScript interfaces matching API documentation
- Centralized API service with error handling
- Request/response interceptors for logging and error management

### 2. Property Listings with Infinite Scroll
- Server-side initial rendering for SEO
- Client-side infinite scroll with SWR
- Loading states and error handling
- Filter integration

### 3. Property Form Submission
- Complete form validation
- API integration with error handling
- Success/error feedback
- Loading states

### 4. Property Details Page
- Server Components for SEO optimization
- Dynamic metadata generation
- Structured data for search engines
- Complete property information display

### 5. Error Handling & Loading States
- Comprehensive error boundaries
- Loading skeletons for better UX
- Network error handling
- 404 pages for missing properties

## API Endpoints Integrated

### Properties
- `GET /properties` - List properties with pagination and filters
- `GET /properties/:id` - Get single property details
- `POST /properties` - Create new property listing
- `PUT /properties/:id` - Update property listing

### Statistics
- `GET /properties/stats` - Get property statistics

### Health Check
- `GET /properties/health` - API health check

## Environment Configuration

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Usage Examples

### 1. Using Property Hooks

```tsx
import { useProperties } from '@/hooks/useProperties';

const PropertiesPage = () => {
  const { 
    properties, 
    total, 
    error, 
    isLoading, 
    hasMore, 
    loadMore 
  } = useProperties({
    propertyCategory: 'Residential',
    limit: 10
  });

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
};
```

### 2. Property Form Submission

```tsx
import { useCreateProperty } from '@/hooks/useProperties';

const PropertyForm = () => {
  const { createProperty } = useCreateProperty();

  const handleSubmit = async (formData) => {
    const { property, error } = await createProperty(formData);
    if (error) {
      // Handle error
    } else {
      // Success
    }
  };
};
```

### 3. Server Component for SEO

```tsx
// Server Component
export default async function PropertyPage({ params }) {
  const property = await propertyService.getPropertyById(params.id);
  
  return (
    <div>
      <h1>{property.propertyName}</h1>
      {/* Property details */}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const property = await propertyService.getPropertyById(params.id);
  
  return {
    title: `${property.propertyName} - ${property.location} | Arambo`,
    description: `${property.propertyType} for ${property.category}...`,
    // OpenGraph, Twitter cards, etc.
  };
}
```

## SEO Optimizations

### 1. Server-Side Rendering
- Initial property listings rendered on server
- Property details pages are server components
- Fast initial page loads and better SEO

### 2. Dynamic Metadata
- Property-specific titles and descriptions
- OpenGraph and Twitter card support
- Structured data (JSON-LD) for search engines

### 3. URL Structure
- SEO-friendly URLs: `/properties/[id]`
- Proper canonical URLs
- Breadcrumb navigation

## Performance Optimizations

### 1. Data Fetching
- SWR caching and deduplication
- Background revalidation
- Optimistic updates

### 2. Loading States
- Skeleton loaders for better perceived performance
- Progressive loading with infinite scroll
- Error boundaries for graceful degradation

### 3. Bundle Optimization
- Dynamic imports for code splitting
- Tree shaking for unused code
- Optimized images with Next.js Image component

## Error Handling Strategy

### 1. Network Errors
- Automatic retry with exponential backoff
- Network status detection
- User-friendly error messages

### 2. API Errors
- Proper HTTP status code handling
- Validation error display
- Fallback UI components

### 3. Component Errors
- Error boundaries for component crashes
- Graceful degradation
- Error reporting (for production)

## Testing Strategy

### 1. API Integration Tests
- Mock API responses for testing
- Error scenario testing
- Loading state testing

### 2. Component Tests
- Property card rendering
- Form validation
- Error state handling

### 3. E2E Tests
- Complete user flows
- Property listing and details
- Form submission

## Migration Guide

### From Static Data to API

1. **Replace Static Imports**
   ```tsx
   // Old
   import { properties } from '@/utils/properties';
   
   // New
   import { useProperties } from '@/hooks/useProperties';
   ```

2. **Update Component Props**
   ```tsx
   // Old: Legacy property interface
   interface Property {
     id: number;
     price: string;
     // ...
   }
   
   // New: API property interface
   interface Property {
     id: string;
     rent?: number;
     // ...
   }
   ```

3. **Add Loading States**
   ```tsx
   const { properties, isLoading, error } = useProperties();
   
   if (isLoading) return <PropertyListSkeleton />;
   if (error) return <ErrorMessage message={error} />;
   ```

## Production Considerations

### 1. Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.arambo.com
NODE_ENV=production
```

### 2. Error Monitoring
- Integrate Sentry or similar service
- API error tracking
- Performance monitoring

### 3. Caching Strategy
- CDN caching for static assets
- API response caching
- Browser caching optimization

### 4. Security
- API rate limiting
- Input validation
- CORS configuration

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check `NEXT_PUBLIC_API_BASE_URL` environment variable
   - Verify API server is running
   - Check network connectivity

2. **Type Errors**
   - Ensure API response matches TypeScript interfaces
   - Check for null/undefined values
   - Validate data transformation

3. **Loading Issues**
   - Check SWR configuration
   - Verify error handling
   - Check console for errors

### Debug Mode
```tsx
// Enable SWR debug mode
import { SWRConfig } from 'swr';

<SWRConfig
  value={{
    onError: (error) => console.error('SWR Error:', error),
    onSuccess: (data) => console.log('SWR Success:', data),
  }}
>
  <App />
</SWRConfig>
```

## Future Enhancements

1. **Advanced Filtering**
   - Map-based search
   - Saved searches
   - Price alerts

2. **Real-time Updates**
   - WebSocket integration
   - Live property updates
   - Chat functionality

3. **Performance**
   - Virtual scrolling for large lists
   - Image optimization
   - Progressive Web App features

4. **Analytics**
   - User behavior tracking
   - Property view analytics
   - Conversion tracking

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include loading states
4. Write tests for new features
5. Update documentation

## Support

For questions or issues:
- Check the API documentation
- Review error logs
- Contact the development team