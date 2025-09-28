export function MapViewer({ lat, lng }: { lat: number; lng: number }) {
  // For a simple embed we recommend the q=lat,lng iframe which doesn't require JS API.
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
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