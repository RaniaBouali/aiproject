'use client';

import React, { useEffect, useRef } from 'react';
import { ProviderProfile } from '@/types';
import { formatDistance } from '@/lib/geo';

interface MapComponentProps {
  center: { latitude: number; longitude: number };
  radiusKm: number;
  providers: ProviderProfile[];
  selectedProviderId?: string | null;
  onSelectProvider?: (id: string) => void;
}

export default function MapComponent({
  center,
  radiusKm,
  providers,
  selectedProviderId,
  onSelectProvider,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isSubscribed = true;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isSubscribed) return;

      // Fix default Leaflet icon paths in bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Initialize map instance if not already created
      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [center.latitude, center.longitude],
          zoom: 12,
          scrollWheelZoom: true,
        });

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const markersLayer = markersLayerRef.current;

      if (!map || !markersLayer) return;

      // Update Center view
      map.setView([center.latitude, center.longitude], 12);

      // Clear existing markers
      markersLayer.clearLayers();

      // 1. Draw User search point marker & search radius circle
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="background-color: #0F172A; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #D97706; box-shadow: 0 0 8px rgba(15,23,42,0.5);"></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([center.latitude, center.longitude], { icon: userIcon })
        .addTo(markersLayer)
        .bindPopup('<b style="font-size:12px; font-family:sans-serif;">Centre de recherche actuel</b>');

      if (radiusCircleRef.current) {
        radiusCircleRef.current.remove();
      }

      radiusCircleRef.current = L.circle([center.latitude, center.longitude], {
        radius: radiusKm * 1000,
        color: '#B45309',
        fillColor: '#FBBF24',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(markersLayer);

      // 2. Add Provider markers
      providers.forEach((prov) => {
        const isSelected = prov.id === selectedProviderId;

        const providerIcon = L.divIcon({
          className: 'provider-custom-pin',
          html: `
            <div style="
              background-color: ${isSelected ? '#D97706' : '#0F172A'};
              color: white;
              padding: 3px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              border: 1.5px solid ${isSelected ? '#FFFFFF' : '#475569'};
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.12)' : 'scale(1)'};
              transition: transform 0.15s ease-out;
            ">
              <span style="color: ${isSelected ? '#FFFFFF' : '#FBBF24'};">★ ${prov.ratingAverage.toFixed(1)}</span>
              <span style="opacity: 0.6;">&bull;</span>
              <span>${prov.name.split(' ')[0]}</span>
            </div>
          `,
          iconSize: [84, 26],
          iconAnchor: [42, 13],
        });

        const marker = L.marker([prov.latitude, prov.longitude], {
          icon: providerIcon,
        }).addTo(markersLayer);

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 220px; padding: 4px 2px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img src="${prov.avatar}" style="width: 42px; height: 42px; border-radius: 6px; object-fit: cover; border: 1px solid #CBD5E1;" />
              <div style="min-width: 0; flex: 1;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prov.name}</h4>
                <p style="margin: 0; font-size: 11px; color: #B45309; font-weight: 600;">${prov.categories[0]?.name || 'Artisan'}</p>
                <div style="font-size: 10px; color: #64748B; font-family: monospace;">
                  ${formatDistance(prov.distanceKm)} de votre secteur
                </div>
              </div>
            </div>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.35;">${prov.bio.substring(0, 75)}...</p>
            <div style="display: flex; gap: 6px;">
              <a href="/providers/${prov.id}" style="
                flex: 1;
                display: block;
                text-align: center;
                background-color: #0F172A;
                color: white;
                text-decoration: none;
                padding: 5px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
              ">Voir la fiche</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectProvider) onSelectProvider(prov.id);
        });

        if (isSelected) {
          marker.openPopup();
        }
      });
    });

    return () => {
      isSubscribed = false;
    };
  }, [center, radiusKm, providers, selectedProviderId]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-lg overflow-hidden border border-stone-300">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
