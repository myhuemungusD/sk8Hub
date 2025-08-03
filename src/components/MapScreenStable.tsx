'use client';

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useSkateSpots } from '@/hooks/useSkateSpotsWeb';

const AVATAR_IMG = "https://i.ibb.co/HtCrYp6/avatar-demo.png";

// Simple map component that loads everything dynamically
export default function MapScreenStable() {
  const { spots, loading } = useSkateSpots();
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<any>;
    TileLayer: React.ComponentType<any>;
    Marker: React.ComponentType<any>;
    Popup: React.ComponentType<any>;
    L: typeof import('leaflet');
  } | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Load Leaflet CSS first
    const loadLeafletCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      link.crossOrigin = '';
      if (!document.querySelector('link[href*="leaflet"]')) {
        document.head.appendChild(link);
      }
    };

    // Load Leaflet and React-Leaflet dynamically
    const loadMapComponents = async () => {
      try {
        loadLeafletCSS();
        
        // Wait a bit for CSS to load
        setTimeout(async () => {
          const [reactLeaflet, leaflet] = await Promise.all([
            import('react-leaflet'),
            import('leaflet')
          ]);

          // Fix Leaflet default markers
          delete (leaflet.Icon.Default.prototype as typeof leaflet.Icon.Default.prototype & { _getIconUrl?: () => void })._getIconUrl;
          leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });

          setMapComponents({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            Popup: reactLeaflet.Popup,
            L: leaflet
          });
          setMapLoaded(true);
        }, 100);
      } catch (error) {
        console.error('Error loading map components:', error);
      }
    };

    if (isClient) {
      loadMapComponents();
    }
  }, [isClient]);

  if (!isClient || loading || !mapLoaded || !MapComponents) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg mb-2">
            {loading ? 'Loading skate spots...' : 'Loading map...'}
          </div>
          <div className="text-gray-400 text-sm">
            🛹 Finding the best spots for you
          </div>
        </div>
      </div>
    );
  }

  // Create custom icon function
  const createCustomIcon = (photo: string, color: string, active: boolean) => {
    const iconHtml = `
      <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; position: relative;">
        ${active ? `
          <div style="position: absolute; width: 54px; height: 54px; border-radius: 50%; background-color: ${color}55; box-shadow: 0 0 12px ${color}; opacity: 0.7; z-index: 1; animation: pulse 2s infinite;"></div>
        ` : ''}
        <div style="position: relative; width: 40px; height: 40px; border-radius: 50%; border: 3px solid ${color}; background-color: #191f2a; display: flex; align-items: center; justify-content: center; overflow: hidden; z-index: 2;">
          <img src="${photo}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
        </div>
      </div>
    `;
    
    return MapComponents.L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    });
  };

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="relative h-screen bg-gray-900">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.5); }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={[34.0459, -118.2167]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createCustomIcon(spot.photo, spot.color, spot.active)}
          >
            <Popup>
              <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '12px', borderRadius: '8px', minWidth: '200px' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{spot.name}</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  <p><span style={{ color: '#9ca3af' }}>Type:</span> {spot.type}</p>
                  <p><span style={{ color: '#9ca3af' }}>Difficulty:</span> {spot.difficulty}</p>
                  <p><span style={{ color: '#9ca3af' }}>Rating:</span> {'⭐'.repeat(Math.floor(spot.rating))} {spot.rating}</p>
                  <p style={{ color: '#d1d5db', marginTop: '8px' }}>{spot.description}</p>
                  {spot.features.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <p style={{ color: '#9ca3af' }}>Features:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {spot.features.map((feature, index) => (
                          <span 
                            key={index}
                            style={{ 
                              padding: '4px 8px', 
                              backgroundColor: '#374151', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Avatar Overlay - always at center */}
      <div className="absolute z-50 pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-20">
        <Image
          src={AVATAR_IMG}
          alt="User Avatar"
          width={96}
          height={160}
          className="rounded-3xl border-2 border-gray-700 bg-gray-800 object-cover"
        />
      </div>

      {/* Floating spot counter */}
      <div className="absolute top-20 right-4 z-50 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2">
        <div className="text-white text-sm font-medium">
          📍 {spots.length} spots found
        </div>
      </div>

      {/* Center location button */}
      <div className="absolute bottom-6 right-4 z-50">
        <button 
          className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full shadow-lg transition-colors"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                () => {
                  console.log('Centering on user location');
                },
                (error) => console.log('Location error:', error)
              );
            }
          }}
        >
          🎯
        </button>
      </div>
    </div>
  );
}
