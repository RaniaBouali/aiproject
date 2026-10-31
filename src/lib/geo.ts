/**
 * Geospatial utility functions for ProxiService
 * Computes great-circle distances using the Haversine formula
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates the great-circle distance between two geographic coordinates
 * @returns distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Format distance in a human-friendly format (e.g. "850 m" or "3.4 km")
 */
export function formatDistance(distanceKm: number | undefined): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return '--';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Default location fallback (Algiers center: 36.7538, 3.0588 or Paris center: 48.8566, 2.3522)
 */
export const DEFAULT_COORDINATES = {
  latitude: 36.7538,
  longitude: 3.0588,
  cityName: 'Alger Centre',
};
