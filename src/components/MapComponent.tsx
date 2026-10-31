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
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
          <div style="background-color: #2563eb; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([center.latitude, center.longitude], { icon: userIcon })
        .addTo(markersLayer)
        .bindPopup('<b>Votre position de recherche</b>');

      if (radiusCircleRef.current) {
        radiusCircleRef.current.remove();
      }

      radiusCircleRef.current = L.circle([center.latitude, center.longitude], {
        radius: radiusKm * 1000, // convert km to meters
        color: '#3b82f6',
        fillColor: '#93c5fd',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(markersLayer);

      // 2. Add Provider markers
      providers.forEach((prov) => {
        const isSelected = prov.id === selectedProviderId;

        const providerIcon = L.divIcon({
          className: 'provider-custom-pin',
          html: `
            <div style="
              background-color: ${isSelected ? '#1d4ed8' : '#0f172a'};
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 700;
              border: 2px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s;
            ">
              <span>★ ${prov.ratingAverage.toFixed(1)}</span>
              <span>•</span>
              <span>${prov.name.split(' ')[0]}</span>
            </div>
          `,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });

        const marker = L.marker([prov.latitude, prov.longitude], {
          icon: providerIcon,
        }).addTo(markersLayer);

        const popupContent = `
          <div style="font-family: inherit; width: 220px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img src="${prov.avatar}" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;" />
              <div>
                <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${prov.name}</h4>
                <p style="margin: 0; font-size: 11px; color: #2563eb; font-weight: 600;">${prov.categories[0]?.name || 'Artisan'}</p>
                <div style="font-size: 11px; color: #64748b;">
                  📍 ${formatDistance(prov.distanceKm)} de vous
                </div>
              </div>
            </div>
            <p style="font-size: 11px; color: #475569; margin: 0 0 10px 0; line-height: 1.3;">${prov.bio.substring(0, 75)}...</p>
            <div style="display: flex; gap: 6px;">
              <a href="/providers/${prov.id}" style="
                flex: 1;
                display: block;
                text-align: center;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                padding: 6px 10px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 600;
              ">Voir le profil</a>
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
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
