import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const TILE_SIZE = 256;

export interface LatLon {
  lat: number;
  lon: number;
}

export interface OsrmMapMarker {
  id: string;
  lat: number;
  lon: number;
  type: 'jam' | 'accident' | 'closed' | 'flood' | 'driver';
  label?: string;
  sublabel?: string;
}

export interface OsrmRouteSummary {
  distanceKm: string;
  durationMin: number;
}

interface OsrmMapProps {
  width: number;
  height: number;
  origin: LatLon;
  destination: LatLon;
  waypoints?: LatLon[];
  initialCenter?: LatLon;
  initialZoom?: number;
  routeStyle?: 'traffic' | 'blue';
  markers?: OsrmMapMarker[];
  showDriverPulse?: boolean;
  driverPosition?: LatLon;
  lineName?: string;
  onRouteCalculated?: (summary: OsrmRouteSummary) => void;
}

function lonToWorldX(lon: number, zoom: number): number {
  return ((lon + 180) / 360) * TILE_SIZE * Math.pow(2, zoom);
}

function latToWorldY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.log(Math.tan(latRad) + 1 / Math.cos(latRad));
  return ((1 - n / Math.PI) / 2) * TILE_SIZE * Math.pow(2, zoom);
}

function worldXToLon(worldX: number, zoom: number): number {
  return (worldX / (TILE_SIZE * Math.pow(2, zoom))) * 360 - 180;
}

function worldYToLat(worldY: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * worldY) / (TILE_SIZE * Math.pow(2, zoom));
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

const ABIDJAN_FALLBACK_COORDS: LatLon[] = [
  { lat: 5.4168, lon: -4.0195 },
  { lat: 5.4052, lon: -4.0208 },
  { lat: 5.3945, lon: -4.0221 },
  { lat: 5.3832, lon: -4.0245 },
  { lat: 5.3728, lon: -4.0258 },
  { lat: 5.3635, lon: -4.0241 },
  { lat: 5.3544, lon: -4.0218 },
  { lat: 5.3462, lon: -4.0179 },
  { lat: 5.3385, lon: -4.0165 },
  { lat: 5.3302, lon: -4.0188 },
  { lat: 5.3231, lon: -4.0205 },
];

