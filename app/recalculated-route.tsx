import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OsmMapView } from '@/components/osm-map-view';
import { CustomBottomTabBar } from '@/components/custom-bottom-tab-bar';
import { SideMenuModal } from '@/components/side-menu-modal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RecalculatedOption {
  id: string;
  title: string;
  steps: Array<{ type: 'walk' | 'bus'; duration: string }>;
  costRange: string;
  departureTime: string;
  arrivalTime: string;
  trafficStatus: string;
  distance: string;
  durationTotal: string;
}

const RECALCULATED_OPTIONS: RecalculatedOption[] = [
  {
    id: 'coule',
    title: 'Coulé',
    steps: [
      { type: 'walk', duration: '5 min' },
      { type: 'bus', duration: '7 min' },
      { type: 'walk', duration: '9 min' },
    ],
    costRange: 'entre 500F et 1.500F',
    departureTime: '09H30',
    arrivalTime: '10H30',
    trafficStatus: 'Trafic modéré',
    distance: '18 Km',
    durationTotal: '24 min',
  },
  {
    id: 'debout',
    title: 'Debout',
    steps: [
      { type: 'walk', duration: '5 min' },
      { type: 'bus', duration: '7 min' },
      { type: 'walk', duration: '9 min' },
      { type: 'bus', duration: '3 min' },
    ],
    costRange: 'entre 500F et 1.500F',
    departureTime: '09H30',
    arrivalTime: '10H30',
    trafficStatus: 'Trafic modéré',
    distance: '18 Km',
    durationTotal: '24 min',
  },
  {
    id: 'suspendu',
    title: 'Suspendu',
    steps: [
      { type: 'walk', duration: '5 min' },
      { type: 'bus', duration: '7 min' },
      { type: 'walk', duration: '9 min' },
      { type: 'bus', duration: '3 min' },
    ],
    costRange: 'entre 500F et 1.500F',
    departureTime: '09H30',
    arrivalTime: '10H30',
    trafficStatus: 'Trafic modéré',
    distance: '18 Km',
    durationTotal: '24 min',
  },
];

