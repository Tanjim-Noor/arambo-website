# Arambo - Real Estate Properties Website

A modern, responsive real estate website built with Next.js 15, showcasing residential and commercial properties with comprehensive services including truck moving, furniture solutions, and legal consultancy.

## 🏗️ Tech Stack

- **Framework**: Next.js 15.4.6 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Material-UI (MUI) v7.3.1
- **Icons**: FontAwesome, Lucide React
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Carousel**: Swiper.js
- **Linting**: ESLint with Next.js config

## 🚀 Features

- **Property Listings**: Browse residential and commercial properties
- **Property Details**: Detailed property pages with image galleries
- **Service Integration**: Truck moving, furniture solutions, legal consultancy
- **Property Forms**: List property and furniture forms
- **Blog System**: Real estate blog with detailed articles
- **Responsive Design**: Mobile-first responsive design
- **Verification System**: Property verification badges
- **Filter & Search**: Advanced property filtering options
- **Agent Profiles**: Real estate agent information and contact

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

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
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
│   │   ├── residential/    # Residential properties
│   │   ├── furniture/      # Furniture services
│   │   ├── property-single/ # Property details
│   │   └── ...             # Other pages
│   ├── components/         # Reusable React components
│   │   ├── homepageComponents/ # Homepage-specific components
│   │   ├── list-property/  # Property listing components
│   │   ├── furniture/      # Furniture-related components
│   │   └── ...             # Other components
│   └── utils/              # Utility functions and data
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

Currently, the application uses hardcoded data and doesn't require environment variables. For API integration, you'll need to set up:

```env
# Example for future API integration
NEXT_PUBLIC_API_URL=your_api_url_here
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Next.js Configuration

The project uses the default Next.js configuration with TypeScript support and Turbopack for faster development.

## 📱 Pages & Routes

- `/` - Homepage with property showcase
- `/residential` - Residential properties listing
- `/commercial` - Commercial properties listing
- `/property-single` - Individual property details
- `/about` - About Arambo company
- `/blog` - Real estate blog listing
- `/blog/[id]` - Individual blog post
- `/list-property` - Property listing form
- `/list-property-form` - Property submission form
- `/furniture` - Furniture services
- `/furniture-form` - Furniture request form
- `/book-a-truck` - Truck booking service

## 🔌 Current API Integration

The application currently uses:

- **Axios**: For HTTP requests (configured in components)
- **Static Data**: Properties and content from `/src/utils/` directory
- **Form Submissions**: Basic form handling with Axios POST requests

Example API call structure found in components:
```typescript
const res = await axios.post("/api/submit", formData)
```

## 🚧 Development Notes

- **State Management**: Currently uses React's built-in state (useState, useEffect)
- **Data Flow**: Static data with local state management
- **Form Handling**: Individual component-level form state
- **Image Optimization**: Next.js Image component for optimized loading
- **SEO**: Meta tags configured in layout.tsx

## 📄 License

This project is private and owned by Arambo. All rights reserved.
