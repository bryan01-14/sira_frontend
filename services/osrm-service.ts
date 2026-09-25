export interface OSRMRouteResult {
  distanceText: string;
  durationMinutes: number;
  formattedDuration: string;
  coordinates: { latitude: number; longitude: number }[];
}

export interface LocationCoordinates {
  title: string;
  latitude: number;
  longitude: number;
}

// Known coordinates mapping for key Abidjan places
export const ABIDJAN_COORDINATES_MAP: Record<string, { latitude: number; longitude: number }> = {
  'Orange Digital Center': { latitude: 5.3260, longitude: -4.0198 },
  'Abobo Samaké': { latitude: 5.4160, longitude: -4.0150 },
  'Maison': { latitude: 5.4160, longitude: -4.0150 },
  'Travail': { latitude: 5.3260, longitude: -4.0198 },
  'Cocody Saint-Jean': { latitude: 5.3480, longitude: -3.9920 },
  'Yopougon Sipores': { latitude: 5.3450, longitude: -4.0800 },
  'Plateau Cité Administrative': { latitude: 5.3280, longitude: -4.0210 },
  'Adjamé Gare Routière': { latitude: 5.3600, longitude: -4.0250 },
  'Aéroport Int. Félix Houphouët-Boigny': { latitude: 5.2550, longitude: -3.9620 },
  'Marcory Zone 4': { latitude: 5.3050, longitude: -3.9850 },
  'Treichville Gare Bassam': { latitude: 5.3080, longitude: -4.0090 },
  'Riviera 2 Anono': { latitude: 5.3580, longitude: -3.9720 },
  'Ma position actuelle': { latitude: 5.4160, longitude: -4.0150 },
  'Abobo': { latitude: 5.4160, longitude: -4.0150 },
  'Cocody': { latitude: 5.3480, longitude: -3.9920 },
  'Yopougon': { latitude: 5.3450, longitude: -4.0800 },
  'Plateau': { latitude: 5.3280, longitude: -4.0210 },
  'Adjamé': { latitude: 5.3600, longitude: -4.0250 },
  'Marcory': { latitude: 5.3050, longitude: -3.9850 },
  'Treichville': { latitude: 5.3080, longitude: -4.0090 },
  'Port-Bouët': { latitude: 5.2550, longitude: -3.9620 },
  'Bingerville': { latitude: 5.3550, longitude: -3.8850 },
  'Anyama': { latitude: 5.4950, longitude: -4.0500 },
};

/**
 * Resolve coordinates for any location string
 */
export function getLocationCoordinates(locationName: string): { latitude: number; longitude: number } {
  if (!locationName) {
    return ABIDJAN_COORDINATES_MAP['Abobo Samaké'];
  }
  if (ABIDJAN_COORDINATES_MAP[locationName]) {
    return ABIDJAN_COORDINATES_MAP[locationName];
  }

  // Search case-insensitive match
  const lower = locationName.toLowerCase().trim();
  for (const key of Object.keys(ABIDJAN_COORDINATES_MAP)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return ABIDJAN_COORDINATES_MAP[key];
    }
  }

  // Deterministic coordinate calculation within Abidjan bounds
  let hash = 0;
  for (let i = 0; i < locationName.length; i++) {
    hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = (((Math.abs(hash) % 100) - 50) / 50) * 0.04;
  const lngOffset = (((Math.abs(hash >> 3) % 100) - 50) / 50) * 0.04;

  return {
    latitude: 5.3500 + latOffset,
    longitude: -4.0100 + lngOffset,
  };
}

// In-memory cache for fast instant route loading
const routeCache = new Map<string, OSRMRouteResult>();

/**
 * Fetch a driving route from the public OSRM API with caching & timeout
 */
export async function fetchOSRMRoute(
  startLat: number,
  startLon: number,
  destLat: number,
  destLon: number
): Promise<OSRMRouteResult | null> {
  const cacheKey = `${startLat.toFixed(4)},${startLon.toFixed(4)}->${destLat.toFixed(4)},${destLon.toFixed(4)}`;
  
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s max timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMinutes = Math.round(route.duration / 60);

      const coordinates = route.geometry.coordinates.map((point: [number, number]) => ({
        longitude: point[0],
        latitude: point[1],
      }));

      const result: OSRMRouteResult = {
        distanceText: `${distanceKm} Km`,
        durationMinutes,
        formattedDuration: `${durationMinutes} min`,
        coordinates,
      };

      routeCache.set(cacheKey, result);
      return result;
    }
    return null;
  } catch (error) {
    // Silent fail over to calculated straight path
    return null;
  }
}

/**
 * Helper to fetch OSRM route using location titles
 */
export async function getRouteBetweenLocations(
  departureName: string,
  arrivalName: string
): Promise<OSRMRouteResult | null> {
  const start = getLocationCoordinates(departureName);
  const dest = getLocationCoordinates(arrivalName);

  return fetchOSRMRoute(start.latitude, start.longitude, dest.latitude, dest.longitude);
}