export default function RecalculatedRouteScreen() {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = React.useState(false);

  const params = useLocalSearchParams<{
    departure?: string;
    arrival?: string;
  }>();

  const departure = params.departure || 'Boulevard Latrille';
  const arrival = params.arrival || 'Orange Digital Center';

  const handleOpenDetail = (option: RecalculatedOption) => {
    router.push({
      pathname: '/route-detail',
      params: {
        departure,
        arrival,
        mode: option.title,
        durationMinutes: option.durationTotal,
        distance: option.distance,
        costRange: option.costRange,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtnWrapper}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Itinéraire recalculé
          </Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications" size={22} color="#000000" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertIconButton}
              onPress={() => router.push('/traffic')}
              activeOpacity={0.8}
            >
              <Ionicons name="warning" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upper Map Section */}
        <View style={styles.mapSectionContainer}>
          <OsmMapView
            style={styles.mapImage}
            departureName={departure}
            arrivalName={arrival}
          />

          {/* Red Accident Callout Badge on Map */}
          <View style={styles.accidentCalloutCard}>
            <View style={styles.warningCircleSmall}>
              <Ionicons name="warning" size={12} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.calloutTitle}>Accident</Text>
              <Text style={styles.calloutSub}>Circulation ralentie</Text>
            </View>
          </View>

          {/* Destination Pin Badge */}
          <View style={styles.destinationPinBadge}>
            <View style={styles.destIconWrapper}>
              <Ionicons name="business" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.destTextWrapper}>
              <Text style={styles.destTitle}>DESTINATION</Text>
              <Text style={styles.destSubTitle}>Orange CI / Orange Digital Center</Text>
            </View>
          </View>

          {/* Compass FAB */}
          <TouchableOpacity style={styles.mapCompassFab} activeOpacity={0.85}>
            <Ionicons name="navigate-sharp" size={20} color="#F26522" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Recalculated Options List */}
        <ScrollView
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {RECALCULATED_OPTIONS.map((option) => (
            <View key={option.id} style={styles.routeCard}>
              <View style={styles.cardMainContent}>
                {/* Left Column: Title & Steps & Schedule */}
                <View style={styles.cardLeftCol}>
                  <Text style={styles.cardTitle}>{option.title}</Text>

                  {/* Step Badges Row */}
                  <View style={styles.stepBadgesRow}>
                    {option.steps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <Text style={styles.stepSeparator}>- -</Text>}
                        <View style={styles.stepPill}>
                          <Ionicons
                            name={step.type === 'walk' ? 'walk' : 'bus'}
                            size={13}
                            color="#FFFFFF"
                            style={{ marginRight: 3 }}
                          />
                          <Text style={styles.stepPillText}>{step.duration}</Text>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>

                  {/* Cost Line */}
                  <Text style={styles.cardMetaLine}>
                    Coût : <Text style={styles.cardMetaSub}>entre </Text>
                    <Text style={styles.cardMetaBold}>500F</Text>
                    <Text style={styles.cardMetaSub}> et </Text>
                    <Text style={styles.cardMetaBold}>1.500F</Text>
                  </Text>

                  {/* Depart / Arrival Schedule Line */}
                  <Text style={styles.cardMetaLine}>
                    Depart : <Text style={styles.cardMetaBold}>{option.departureTime}</Text>
                    {'  '}Arrivée : <Text style={styles.cardMetaBold}>{option.arrivalTime}</Text>
                  </Text>
                </View>

                {/* Right Column: Traffic & Distance & Detail Button */}
                <View style={styles.cardRightCol}>
                  {/* Traffic Status Header */}
                  <View style={styles.trafficHeaderRow}>
                    <Ionicons name="car-sport" size={14} color="#000000" style={{ marginRight: 4 }} />
                    <Text style={styles.trafficHeaderText}>{option.trafficStatus}</Text>
                  </View>

                  {/* Distance & Duration */}
                  <Text style={styles.distanceText}>
                    sur <Text style={styles.distanceBold}>{option.distance}</Text>
                  </Text>
                  <Text style={styles.durationLine}>
                    en <Text style={styles.durationBig}>{option.durationTotal}</Text>
                  </Text>

                  {/* Orange + Detail Button */}
                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => handleOpenDetail(option)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.detailPlusCircle}>
                      <Ionicons name="add" size={14} color="#F26522" />
                    </View>
                    <Text style={styles.detailBtnText}>Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Side Menu Drawer */}
        <SideMenuModal
          visible={showSideMenu}
          onClose={() => setShowSideMenu(false)}
        />
      </SafeAreaView>

      {/* Bottom Navigation Tab Bar */}
      <CustomBottomTabBar activeTab="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtnWrapper: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    backgroundColor: '#F26522',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
  alertIconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapSectionContainer: {
    height: Math.max(180, SCREEN_HEIGHT * 0.26),
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  accidentCalloutCard: {
    position: 'absolute',
    top: '18%',
    left: '18%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    elevation: 3,
  },
  warningCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
    fontFamily: 'Montserrat-Bold',
  },
  calloutSub: {
    fontSize: 8,
    color: '#DC2626',
    fontWeight: '500',
    fontFamily: 'Montserrat-Regular',
  },
  destinationPinBadge: {
    position: 'absolute',
    bottom: '12%',
    right: '6%',
    backgroundColor: '#002B66',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  destIconWrapper: {
    padding: 2,
  },
  destTextWrapper: {
    gap: 1,
  },
  destTitle: {
    color: '#FF4500',
    fontSize: 8,
    fontWeight: '900',
    fontFamily: 'Montserrat-Bold',
  },
  destSubTitle: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: 'Montserrat-Bold',
  },
  mapCompassFab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardsScrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cardsScrollContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 90,
    gap: 8,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1.5,
  },
  cardMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 14.5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  stepBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
    gap: 3,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  stepPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
  stepSeparator: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginHorizontal: 1,
  },
  cardMetaLine: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: '#334155',
    marginBottom: 2,
  },
  cardMetaSub: {
    color: '#64748B',
    fontFamily: 'Montserrat-Regular',
  },
  cardMetaBold: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  cardRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  trafficHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  trafficHeaderText: {
    fontSize: 10.5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  distanceText: {
    fontSize: 10.5,
    fontFamily: 'Montserrat-Regular',
    color: '#475569',
    marginBottom: 1,
  },
  distanceBold: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  durationLine: {
    fontSize: 10.5,
    fontFamily: 'Montserrat-Regular',
    color: '#475569',
    marginBottom: 5,
  },
  durationBig: {
    fontSize: 14.5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '900',
    color: '#000000',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    gap: 4,
  },
  detailPlusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
});
