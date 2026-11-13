import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OsrmMap, { LatLon, OsrmMapMarker } from '../components/osrm-map';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TrafficLineItem {
  id: string;
  name: string;
  zone: string;
  duration: string;
  status: 'dense' | 'modere' | 'fluide';
  statusLabel: string;
  reportsCount: number;
  origin: LatLon;
  destination: LatLon;
}

const INITIAL_TRAFFIC_LINES: TrafficLineItem[] = [
  {
    id: '1',
    name: 'Adjamé - Plateau',
    zone: 'Carrefour Indénié • Circulation ralentie',
    duration: '25 min',
    status: 'dense',
    statusLabel: 'Trafic dense',
    reportsCount: 4,
    origin: { lat: 5.3544, lon: -4.0218 },
    destination: { lat: 5.3231, lon: -4.0205 },
  },
  {
    id: '2',
    name: 'Abobo - Adjamé',
    zone: 'Abobo Samaké • Ralentissement léger',
    duration: '18 min',
    status: 'modere',
    statusLabel: 'Modéré',
    reportsCount: 2,
    origin: { lat: 5.4168, lon: -4.0195 },
    destination: { lat: 5.3544, lon: -4.0218 },
  },
  {
    id: '3',
    name: 'Plateau - Marcory',
    zone: 'Pont HKB • Voie dégagée',
    duration: '12 min',
    status: 'fluide',
    statusLabel: 'Trafic fluide',
    reportsCount: 0,
    origin: { lat: 5.3231, lon: -4.0205 },
    destination: { lat: 5.3015, lon: -3.9912 },
  },
];

interface IncidentType {
  id: string;
  label: string;
  points: number;
  circleColor: string;
  symbol: 'jam' | 'accident' | 'closed' | 'flood';
}

const INCIDENT_TYPES: IncidentType[] = [
  {
    id: 'jam',
    label: 'Embouteillage',
    points: 10,
    circleColor: '#F59E0B',
    symbol: 'jam',
  },
  {
    id: 'accident',
    label: 'Accident',
    points: 15,
    circleColor: '#EF4444',
    symbol: 'accident',
  },
  {
    id: 'closed',
    label: 'Route barrée',
    points: 15,
    circleColor: '#DC2626',
    symbol: 'closed',
  },
  {
    id: 'flood',
    label: 'Inondation',
    points: 15,
    circleColor: '#2563EB',
    symbol: 'flood',
  },
];

interface LiveMapPin {
  id: string;
  label: string;
  color: string;
  symbol: 'jam' | 'accident' | 'closed' | 'flood';
  topPercent: number;
  leftPercent: number;
}

