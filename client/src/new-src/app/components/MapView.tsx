import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Property } from '../data/properties';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  properties: Property[];
  onMarkerClick?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function MapView({
  properties,
  onMarkerClick,
  center = [39.8283, -98.5795], // Center of USA
  zoom = 4,
  className = '',
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Custom icon
    const customIcon = L.divIcon({
      html: `<div style="background: black; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Add markers
    properties.forEach((property) => {
      const marker = L.marker(property.coordinates, {
        icon: customIcon,
      }).addTo(map);

      const popupContent = `
        <div style="min-width: 200px;">
          <img src="${property.image}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">${property.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${property.location}</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600;">
            ${
              property.status === 'rent'
                ? `$${property.price.toLocaleString()}/mo`
                : `$${(property.price / 1000).toFixed(0)}K`
            }
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(property));
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties, center, zoom, onMarkerClick]);

  return <div ref={mapContainerRef} className={`w-full h-full ${className}`} />;
}
