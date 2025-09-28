export function MapViewer({ lat, lng }: { lat?: number; lng?: number }) {
  // Default coordinates for Dhaka, Bangladesh if no coordinates are provided
  const defaultLat = 23.75739595985969;
  const defaultLng = 90.38688233316064;
  
  // Use provided coordinates or fall back to defaults
  const mapLat = lat ?? defaultLat;
  const mapLng = lng ?? defaultLng;
  
  // For a simple embed we recommend the q=lat,lng iframe which doesn't require JS API.
  const src = `https://www.google.com/maps?q=${mapLat},${mapLng}&z=16&output=embed`;
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <iframe
        src={src}
        width="100%"
        height="300"
        className="sm:h-[380px]"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}