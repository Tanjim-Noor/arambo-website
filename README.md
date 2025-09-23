# Arambo - Real Estate Properties Website

A modern, responsive real estate website built with Next.js 15, showcasing residential and commercial properties with comprehensive services including truck moving, furniture solutions, and legal consultancy.

## 🏗️ Tech Stack

- **Framework**: Next.js 15.4.6 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Material-UI (MUI) v7.3.1
- **Icons**: FontAwesome, Lucide React
- **HTTP Client**: Axios
- **Data Fetching**: SWR for client-side data fetching
- **Charts**: Recharts
- **Carousel**: Swiper.js
- **Linting**: ESLint with Next.js config

## 🚀 Features

- **Property Listings**: Browse residential and commercial properties with infinite scroll
- **Property Details**: Server-side rendered property pages with SEO optimization
- **API Integration**: Full REST API integration with TypeScript support
- **Service Integration**: Truck moving, furniture solutions, legal consultancy
- **Property Forms**: API-integrated property listing and furniture forms
- **Blog System**: Real estate blog with detailed articles
- **Responsive Design**: Mobile-first responsive design
- **Verification System**: Property verification badges
- **Filter & Search**: Advanced property filtering with API integration
- **Agent Profiles**: Real estate agent information and contact
- **Infinite Scroll**: Smooth pagination with automatic loading
- **Error Handling**: Comprehensive error states and loading indicators

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanjim-Noor/arambo-website.git
   cd arambo-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Configure your API endpoints in .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 📁 Project Structure

```
arambo-website/
├── public/                  # Static assets and images
│   ├── about/              # About page assets
│   ├── agent/              # Agent-related images
│   ├── blog/               # Blog images
│   ├── commercial/         # Commercial property assets
│   ├── footer/             # Footer icons
│   ├── homepageAssets/     # Homepage images
│   ├── property-single/    # Property detail assets
│   ├── residential/        # Residential property assets
│   └── trucks/             # Truck service images
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── about/          # About page
│   │   ├── blog/           # Blog pages
│   │   ├── commercial/     # Commercial properties
│   │   ├── residential/    # Residential properties (API-integrated)
│   │   ├── furniture/      # Furniture services
│   │   ├── properties/[id] # Dynamic property details with SEO
│   │   ├── property-single/ # Legacy property details
│   │   └── ...             # Other pages
│   ├── components/         # Reusable React components
│   │   ├── homepageComponents/ # Homepage-specific components
│   │   ├── list-property/  # API-integrated property forms
│   │   ├── furniture/      # Furniture-related components
│   │   ├── ui/             # UI components (loading, error states)
│   │   └── ...             # Other components
│   ├── hooks/              # Custom React hooks
│   │   └── useProperties.ts # SWR hooks for property data
│   ├── lib/                # Library configurations
│   │   └── api.ts          # API service layer with Axios
│   ├── types/              # TypeScript type definitions
│   │   └── property.ts     # Property and API types
│   └── utils/              # Utility functions and legacy data
├── .env.local              # Environment variables (API configuration)
├── API_INTEGRATION_GUIDE.md # Comprehensive API documentation
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Styling & Design

- **Tailwind CSS**: Utility-first CSS framework with custom Arambo color scheme
- **Custom Colors**: Primary blue (#1946BB), accent colors, and semantic color system
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Component Library**: Material-UI components for consistent design
- **Icons**: FontAwesome and Lucide React for comprehensive icon coverage

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

For production deployment, update the API base URL accordingly.

### Next.js Configuration

The project uses the default Next.js configuration with TypeScript support and Turbopack for faster development.

## 📱 Pages & Routes

- `/` - Homepage with property showcase
- `/residential` - API-integrated residential properties with infinite scroll
- `/commercial` - Commercial properties listing
- `/properties/[id]` - Dynamic property details with SEO optimization
- `/property-single` - Legacy property details page
- `/about` - About Arambo company
- `/blog` - Real estate blog listing
- `/blog/[id]` - Individual blog post
- `/list-property` - Property listing form
- `/list-property-form` - API-integrated property submission form
- `/furniture` - Furniture services
- `/furniture-form` - Furniture request form
- `/book-a-truck` - Truck booking service

## 🔌 API Integration

The application features comprehensive REST API integration:

- **SWR Data Fetching**: Client-side data fetching with caching and revalidation
- **Server Components**: SEO-optimized server-side rendering for property pages
- **TypeScript Support**: Fully typed API responses and requests
- **Error Handling**: Comprehensive error states and user feedback
- **Infinite Scroll**: Smooth pagination with automatic loading
- **Form Integration**: Property listing forms with API submission

### API Endpoints

- `GET /properties` - Property listings with pagination and filters
- `GET /properties/:id` - Individual property details
- `POST /properties` - Create new property listing
- `GET /properties/stats` - Property statistics

### Quick API Usage

```typescript
import { useProperties } from '@/hooks/useProperties';

const { properties, total, isLoading, hasMore, loadMore } = useProperties({
  propertyCategory: 'Residential',
  limit: 10
});
```

For detailed API documentation, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

## 🚧 Development Notes

- **State Management**: React's built-in state + SWR for server state
- **Data Flow**: API-driven with SWR caching and revalidation
- **Form Handling**: API-integrated forms with validation and error handling
- **Image Optimization**: Next.js Image component for optimized loading
- **SEO**: Server Components with dynamic metadata generation
- **Error Boundaries**: Comprehensive error handling throughout the app
- **Performance**: Infinite scroll, loading states, and optimized re-renders

## 🔄 Migration Status

- ✅ **API Integration**: Complete REST API integration with TypeScript
- ✅ **Property Listings**: Infinite scroll residential properties page
- ✅ **Property Details**: SEO-optimized dynamic property pages
- ✅ **Form Integration**: Property listing forms with API submission
- ✅ **Error Handling**: Loading states and error boundaries
- ⏳ **Filter Integration**: Basic filters implemented, API integration pending
- ⏳ **Commercial Properties**: Static implementation, API migration pending

## 📄 License

This project is private and owned by Arambo. All rights reserved.