export default function OsrmMap({
  width,
  height,
  origin,
  destination,
  waypoints = [],
  initialCenter,
  initialZoom = 13,
  routeStyle = 'traffic',
  showDriverPulse = true,
  onRouteCalculated,
}: OsrmMapProps) {
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [center, setCenter] = useState<LatLon>(
    initialCenter || {
      lat: (origin.lat + destination.lat) / 2,
      lon: (origin.lon + destination.lon) / 2,
    }
  );
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [routeCoords, setRouteCoords] = useState<LatLon[]>(
    ABIDJAN_FALLBACK_COORDS
  );
  const [loadingOsrm, setLoadingOsrm] = useState<boolean>(false);
  const [osrmSummary, setOsrmSummary] = useState<OsrmRouteSummary | null>(null);

  // Smooth continuous progress (0..1) of the taxi moving along its OSRM route
  const [taxiProgress, setTaxiProgress] = useState<number>(0.15);

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const centerRef = useRef(center);
  centerRef.current = center;

  useEffect(() => {
    setCenter(
      initialCenter || {
        lat: (origin.lat + destination.lat) / 2,
        lon: (origin.lon + destination.lon) / 2,
      }
    );
    setPanOffset({ x: 0, y: 0 });
    setTaxiProgress(0.08);
  }, [origin.lat, origin.lon, destination.lat, destination.lon]);

  // Animate the taxi smoothly along the line
  useEffect(() => {
    const interval = setInterval(() => {
      setTaxiProgress((prev) => {
        const next = prev + 0.0045;
        return next > 0.96 ? 0.04 : next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Fetch real road geometry & travel time from OSRM API
  useEffect(() => {
    let cancelled = false;

    async function fetchOsrmRoute() {
      setLoadingOsrm(true);
      try {
        const points = [origin, ...waypoints, destination];
        const coordString = points
          .map((pt) => `${pt.lon.toFixed(6)},${pt.lat.toFixed(6)}`)
          .join(';');

        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`OSRM HTTP ${response.status}`);
        }
        const data = await response.json();

        if (
          !cancelled &&
          data &&
          data.routes &&
          data.routes.length > 0 &&
          data.routes[0].geometry &&
          Array.isArray(data.routes[0].geometry.coordinates)
        ) {
          const rawCoords: [number, number][] =
            data.routes[0].geometry.coordinates;

          const step = Math.max(1, Math.floor(rawCoords.length / 80));
          const sampled: LatLon[] = [];
          for (let i = 0; i < rawCoords.length; i += step) {
            sampled.push({
              lon: rawCoords[i][0],
              lat: rawCoords[i][1],
            });
          }
          const last = rawCoords[rawCoords.length - 1];
          if (last) {
            sampled.push({ lon: last[0], lat: last[1] });
          }

          setRouteCoords(sampled);

          const distKm = (data.routes[0].distance / 1000).toFixed(1);
          const durMin = Math.max(
            5,
            Math.round(data.routes[0].duration / 60)
          );
          const summary: OsrmRouteSummary = {
            distanceKm: distKm,
            durationMin: durMin,
          };
          setOsrmSummary(summary);
          if (onRouteCalculated) {
            onRouteCalculated(summary);
          }
        }
      } catch {
        // Keep fallback Abidjan road geometry if offline
      } finally {
        if (!cancelled) {
          setLoadingOsrm(false);
        }
      }
    }

    fetchOsrmRoute();

    return () => {
      cancelled = true;
    };
  }, [origin.lat, origin.lon, destination.lat, destination.lon]);

  // Interpolate the taxi's live LatLon along routeCoords
  const animatedTaxiPosition = useMemo<LatLon>(() => {
    if (routeCoords.length === 0) return origin;
    if (routeCoords.length === 1) return routeCoords[0];

    const exactIndex = taxiProgress * (routeCoords.length - 1);
    const idx = Math.min(
      routeCoords.length - 2,
      Math.max(0, Math.floor(exactIndex))
    );
    const frac = exactIndex - idx;
    const p1 = routeCoords[idx];
    const p2 = routeCoords[idx + 1];

    return {
      lat: p1.lat + (p2.lat - p1.lat) * frac,
      lon: p1.lon + (p2.lon - p1.lon) * frac,
    };
  }, [routeCoords, taxiProgress, origin]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
        onPanResponderMove: (_, gesture) => {
          setPanOffset({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
          const currentZoom = zoomRef.current;
          const currentCenter = centerRef.current;
          const newWorldX =
            lonToWorldX(currentCenter.lon, currentZoom) - gesture.dx;
          const newWorldY =
            latToWorldY(currentCenter.lat, currentZoom) - gesture.dy;

          setCenter({
            lon: worldXToLon(newWorldX, currentZoom),
            lat: worldYToLat(newWorldY, currentZoom),
          });
          setPanOffset({ x: 0, y: 0 });
        },
      }),
    []
  );

  // On Web, render an interactive Leaflet + OpenStreetMap + OSRM iframe with the moving Taxi
  if (Platform.OS === 'web') {
    const webCenter = initialCenter || {
      lat: (origin.lat + destination.lat) / 2,
      lon: (origin.lon + destination.lon) / 2,
    };
    const lineColor = routeStyle === 'blue' ? '#1D70F5' : '#EF6622';
    const htmlDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
  .leaflet-control-attribution { font-size: 9px !important; }
  @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.85; } 100% { transform: scale(1.7); opacity: 0; } }
  .taxi-pulse { position:absolute; width:48px; height:48px; left:-6px; top:-6px; border-radius:50%; background:rgba(239,102,34,0.35); animation:pulse 1.5s infinite ease-out; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map', { center: [${webCenter.lat}, ${webCenter.lon}], zoom: ${initialZoom} });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap • OSRM'
  }).addTo(map);

  const taxiIcon = L.divIcon({
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: '<div style="position:relative;width:36px;height:36px;"><div class="taxi-pulse"></div><div style="position:relative;width:36px;height:36px;border-radius:18px;background:#FFFFFF;border:2.5px solid #EF6622;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.3);">🚕</div></div>'
  });

  const taxiMarker = L.marker([${origin.lat}, ${origin.lon}], { icon: taxiIcon }).addTo(map);

  fetch('https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson')
    .then(r => r.json())
    .then(data => {
      const coords = data?.routes?.[0]?.geometry?.coordinates;
      if (coords && coords.length > 1) {
        const latlngs = coords.map(c => [c[1], c[0]]);
        L.polyline(latlngs, { color: '#FFFFFF', weight: 10, opacity: 0.95 }).addTo(map);
        L.polyline(latlngs, { color: '${lineColor}', weight: 6, opacity: 1 }).addTo(map);
        L.circleMarker(latlngs[0], { radius: 6, fillColor: '#FFFFFF', color: '${lineColor}', weight: 3, fillOpacity: 1 }).addTo(map);
        L.circleMarker(latlngs[latlngs.length - 1], { radius: 6, fillColor: '${lineColor}', color: '#FFFFFF', weight: 2, fillOpacity: 1 }).addTo(map);

        let progress = 0.05;
        setInterval(() => {
          progress += 0.004;
          if (progress > 0.96) progress = 0.04;
          const exact = progress * (latlngs.length - 1);
          const idx = Math.min(latlngs.length - 2, Math.floor(exact));
          const frac = exact - idx;
          const lat = latlngs[idx][0] + (latlngs[idx + 1][0] - latlngs[idx][0]) * frac;
          const lon = latlngs[idx][1] + (latlngs[idx + 1][1] - latlngs[idx][1]) * frac;
          taxiMarker.setLatLng([lat, lon]);
        }, 60);
      }
    }).catch(() => {});
</script>
</body>
</html>`;

    return (
      <View style={[styles.mapViewport, { width, height }]}>
        {React.createElement('iframe', {
          srcDoc: htmlDoc,
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
          },
          title: 'Carte OSRM SIRA',
        })}
      </View>
    );
  }

  const centerWorldX = lonToWorldX(center.lon, zoom) - panOffset.x;
  const centerWorldY = latToWorldY(center.lat, zoom) - panOffset.y;
  const topLeftWorldX = centerWorldX - width / 2;
  const topLeftWorldY = centerWorldY - height / 2;

  const startTileX = Math.floor(topLeftWorldX / TILE_SIZE);
  const endTileX = Math.floor((topLeftWorldX + width) / TILE_SIZE);
  const startTileY = Math.floor(topLeftWorldY / TILE_SIZE);
  const endTileY = Math.floor((topLeftWorldY + height) / TILE_SIZE);
  const maxTileIndex = Math.pow(2, zoom);

  const tiles: {
    key: string;
    url: string;
    left: number;
    top: number;
  }[] = [];

  for (let tx = startTileX; tx <= endTileX; tx++) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      if (ty < 0 || ty >= maxTileIndex) continue;
      const wrappedTx = ((tx % maxTileIndex) + maxTileIndex) % maxTileIndex;
      const left = tx * TILE_SIZE - topLeftWorldX;
      const top = ty * TILE_SIZE - topLeftWorldY;
      tiles.push({
        key: `${zoom}-${wrappedTx}-${ty}`,
        url: `https://tile.openstreetmap.org/${zoom}/${wrappedTx}/${ty}.png`,
        left,
        top,
      });
    }
  }

  const latLonToScreen = (pt: LatLon) => {
    const wx = lonToWorldX(pt.lon, zoom);
    const wy = latToWorldY(pt.lat, zoom);
    return {
      x: wx - topLeftWorldX,
      y: wy - topLeftWorldY,
    };
  };

  // Compute clean OSRM line segments
  const polylineSegments = useMemo(() => {
    const segs: {
      key: string;
      cx: number;
      cy: number;
      length: number;
      angleDeg: number;
      color: string;
    }[] = [];

    const primaryColor = routeStyle === 'blue' ? '#1D70F5' : '#EF6622';

    for (let i = 0; i < routeCoords.length - 1; i++) {
      const p1 = latLonToScreen(routeCoords[i]);
      const p2 = latLonToScreen(routeCoords[i + 1]);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.hypot(dx, dy);
      if (length < 1) continue;

      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

      segs.push({
        key: `seg-${i}`,
        cx,
        cy,
        length: length + 3,
        angleDeg,
        color: primaryColor,
      });
    }
    return segs;
  }, [routeCoords, zoom, topLeftWorldX, topLeftWorldY, routeStyle]);

  const handleZoomIn = () => {
    setZoom((z) => Math.min(17, z + 1));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(10, z - 1));
  };

  const handleRecenter = () => {
    setCenter(animatedTaxiPosition);
    setPanOffset({ x: 0, y: 0 });
  };

  const startPointScreen = latLonToScreen(routeCoords[0] || origin);
  const endPointScreen = latLonToScreen(
    routeCoords[routeCoords.length - 1] || destination
  );
  const taxiScreenPos = latLonToScreen(animatedTaxiPosition);

  return (
    <View
      style={[styles.mapViewport, { width, height }]}
      {...panResponder.panHandlers}
    >
      {/* 1. OpenStreetMap Tiles via ExpoImage */}
      {tiles.map((tile) => (
        <ExpoImage
          key={tile.key}
          source={{
            uri: tile.url,
            headers: {
              'User-Agent': 'SiraChauffeurApp/1.0 (https://sira.ci)',
            },
          }}
          style={[
            styles.tileImage,
            {
              left: tile.left,
              top: tile.top,
            },
          ]}
          contentFit="cover"
        />
      ))}

      {/* 2. Clean OSRM Route Line (White Casing + Vibrant Orange/Blue Line) */}
      {polylineSegments.map((seg) => (
        <View
          key={`${seg.key}-casing`}
          pointerEvents="none"
          style={[
            styles.routeSegmentCasing,
            {
              width: seg.length,
              left: seg.cx - seg.length / 2,
              top: seg.cy - 5,
              transform: [{ rotate: `${seg.angleDeg}deg` }],
            },
          ]}
        />
      ))}

      {polylineSegments.map((seg) => (
        <View
          key={seg.key}
          pointerEvents="none"
          style={[
            styles.routeSegmentFill,
            {
              width: seg.length,
              left: seg.cx - seg.length / 2,
              top: seg.cy - 3,
              backgroundColor: seg.color,
              transform: [{ rotate: `${seg.angleDeg}deg` }],
            },
          ]}
        />
      ))}

      {/* 3. Start & End Dots on the Line */}
      <View
        pointerEvents="none"
        style={[
          styles.endpointDotStart,
          {
            left: startPointScreen.x - 7,
            top: startPointScreen.y - 7,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.endpointDotEnd,
          {
            left: endPointScreen.x - 8,
            top: endPointScreen.y - 8,
          },
        ]}
      />

      {/* 4. Animated Orange SIRA Taxi Moving Along the Line */}
      <View
        pointerEvents="none"
        style={[
          styles.taxiMarkerContainer,
          {
            left: taxiScreenPos.x - 36,
            top: taxiScreenPos.y - 36,
          },
        ]}
      >
        {showDriverPulse && <View style={styles.taxiPulseHalo} />}
        <RNImage
          source={require('../../assets/images/icons/taxi-marker-hd.png')}
          style={styles.taxiIconImage}
          resizeMode="contain"
        />
      </View>

      {/* 5. OSRM Live Route Info Pill */}
      <View style={styles.osrmBadgePill} pointerEvents="none">
        {loadingOsrm ? (
          <ActivityIndicator size="small" color="#EF6622" />
        ) : (
          <View style={styles.osrmLiveDot} />
        )}
        <Text style={styles.osrmBadgeText}>
          {osrmSummary
            ? `Taxi en mouvement • ${osrmSummary.distanceKm} km (${osrmSummary.durationMin} min)`
            : 'Taxi en mouvement sur la ligne'}
        </Text>
      </View>

      {/* 6. Interactive Zoom (+ / -) & Follow Taxi Controls */}
      <View style={styles.mapControlsColumn}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Suivre mon taxi"
          onPress={handleRecenter}
          style={({ pressed }) => [
            styles.controlBtn,
            pressed && styles.controlBtnPressed,
          ]}
        >
          <View style={styles.targetOuter}>
            <View style={styles.targetInner} />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zoomer"
          onPress={handleZoomIn}
          style={({ pressed }) => [
            styles.controlBtn,
            pressed && styles.controlBtnPressed,
          ]}
        >
          <Text style={styles.controlBtnText}>+</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dézoomer"
          onPress={handleZoomOut}
          style={({ pressed }) => [
            styles.controlBtn,
            pressed && styles.controlBtnPressed,
          ]}
        >
          <Text style={styles.controlBtnText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapViewport: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#EDF1F5',
  },
  tileImage: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  routeSegmentCasing: {
    position: 'absolute',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  routeSegmentFill: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
  },
  endpointDotStart: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#EF6622',
  },
  endpointDotEnd: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF6622',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  taxiMarkerContainer: {
    position: 'absolute',
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxiPulseHalo: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 102, 34, 0.25)',
  },
  taxiIconImage: {
    width: 44,
    height: 44,
  },
  osrmBadgePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  osrmLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  osrmBadgeText: {
    color: '#1E293B',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    fontWeight: '600',
  },
  mapControlsColumn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    gap: 6,
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
  controlBtnPressed: {
    backgroundColor: '#FFF3EC',
  },
  controlBtnText: {
    color: '#111827',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  targetOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF6622',
  },
});
