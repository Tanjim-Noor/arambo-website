import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        
        {/* Property type and location */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Features */}
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export const PropertyListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const PropertyDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Hero section skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-lg mb-8"></div>
      
      {/* Content skeleton */}
      <div className="space-y-8">
        {/* Title and price */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        {/* Description */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};