export default function TrafficScreen() {
  const insets = useSafeAreaInsets();
  const [activeLine, setActiveLine] = useState('Adjamé - Plateau');
  const [trafficLines, setTrafficLines] = useState<TrafficLineItem[]>(
    INITIAL_TRAFFIC_LINES
  );
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(
    null
  );
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<OsrmMapMarker[]>([
    { id: 't1', lat: 5.344, lon: -4.017, type: 'jam' },
    { id: 't2', lat: 5.336, lon: -4.018, type: 'accident' },
  ]);

  const currentLineObj =
    trafficLines.find((l) => l.name === activeLine) || trafficLines[0];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const handleOpenReport = (incident: IncidentType) => {
    setSelectedIncident(incident);
    setReportModalVisible(true);
  };

  const handleConfirmReport = () => {
    if (!selectedIncident) return;

    setTrafficLines((prev) =>
      prev.map((line) =>
        line.name === activeLine
          ? {
              ...line,
              zone: `${selectedIncident.label} signalé à l'instant`,
              status:
                selectedIncident.id === 'accident' ||
                selectedIncident.id === 'closed'
                  ? 'dense'
                  : 'modere',
              statusLabel: selectedIncident.label,
              reportsCount: line.reportsCount + 1,
            }
          : line
      )
    );

    const midLat =
      (currentLineObj.origin.lat + currentLineObj.destination.lat) / 2 +
      ((mapMarkers.length % 3) - 1) * 0.005;
    const midLon =
      (currentLineObj.origin.lon + currentLineObj.destination.lon) / 2 +
      ((mapMarkers.length % 3) - 1) * 0.004;

    setMapMarkers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        lat: midLat,
        lon: midLon,
        type: selectedIncident.symbol,
        label: selectedIncident.label,
      },
    ]);

    setReportModalVisible(false);
    Alert.alert(
      `+${selectedIncident.points} Points SIRA !`,
      `Merci Diata ! Votre signalement "${selectedIncident.label}" a été ajouté sur la carte OSRM de la ligne ${activeLine}.`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Orange Header */}
      <View
        style={[
          styles.orangeHeader,
          { paddingTop: Math.max(insets.top + 8, 28) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={handleBack}
          hitSlop={12}
          style={({ pressed }) => [
            styles.headerBackButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/arrow-left-orange-hd.png')}
            style={styles.headerBackIcon}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={styles.headerTitle}>Trafic & Lignes</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mes lignes"
          onPress={() => router.push('/lines')}
          hitSlop={12}
          style={({ pressed }) => [
            styles.headerSettingsButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/settings-gear-hd.png')}
            style={styles.headerSettingsIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Live OSRM Traffic Map with Overlays */}
        <View style={styles.mapContainer}>
          <OsrmMap
            width={SCREEN_WIDTH}
            height={230}
            origin={currentLineObj.origin}
            destination={currentLineObj.destination}
            initialZoom={13}
            routeStyle="traffic"
            markers={mapMarkers}
            showDriverPulse
          />

          {/* Top-Right Active Line Status Pill on Map */}
          <View style={styles.mapOverlayPill}>
            <View
              style={[
                styles.mapStatusDot,
                {
                  backgroundColor:
                    currentLineObj.status === 'dense'
                      ? '#EF4444'
                      : currentLineObj.status === 'modere'
                        ? '#EF6622'
                        : '#16A34A',
                },
              ]}
            />
            <View>
              <Text style={styles.mapOverlayTitle}>{currentLineObj.name}</Text>
              <Text style={styles.mapOverlaySubtitle}>
                {currentLineObj.statusLabel} • {currentLineObj.duration}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paddedBody}>
          {/* Quick Incident Reporting Section (4 Map Icons) */}
          <Text style={styles.sectionTitle}>
            Signaler sur la carte ({activeLine}) :
          </Text>
          <Text style={styles.sectionSubtitle}>
            Appuyez sur un icône pour signaler un incident et gagner des points
          </Text>

          <View style={styles.incidentGrid}>
            {INCIDENT_TYPES.map((inc) => (
              <Pressable
                key={inc.id}
                accessibilityRole="button"
                accessibilityLabel={`Signaler ${inc.label}`}
                onPress={() => handleOpenReport(inc)}
                style={({ pressed }) => [
                  styles.incidentCard,
                  pressed && styles.incidentCardPressed,
                ]}
              >
                <View
                  style={[
                    styles.incidentCircle,
                    { backgroundColor: inc.circleColor },
                  ]}
                >
                  {inc.symbol === 'jam' && (
                    <Image
                      source={require('../../assets/images/icons/menu-car-hd.png')}
                      style={styles.incidentIconImage}
                      resizeMode="contain"
                    />
                  )}
                  {inc.symbol === 'accident' && (
                    <Text style={styles.incidentSymbolText}>!</Text>
                  )}
                  {inc.symbol === 'closed' && <View style={styles.closedBar} />}
                  {inc.symbol === 'flood' && (
                    <Text style={styles.incidentWaveText}>≈</Text>
                  )}
                </View>

                <Text style={styles.incidentLabel} numberOfLines={1}>
                  {inc.label}
                </Text>

                <View style={styles.incidentPointsPill}>
                  <Image
                    source={require('../../assets/images/icons/coins-white-hd.png')}
                    style={styles.smallCoinIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.incidentPointsText}>
                    +{inc.points} pts
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Live Traffic by Line Section */}
          <View style={styles.linesHeaderRow}>
            <Text style={styles.sectionTitleLeft}>
              Vos lignes sur la carte :
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gérer mes lignes"
              onPress={() => router.push('/lines')}
            >
              <Text style={styles.manageLinesLink}>Mes lignes ›</Text>
            </Pressable>
          </View>

          <View style={styles.trafficList}>
            {trafficLines.map((line) => {
              const isSelected = line.name === activeLine;
              const badgeBg =
                line.status === 'dense'
                  ? '#EF4444'
                  : line.status === 'modere'
                    ? '#EF6622'
                    : '#16A34A';

              return (
                <Pressable
                  key={line.id}
                  accessibilityRole="button"
                  accessibilityLabel={line.name}
                  onPress={() => setActiveLine(line.name)}
                  style={({ pressed }) => [
                    styles.trafficCard,
                    isSelected && styles.trafficCardSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.routeCircle}>
                    <Image
                      source={require('../../assets/images/icons/menu-route-hd.png')}
                      style={styles.routeIcon}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.trafficDetails}>
                    <View style={styles.trafficTopRow}>
                      <Text style={styles.trafficLineName}>{line.name}</Text>
                      <Text style={styles.trafficDuration}>
                        {line.duration}
                      </Text>
                    </View>

                    <Text style={styles.trafficZoneText} numberOfLines={1}>
                      {line.zone}
                    </Text>

                    <View style={styles.trafficBadgesRow}>
                      <View
                        style={[
                          styles.statusPill,
                          { backgroundColor: badgeBg },
                        ]}
                      >
                        <Text style={styles.statusPillText}>
                          {line.statusLabel}
                        </Text>
                      </View>

                      {isSelected && (
                        <View style={styles.activeTagPill}>
                          <Text style={styles.activeTagText}>
                            Affichée sur la carte
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Dark Navigation Bar (2nd Tab Active with Raised Notch) */}
      <View style={styles.navbarOuter}>
        <View style={styles.navbarBar}>
          {/* Tab 1: Home */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Accueil"
            onPress={() => router.replace('/home')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-home-gray-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 2: Traffic / Cars (Active with Raised White Notch & Orange Circle) */}
          <View style={styles.tabSlot}>
            <View style={styles.activeNotchOuter}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel="Trafic et lignes"
                accessibilityState={{ selected: true }}
                style={styles.activeOrangeCircle}
              >
                <Image
                  source={require('../../assets/images/icons/nav-cars-white-hd.png')}
                  style={styles.activeTabIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>

          {/* Tab 3: Rewards / Trophy */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Mes avantages"
            onPress={() => router.push('/benefits')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-trophy-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 4: Profile */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Mon compte"
            onPress={() => router.replace('/profile')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-user-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {insets.bottom > 0 && (
          <View style={{ height: insets.bottom, backgroundColor: '#333333' }} />
        )}
      </View>

      {/* Confirm Incident Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setReportModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Confirmer le signalement</Text>

            {selectedIncident && (
              <>
                <Text style={styles.modalIncidentName}>
                  {selectedIncident.label} sur {activeLine}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Ce signalement sera affiché en direct sur la carte SIRA et
                  vous rapportera +{selectedIncident.points} points.
                </Text>
              </>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Envoyer le signalement"
              onPress={handleConfirmReport}
              style={({ pressed }) => [
                styles.modalSubmitButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.modalSubmitText}>SIGNALER SUR LA CARTE</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              onPress={() => setReportModalVisible(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orangeHeader: {
    backgroundColor: '#EF6622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerBackButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackIcon: {
    width: 15,
    height: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18.5,
    fontWeight: '600',
  },
  headerSettingsButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSettingsIcon: {
    width: 24,
    height: 24,
  },
  pressed: {
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  mapContainer: {
    width: SCREEN_WIDTH,
    height: 230,
    position: 'relative',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlayPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  mapStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  mapOverlayTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11.5,
    fontWeight: '700',
  },
  mapOverlaySubtitle: {
    color: '#4B5563',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10,
  },
  livePinBubble: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  livePinText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    fontWeight: '700',
  },
  paddedBody: {
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  sectionTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: '#6B7280',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
    marginBottom: 12,
  },
  incidentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  incidentCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  incidentCardPressed: {
    backgroundColor: '#FFF3EC',
    borderColor: '#EF6622',
  },
  incidentCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  incidentIconImage: {
    width: 19,
    height: 19,
  },
  incidentSymbolText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 21,
  },
  closedBar: {
    width: 15,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  incidentWaveText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 21,
  },
  incidentLabel: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  incidentPointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6622',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  smallCoinIcon: {
    width: 9,
    height: 9,
    marginRight: 3,
  },
  incidentPointsText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 8.5,
    fontWeight: '600',
  },
  linesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitleLeft: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14.5,
    fontWeight: '600',
  },
  manageLinesLink: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12.5,
    fontWeight: '700',
  },
  trafficList: {
    width: '100%',
  },
  trafficCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  trafficCardSelected: {
    backgroundColor: '#FFF9F5',
    borderColor: '#EF6622',
  },
  routeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIcon: {
    width: 24,
    height: 24,
  },
  trafficDetails: {
    flex: 1,
    marginLeft: 12,
  },
  trafficTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  trafficLineName: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  trafficDuration: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
  },
  trafficZoneText: {
    color: '#4B5563',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
    marginBottom: 5,
  },
  trafficBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
  },
  activeTagPill: {
    backgroundColor: '#FFEACD',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeTagText: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9.5,
    fontWeight: '700',
  },
  navbarOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  navbarBar: {
    width: '100%',
    height: 56,
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNotchOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  activeOrangeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIcon: {
    width: 24,
    height: 24,
  },
  navIcon: {
    width: 26,
    height: 26,
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCE1E7',
    marginBottom: 14,
  },
  modalTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalIncidentName: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#4B5563',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  modalSubmitButton: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalCancelText: {
    color: '#7C8594',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
});
