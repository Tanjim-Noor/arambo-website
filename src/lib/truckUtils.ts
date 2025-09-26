import { Truck } from '@/types/truck';

// Map truck database model to TruckCard props
export const formatTruckForCard = (truck: Truck) => {
  // Generate title from model and specifications
  const openStatus = truck.isOpen ? 'Open' : 'Closed';
  const title = `${truck.height} ft ${truck.modelNumber} (${openStatus})`;
  
  // Keep the same image path structure - you can modify this mapping as needed
  const imageSrc = "/trucks/Truck1.png"; // You mentioned to keep images as is
  
  // Use the description from database, or provide a fallback
  const details = truck.description || `Height: ${truck.height}ft, Type: ${openStatus}`;
  
  return {
    id: truck.id,
    title,
    imageSrc,
    details
  };
};

// If you want different images based on truck properties, you can extend this:
export const getTruckImage = (truck: Truck): string => {
  // Example logic - you can customize this based on your needs
  if (truck.height <= 9) {
    return "/trucks/Truck1.png";
  } else if (truck.height <= 12) {
    return "/trucks/Truck2.png";
  } else {
    return "/trucks/Truck3.png";
  }
  
  // For now, return the default image as requested
  return "/trucks/Truck1.png";
};