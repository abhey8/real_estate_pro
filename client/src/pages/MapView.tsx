import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, Bath, Maximize, MapPin, ArrowRight, Home, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../new-src/app/components/ui/button';
import api from '../utils/api';

interface PropertyPreviewCardProps {
  property: any;
  onClose: () => void;
}

function PropertyPreviewCard({ property, onClose }: PropertyPreviewCardProps) {
  const formatPrice = (price: number, status: string) => {
    if (status === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${(price / 1000000).toFixed(2)}M`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-lg mx-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-56 bg-gray-100">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black text-white text-xs uppercase tracking-wider rounded-full">
              {property.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-2xl mb-2 tracking-tight">{property.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="w-4 h-4" />
              <span>{property.area?.toLocaleString() || 0} sqft</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl tracking-tight">
              {formatPrice(property.price, property.status)}
            </div>
            <Link to={`/listings/${property.id}`}>
              <Button className="bg-black text-white hover:bg-gray-900">
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Simple custom map using static tiles and overlays
function CustomMap({ 
  properties,
  selectedProperty, 
  onPropertySelect 
}: { 
  properties: any[];
  selectedProperty: any | null; 
  onPropertySelect: (property: any) => void;
}) {
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (properties.length > 0) {
      // Auto-center somewhere near the first property, or calculating average lat/lng
      const avgLat = properties.reduce((sum, p) => sum + (p.coordinates?.[0] || 0), 0) / properties.length;
      const avgLng = properties.reduce((sum, p) => sum + (p.coordinates?.[1] || 0), 0) / properties.length;
      if (!isNaN(avgLat) && !isNaN(avgLng)) {
        setCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }, [properties]);

  // Convert lat/lng to pixel position on map
  const latLngToPixel = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 1, 10));
  const handleZoomOut = () => setZoom(Math.max(zoom - 1, 2));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Update center based on drag (simplified)
    setCenter(prev => ({
      lat: prev.lat - (deltaY * 0.01),
      lng: prev.lng + (deltaX * 0.01)
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-200">
      {/* Map Background - Using OpenStreetMap static tiles */}
      <div
        className="absolute inset-0 transition-transform duration-200"
        style={{
          backgroundImage: `url('https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Overlay grid pattern for better visibility */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 100px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 100px)'
        }} />
      </div>

      {/* Property Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {properties.map((property) => {
          if (!property.coordinates || property.coordinates.length < 2) return null;
          
          const pos = latLngToPixel(property.coordinates[0], property.coordinates[1]);
          const isSelected = selectedProperty?.id === property.id;
          
          return (
            <motion.button
              key={property.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -100%)'
              }}
              onClick={() => onPropertySelect(property)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
            >
              {/* Marker Pin */}
              <div className="relative">
                {/* Selection pulse effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-black rounded-full opacity-30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Main marker */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-3 transition-all ${
                    isSelected 
                      ? 'bg-black border-white scale-110' 
                      : 'bg-white border-black hover:bg-gray-50'
                  }`}
                >
                  <Home 
                    className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-black'}`} 
                  />
                </div>

                {/* Pointer triangle */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-12 ${
                    isSelected ? 'border-black' : 'border-white'
                  }`}
                  style={{
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: isSelected ? '#000' : '#fff',
                    borderTopWidth: '16px',
                    borderLeftWidth: '8px',
                    borderRightWidth: '8px'
                  }}
                />

                {/* Property title tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: -5 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-black text-white px-3 py-1.5 rounded-lg text-xs pointer-events-none shadow-lg outline outline-1 outline-white"
                >
                  {property.title}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-black" style={{
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent'
                  }} />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-24 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl hover:bg-white transition-all border border-gray-200"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl hover:bg-white transition-all border border-gray-200"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200 cursor-move">
          <Move className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-32 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-gray-200">
        <span className="text-sm text-gray-600">Zoom: {zoom}</span>
      </div>
    </div>
  );
}

export default function MapViewPage() {
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const response = await api.get('/listings?status=ACTIVE&limit=100');
      const adaptedListings = (response.data.listings || []).map((listing: any) => ({
        id: listing._id || listing.id,
        title: listing.title,
        location: `${listing.address || ''}, ${listing.city || ''}`,
        price: listing.price,
        status: listing.listingType?.toLowerCase() || 'buy',
        image: listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-e32c53048189?w=800',
        bedrooms: listing.bedrooms || 0,
        bathrooms: listing.bathrooms || 0,
        area: listing.area || listing.squareFootage || 0,
        // use random offset close to a center point so markers don't stack if there are no coords
        coordinates: [
          listing.latitude || 37.7749 + (Math.random() * 0.1 - 0.05),
          listing.longitude || -122.4194 + (Math.random() * 0.1 - 0.05)
        ]
      }));
      setListings(adaptedListings);
    } catch (error) {
      console.error('Error loading properties for map map:', error);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Header Overlay */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
      >
        <div className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl tracking-tight">Property Map View</h1>
                  <p className="text-sm text-gray-600">{listings.length} properties available</p>
                </div>
              </div>
            </div>

            <Link to="/">
              <Button
                variant="outline"
                className="bg-white/95 backdrop-blur-md hover:bg-white border-gray-200 shadow-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <CustomMap 
        properties={listings}
        selectedProperty={selectedProperty}
        onPropertySelect={setSelectedProperty}
      />

      {/* Property Preview Card */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyPreviewCard
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-8 right-8 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-200"
      >
        <div className="text-sm mb-3 font-medium">Property Types</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>For Sale</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>For Rent</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          Click any marker to view details
        </div>
        <div className="mt-2 text-xs text-gray-500 italic">
          Drag to pan • Use zoom controls
        </div>
      </motion.div>
    </div>
  );
}
