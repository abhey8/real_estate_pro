import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { INDIA_CENTER, isValidCoordinates } from '../../../utils/locationMap';

export interface MapProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  image: string;
  coordinates: [number, number];
}

interface MapViewProps {
  properties: MapProperty[];
  onMarkerClick?: (property: MapProperty) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const FALLBACK_PROPERTY_IMAGE = '/property-placeholder.svg';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPrice = (price: number, status: string) => {
  if (status === 'rent') {
    return `${INR_FORMATTER.format(price)}/month`;
  }

  return INR_FORMATTER.format(price);
};

const createMarkerIcon = () =>
  L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -30],
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:linear-gradient(135deg,#0f172a,#1e3a8a);border:2px solid rgba(255,255,255,0.92);box-shadow:0 12px 24px rgba(15,23,42,0.22);">
        <div style="width:12px;height:12px;border-radius:9999px;background:#fbbf24;box-shadow:0 0 0 4px rgba(251,191,36,0.18);"></div>
      </div>
      <div style="margin:-3px auto 0;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid #1e3a8a;"></div>
    `,
  });

export function MapView({
  properties,
  onMarkerClick,
  center = INDIA_CENTER,
  zoom = 5,
  className = '',
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const validProperties = useMemo(
    () => properties.filter((property) => isValidCoordinates(property.coordinates)),
    [properties]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    }).setView(center, zoom);

    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      markerLayerRef.current = null;
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();
    const markerIcon = createMarkerIcon();
    const bounds = L.latLngBounds([]);

    validProperties.forEach((property) => {
      const marker = L.marker(property.coordinates, { icon: markerIcon }).addTo(markerLayer);
      bounds.extend(property.coordinates);

      const popupContent = `
        <div style="min-width:220px;font-family:inherit;">
          <img src="${escapeHtml(property.image || FALLBACK_PROPERTY_IMAGE)}" alt="${escapeHtml(property.title)}" style="width:100%;height:132px;object-fit:cover;border-radius:12px;margin-bottom:10px;background:#f1f5f9;" onerror="this.onerror=null;this.src='${FALLBACK_PROPERTY_IMAGE}';" />
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div>
              <h3 style="margin:0;font-size:16px;font-weight:600;color:#0f172a;">${escapeHtml(property.title)}</h3>
              <p style="margin:6px 0 0;font-size:13px;line-height:1.45;color:#64748b;">${escapeHtml(property.location)}</p>
            </div>
          </div>
          <p style="margin:12px 0 0;font-size:16px;font-weight:700;color:#0f172a;">${escapeHtml(formatPrice(property.price, property.status))}</p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        offset: [0, -18],
      });

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(property));
      }
    });

    window.setTimeout(() => map.invalidateSize(), 120);

    if (validProperties.length === 1) {
      map.setView(validProperties[0].coordinates, Math.max(zoom, 12), { animate: true });
      return;
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 11,
        animate: true,
      });
      return;
    }

    map.setView(center, zoom, { animate: true });
  }, [center, onMarkerClick, validProperties, zoom]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [className, validProperties.length]);

  return <div ref={mapContainerRef} className={`h-full w-full ${className}`} />;
}
