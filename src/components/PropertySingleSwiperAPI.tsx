"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Property } from "@/types/property";

interface PropertySingleSwiperAPIProps {
  property: Property;
}

const PropertySingleSwiperAPI = ({ property }: PropertySingleSwiperAPIProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Handle image load errors
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    target.src = "/placeholder.svg";
    // Add the failed image to error set
    setImageErrors(prev => new Set([...prev, target.src]));
  };

  // Combine cover image and other images
  const allImages: Array<{ image: string; hasTag: boolean }> = [];
  
  // Add cover image as first slide if available and not errored
  if (property.coverImage && !imageErrors.has(property.coverImage)) {
    allImages.push({
      image: property.coverImage,
      hasTag: true, // Cover image typically shows the tag
    });
  }
  
  // Add other images
  if (property.otherImages && property.otherImages.length > 0) {
    property.otherImages.forEach((imageUrl, index) => {
      // Only add valid image URLs that haven't errored
      if (imageUrl && imageUrl.trim() && !imageErrors.has(imageUrl)) {
        allImages.push({
          image: imageUrl,
          hasTag: index === 0 && !property.coverImage, // Only show tag on first image if no cover image
        });
      }
    });
  }
  
  // Fallback to placeholder if no images available
  if (allImages.length === 0) {
    allImages.push({
      image: "/property-single/property.jpg",
      hasTag: true,
    });
  }

  // Duplicate images if there aren't enough for proper looping
  // Swiper needs at least 4 slides for smooth looping with slidesPerView: 2
  const minSlidesForLoop = 5;
  const finalImages = [...allImages];
  
  if (finalImages.length > 1 && finalImages.length < minSlidesForLoop) {
    // Calculate how many duplicates we need
    const duplicatesNeeded = minSlidesForLoop - finalImages.length;
    
    // Add duplicates by cycling through existing images
    for (let i = 0; i < duplicatesNeeded; i++) {
      const imageIndex = i % allImages.length;
      const imageToAdd = { ...allImages[imageIndex] };
      // Only show tag on the first occurrence
      imageToAdd.hasTag = false;
      finalImages.push(imageToAdd);
    }
  }

  // Format category for display
  const displayCategory = property.listingType

  return (
    <div className="relative w-full ">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        centeredSlides={true}
        loop={finalImages.length > 1}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-gray-400",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-blue-600",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        className="property-carousel"
      >
        {finalImages.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300">
              {slide.hasTag && (
                <div className="absolute top-8 left-5 z-10">
                  <span className=" text-Arambo-Black font-medium px-3.5 bg-Arambo-Border rounded-full py-2.5 text-base">
                    {displayCategory}
                  </span>
                </div>
              )}
                            <Image
                src={slide.image}
                alt={`Property image ${index + 1}`}
                width={800}
                height={416}
                style={{ width: "100%", height: "auto" }}
                className="w-full max-h-[416px] object-cover"
                onError={handleImageError}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons - only show if there are multiple images */}
      {finalImages.length > 1 && (
        <>
          <button className="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
            <Image src="/property-single/arrow-left.svg" alt="Previous" width={24} height={24} />
          </button>

          <button className="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
            <Image src="/property-single/arrow-right.svg" alt="Next" width={24} height={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default PropertySingleSwiperAPI;