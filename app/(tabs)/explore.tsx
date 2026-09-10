import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type TransportMode = 'Coulé' | 'Debout' | 'Suspendu';
type FilterType = 'Tout' | 'Marche' | 'Bus' | 'Taxi';

interface RouteOption {
  id: string;
  mode: TransportMode;
  subtext: string;
  steps: { type: 'walk' | 'bus' | 'taxi'; duration: string }[];
  trafficStatus: string;
  distance: string;
  durationMinutes: string;
  costRange: string;
  departureTime: string;
  arrivalTime: string;
}

export default function RouteExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string; destination?: string }>();

  // State for Departure & Arrival (Dynamic from query params or manual entry)
  const [departure, setDeparture] = useState('Abobo Samaké');
  const [arrival, setArrival] = useState('Orange Digital Center');

  const [selectedMode, setSelectedMode] = useState<TransportMode>('Coulé');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tout');
  const [showDetail, setShowDetail] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);

  // Sync incoming search params from Home screen into arrival state
  useEffect(() => {
    const incoming = params.query || params.destination;
    if (incoming && incoming.trim().length > 0) {
      setArrival(incoming.trim());
    }
  }, [params.query, params.destination]);

  // Swap Departure and Arrival locations
  const handleSwapLocations = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const routeOptions: RouteOption[] = [
    {
      id: 'coule-1',
      mode: 'Coulé',
      subtext: 'Moindre cher',
      steps: [
        { type: 'walk', duration: '5 min' },
        { type: 'bus', duration: '7 min' },
        { type: 'walk', duration: '9 min' },
        { type: 'bus', duration: '...' },
      ],
      trafficStatus: 'Trafic modéré',
      distance: '18 Km',
      durationMinutes: '24',
      costRange: 'entre 500F et 1.500F',
      departureTime: '09H30',
      arrivalTime: '10H30',
    },
    {
      id: 'debout-1',
      mode: 'Debout',
      subtext: 'Standard',
      steps: [
        { type: 'walk', duration: '5 min' },
        { type: 'bus', duration: '7 min' },
        { type: 'walk', duration: '9 min' },
        { type: 'bus', duration: '3 min' },
      ],
      trafficStatus: 'Trafic modéré',
      distance: '18 Km',
      durationMinutes: '24',
      costRange: 'entre 500F et 1.500F',
      departureTime: '09H30',
      arrivalTime: '10H30',
    },
    {
      id: 'suspendu-1',
      mode: 'Suspendu',
      subtext: 'Confort',
      steps: [
        { type: 'walk', duration: '3 min' },
        { type: 'taxi', duration: '15 min' },
        { type: 'walk', duration: '2 min' },
      ],
      trafficStatus: 'Trafic fluide',
      distance: '18 Km',
      durationMinutes: '18',
      costRange: 'entre 2.000F et 3.500F',
      departureTime: '09H30',
      arrivalTime: '09H48',
    },
  ];

  const modesList: { name: TransportMode; subtitle: string; icon: keyof typeof Ionicons.glyphMap; isVip?: boolean }[] = [
    { name: 'Coulé', subtitle: 'Moindre cher', icon: 'people' },
    { name: 'Debout', subtitle: 'Standard', icon: 'sparkles' },
    { name: 'Suspendu', subtitle: 'Confort', icon: 'trophy', isVip: true },
  ];

  // Filter options based on active selection
  const filteredRouteOptions = routeOptions.filter((opt) => {
    if (activeFilter === 'Tout') return true;
    if (activeFilter === 'Marche') return opt.steps.some((s) => s.type === 'walk');
    if (activeFilter === 'Bus') return opt.steps.some((s) => s.type === 'bus');
    if (activeFilter === 'Taxi') return opt.steps.some((s) => s.type === 'taxi');
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.logoRow}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtnWrapper}>
              <Ionicons name="arrow-back" size={20} color="#000000" />
            </TouchableOpacity>
            <Image
              source={require('@/assets/images/sira-logo-official.png')}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.headerRightActions}>
            {/* Notification Bell with Red Badge "5" */}
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => setShowFeedback(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications" size={22} color="#000000" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            {/* Hamburger Menu */}
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
              <Ionicons name="menu" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Departure & Arrival Card (Interactive Editable Inputs + Swap) */}
          <View style={styles.routeInputCard}>
            <View style={styles.routeTimelineCol}>
              {/* Departure Dot (Orange ring with inner dot) */}
              <View style={styles.deptRingDot}>
                <View style={styles.deptInnerDot} />
              </View>
              {/* Dotted Vertical Line */}
              <View style={styles.verticalDottedLine} />
              {/* Arrival Orange Location Pin */}
              <Ionicons name="location-sharp" size={20} color="#F26522" />
            </View>

            <View style={styles.routeInputsCol}>
              {/* Departure Row */}
              <View style={styles.inputItemRow}>
                <Text style={styles.inputLabel}>Départ</Text>
                <TextInput
                  style={styles.inputValueInput}
                  value={departure}
                  onChangeText={setDeparture}
                  placeholder="Lieu de départ"
                  placeholderTextColor="#999999"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.cardInputDivider} />

              {/* Arrival Row */}
              <View style={styles.inputItemRow}>
                <Text style={styles.inputLabel}>Arrivée</Text>
                <TextInput
                  style={styles.inputValueInput}
                  value={arrival}
                  onChangeText={setArrival}
                  placeholder="Lieu d'arrivée"
                  placeholderTextColor="#999999"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Interactive Swap Button */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical" size={22} color="#F26522" />
            </TouchableOpacity>
          </View>

          {/* Horizontal Transport Filter Chips Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScrollView}
            contentContainerStyle={styles.filtersContentContainer}
          >
            {(['Tout', 'Marche', 'Bus', 'Taxi'] as FilterType[]).map((filterItem) => {
              const isActive = activeFilter === filterItem;
              const iconName: keyof typeof Ionicons.glyphMap =
                filterItem === 'Tout'
                  ? 'grid'
                  : filterItem === 'Marche'
                  ? 'walk'
                  : filterItem === 'Bus'
                  ? 'bus'
                  : 'car';

              return (
                <TouchableOpacity
                  key={filterItem}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filterItem)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={iconName}
                    size={14}
                    color={isActive ? '#FFFFFF' : '#333333'}
                  />
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {filterItem}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 3 Main Mode Selection Cards (Black Cards) */}
          <View style={styles.modeCardsRow}>
            {modesList.map((modeItem) => {
              const isSelected = selectedMode === modeItem.name;
              return (
                <TouchableOpacity
                  key={modeItem.name}
                  style={[
                    styles.modeCard,
                    isSelected && styles.modeCardActive,
                  ]}
                  onPress={() => setSelectedMode(modeItem.name)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={modeItem.icon} size={17} color="#FFFFFF" />
                  <View style={styles.modeCardTextWrapper}>
                    {modeItem.isVip && <Text style={styles.vipBadgeText}>VIP</Text>}
                    <Text style={styles.modeCardTitle}>{modeItem.name}</Text>
                    <Text style={styles.modeCardSub}>{modeItem.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Enlarged Map Display View (Height increased for maximum readability) */}
          <View style={styles.mapContainer}>
            <Image
              source={require('@/assets/images/map-abidjan-routes.png')}
              style={styles.mapImage}
              contentFit="contain"
            />
          </View>

          {/* Section Header Bar above Route Options */}
          <View style={styles.sectionHeaderBar}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionHeaderIconCircle}>
                <Ionicons name="navigate" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.sectionHeaderTitle}>Itinéraires proposés</Text>
            </View>
            <View style={styles.sectionHeaderBadge}>
              <Text style={styles.sectionHeaderBadgeText}>{filteredRouteOptions.length}</Text>
            </View>
          </View>

          {/* Route Options Result Cards (Coulé, Debout, Suspendu) */}
          <View style={styles.resultsContainer}>
            {filteredRouteOptions.map((option) => (
              <View
                key={option.id}
                style={[
                  styles.resultCard,
                  selectedMode === option.mode && styles.resultCardHighlighted,
                ]}
              >
                {/* Header: Mode Title & Traffic Stats */}
                <View style={styles.resultCardTopRow}>
                  <Text style={styles.resultModeTitle}>{option.mode}</Text>

                  <View style={styles.resultRightStats}>
                    <View style={styles.trafficRow}>
                      <Ionicons name="bus-outline" size={14} color="#000000" />
                      <Text style={styles.trafficText}>{option.trafficStatus}</Text>
                    </View>
                    <Text style={styles.distanceText}>sur {option.distance}</Text>
                    <View style={styles.durationWrapper}>
                      <Text style={styles.durationPrefix}>en </Text>
                      <Text style={styles.durationBold}>{option.durationMinutes}</Text>
                      <Text style={styles.durationUnit}> min</Text>
                    </View>
                  </View>
                </View>

                {/* Steps Pills Row */}
                <View style={styles.stepsPillsRow}>
                  {option.steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <View style={styles.stepTag}>
                        <Ionicons
                          name={step.type === 'walk' ? 'walk' : step.type === 'bus' ? 'bus' : 'car'}
                          size={12}
                          color="#FFFFFF"
                        />
                        <Text style={styles.stepTagText}>{step.duration}</Text>
                      </View>
                      {sIdx < option.steps.length - 1 && (
                        <Text style={styles.stepSeparator}>-</Text>
                      )}
                    </React.Fragment>
                  ))}
                </View>

                {/* Bottom Row: Cost, Times & Detail Button */}
                <View style={styles.resultCardBottomRow}>
                  <View style={styles.priceTimeCol}>
                    <Text style={styles.costText}>
                      Coût : <Text style={styles.boldText}>{option.costRange}</Text>
                    </Text>
                    <Text style={styles.timesText}>
                      Départ : <Text style={styles.boldText}>{option.departureTime}</Text> • Arrivée :{' '}
                      <Text style={styles.boldText}>{option.arrivalTime}</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.detailPillBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/route-detail',
                        params: { departure, arrival, mode: option.mode },
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Ionicons name="add" size={16} color="#FFFFFF" />
                    <Text style={styles.detailPillBtnText}>Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Full-Screen Detailed Itinerary Breakdown ("Décomposition d'itinéraire") */}
        {showDetail && (
          <View style={styles.fullDecompositionContainer}>
            {/* Top Header Bar */}
            <View style={styles.decompHeaderBar}>
              <TouchableOpacity
                onPress={() => setShowDetail(false)}
                style={styles.backBtnWrapper}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>

              <Text style={styles.decompHeaderTitle}>Décomposition d'itinéraire</Text>

              <View style={styles.decompHeaderRightIcons}>
                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={() => setShowFeedback(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="notifications" size={22} color="#000000" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>5</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
                  <Ionicons name="warning" size={22} color="#ED1C24" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Top Half: Interactive Map Section */}
            <View style={styles.decompMapSection}>
              <Image
                source={require('@/assets/images/city-route-3d-bg.jpg')}
                style={styles.decompMapImage}
                contentFit="cover"
              />

              {/* Map Route Legend (Top Right) */}
              <View style={styles.mapLegendCard}>
                <View style={styles.legendRowItem}>
                  <View style={[styles.legendLineBar, { backgroundColor: '#F26522' }]} />
                  <Ionicons name="star" size={14} color="#F26522" />
                </View>
                <View style={styles.legendRowItem}>
                  <View style={[styles.legendLineBar, { backgroundColor: '#1E6091' }]} />
                  <Ionicons name="ribbon" size={14} color="#1E6091" />
                </View>
              </View>

              {/* Map Traffic Alerts */}
              <View style={[styles.mapTrafficCallout, styles.accidentCallout]}>
                <Ionicons name="warning-outline" size={14} color="#E53E3E" />
                <View>
                  <Text style={styles.accidentTitle}>Accident</Text>
                  <Text style={styles.accidentSub}>circulation ralentie</Text>
                </View>
              </View>

              <View style={[styles.mapTrafficCallout, styles.routePerturbeeCallout]}>
                <Ionicons name="construct-outline" size={14} color="#F26522" />
                <Text style={styles.routePerturbeeText}>Route perturbée</Text>
              </View>

              {/* Station Badges on Map */}
              <View style={styles.departStationBadge}>
                <Text style={styles.departTag}>DÉPART</Text>
                <Text style={styles.departName}>Abobo Sanmake</Text>
              </View>

              {/* Floating Orange Navigation Compass Button */}
              <TouchableOpacity style={styles.mapCompassFab} activeOpacity={0.85}>
                <Ionicons name="navigate" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Bottom Half: Detailed Timeline Itinerary Breakdown */}
            <ScrollView
              style={styles.decompScrollView}
              contentContainerStyle={styles.decompScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.decompTimelineRowLayout}>
                {/* Left Vertical Dashed Line Bar */}
                <View style={styles.timelineDashedLine} />

                {/* Timeline Steps */}
                <View style={styles.timelineStepsCol}>
                  {/* Step 1: Walk */}
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepCircleIcon}>
                      <Ionicons name="walk" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stepInfoCol}>
                      <Text style={styles.stepTitleText}>Marchez pendant 6 min</Text>
                      <Text style={styles.stepDescText}>
                        Depuis Abobo Terminus jusqu'à <Text style={styles.boldText}>Gare d'Adjamé</Text>.
                      </Text>
                      <Text style={styles.stepMetaText}>09:20 → 09:26 • 450 m</Text>
                    </View>
                  </View>

                  {/* Step 2: Bus 22 */}
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepCircleIcon}>
                      <Ionicons name="bus" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stepInfoCol}>
                      <Text style={styles.stepTitleText}>Prenez le Bus 22 pendant 20 min</Text>
                      <Text style={styles.stepDescText}>
                        Direction <Text style={styles.boldText}>Riviera Palmeraie</Text>.
                      </Text>
                      <Text style={styles.stepDescText}>
                        Montez à <Text style={styles.boldText}>Gare d'Adjamé</Text> et descendez au <Text style={styles.boldText}>Rond-Point de la Riviera</Text>.
                      </Text>
                      <Text style={styles.stepCostText}>Coût estimé : 200 FCFA</Text>
                      <Text style={styles.stepMetaText}>09:26 → 09:46</Text>
                    </View>
                  </View>

                  {/* Step 3: Taxi */}
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepCircleIcon}>
                      <Ionicons name="car" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stepInfoCol}>
                      <Text style={styles.stepTitleText}>Prenez un taxi pendant 7 min</Text>
                      <Text style={styles.stepDescText}>
                        Depuis le <Text style={styles.boldText}>Rond-Point de la Riviera</Text> jusqu'à <Text style={styles.boldText}>Cocody Riviera 3</Text>.
                      </Text>
                      <Text style={styles.stepCostText}>Coût estimé : 1 000 FCFA</Text>
                      <Text style={styles.stepMetaText}>09:46 → 09:53 • 3,2 km</Text>
                    </View>
                  </View>

                  {/* Step 4: Walk */}
                  <View style={styles.stepItemRow}>
                    <View style={styles.stepCircleIcon}>
                      <Ionicons name="walk" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stepInfoCol}>
                      <Text style={styles.stepTitleText}>Marchez pendant 5 min</Text>
                      <Text style={styles.stepDescText}>
                        Il ne vous reste plus qu'à marcher jusqu'à votre destination.
                      </Text>
                      <Text style={styles.stepMetaText}>09:53 → 09:58 • 350 m</Text>
                    </View>
                  </View>

                  {/* Step 5: Destination Pin */}
                  <View style={styles.stepItemRow}>
                    <View style={[styles.stepCircleIcon, { backgroundColor: '#F26522' }]}>
                      <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
                    </View>
                    <View style={styles.stepInfoCol}>
                      <Text style={styles.destTitleText}>{arrival || 'Orange Digital Center'}</Text>
                      <Text style={styles.stepDescText}>
                        Vous êtes bien arrivé ! Votre trajet est terminé.
                      </Text>
                      <View style={styles.destActionsRow}>
                        <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                          <Ionicons name="thumbs-up-outline" size={18} color="#222222" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                          <Ionicons name="share-social-outline" size={18} color="#222222" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                          <Ionicons name="bookmark-outline" size={18} color="#222222" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Floating Assistant Speech Bubble + Character + Start Button (Right Side) */}
                <View style={styles.assistantColumn}>
                  {/* Floating Speech Bubble */}
                  <View style={styles.floatingBubbleBox}>
                    <Text style={styles.bubbleText}>
                      Voici comment <Text style={styles.bubbleBoldText}>vous</Text> allez <Text style={styles.bubbleBoldText}>rejoindre</Text> votre destination.
                    </Text>
                  </View>

                  {/* 3D Character Assistant pointing hand to timeline */}
                  <Image
                    source={require('@/assets/images/sira-character-assistant.png')}
                    style={styles.pointingCharacterImg}
                    contentFit="contain"
                  />

                  {/* Orange Floating Start Itinerary FAB */}
                  <TouchableOpacity
                    style={styles.startFabButton}
                    onPress={() => setShowFeedback(true)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.startFabInnerCircle}>
                      <Ionicons name="navigate-sharp" size={14} color="#F26522" />
                    </View>
                    <Text style={styles.startFabText}>Démarrer l'itinéraire</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Feedback Rating Popup Modal */}
        {showFeedback && (
          <View style={styles.feedbackModalOverlay}>
            <View style={styles.feedbackCard}>
              <TouchableOpacity
                style={styles.feedbackClose}
                onPress={() => setShowFeedback(false)}
              >
                <Ionicons name="close" size={20} color="#666666" />
              </TouchableOpacity>

              <Image
                source={require('@/assets/images/sira-character-assistant.png')}
                style={styles.feedbackAvatar}
                contentFit="contain"
              />

              <Text style={styles.feedbackTitle}>
                Comment s'est passé votre trajet ?
              </Text>
              <Text style={styles.feedbackSub}>
                Votre avis nous aide à améliorer SIRA.
              </Text>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={28}
                      color="#F26522"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitFeedbackBtn}
                onPress={() => setShowFeedback(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.submitFeedbackText}>Envoyer mon avis</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtnWrapper: {
    padding: 4,
  },
  logoImage: {
    width: 120,
    height: 42,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#F26522',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 30,
  },
  routeInputCard: {
    marginHorizontal: 16,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  routeTimelineCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deptRingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptInnerDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F26522',
  },
  verticalDottedLine: {
    width: 1,
    height: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    marginVertical: 1,
  },
  routeInputsCol: {
    flex: 1,
  },
  inputItemRow: {
    paddingVertical: 1,
  },
  inputLabel: {
    fontSize: 10.5,
    color: '#888888',
    fontWeight: '500',
  },
  inputValueInput: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '800',
    marginTop: 0,
    padding: 0,
  },
  cardInputDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 4,
  },
  swapButton: {
    padding: 6,
    marginLeft: 6,
    backgroundColor: '#FFF4EE',
    borderRadius: 16,
  },
  filtersScrollView: {
    marginTop: 4,
    maxHeight: 34,
  },
  filtersContentContainer: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: '#F26522',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  modeCardsRow: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 4,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modeCardActive: {
    borderColor: '#F26522',
    backgroundColor: '#141414',
  },
  modeCardTextWrapper: {
    alignItems: 'center',
    marginTop: 1,
  },
  vipBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modeCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modeCardSub: {
    fontSize: 9,
    color: '#CCCCCC',
    marginTop: 1,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 6,
    height: 390,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionHeaderIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  sectionHeaderBadge: {
    backgroundColor: '#F26522',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionHeaderBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  resultsContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
  },
  resultCardHighlighted: {
    borderColor: '#F26522',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resultCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultModeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
  },
  resultRightStats: {
    alignItems: 'flex-end',
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  trafficText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },
  distanceText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 1,
  },
  durationWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  durationPrefix: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '600',
  },
  durationBold: {
    fontSize: 19,
    fontWeight: '900',
    color: '#000000',
  },
  durationUnit: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  stepsPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  stepTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    gap: 3,
  },
  stepTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  stepSeparator: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '800',
  },
  resultCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  priceTimeCol: {
    flex: 1,
  },
  costText: {
    fontSize: 10,
    color: '#333333',
  },
  timesText: {
    fontSize: 10,
    color: '#333333',
    marginTop: 1,
  },
  boldText: {
    fontWeight: '800',
    color: '#000000',
  },
  detailPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
    gap: 3,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  detailPillBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  detailModalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  detailModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  closeDetailBtn: {
    padding: 4,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4EE',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  tipAvatar: {
    width: 40,
    height: 40,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  timelineList: {
    gap: 14,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  timelineSub: {
    fontSize: 11,
    color: '#666666',
    marginTop: 1,
  },
  confirmNavBtn: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
  },
  confirmNavText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  fullDecompositionContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 150,
  },
  decompHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  decompHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
  },
  decompHeaderRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decompMapSection: {
    height: height * 0.38,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
  },
  decompMapImage: {
    width: '100%',
    height: '100%',
  },
  mapLegendCard: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLineBar: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  mapTrafficCallout: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  accidentCallout: {
    top: '32%',
    right: '15%',
    borderColor: '#E53E3E',
  },
  accidentTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#E53E3E',
  },
  accidentSub: {
    fontSize: 9.5,
    color: '#E53E3E',
  },
  routePerturbeeCallout: {
    top: '60%',
    left: '40%',
    borderColor: '#F26522',
  },
  routePerturbeeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#F26522',
  },
  departStationBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  departTag: {
    backgroundColor: '#00875A',
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  departName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#000000',
    marginTop: 2,
  },
  mapCompassFab: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  decompScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  decompScrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  decompTimelineRowLayout: {
    flexDirection: 'row',
    position: 'relative',
  },
  timelineDashedLine: {
    position: 'absolute',
    left: 18,
    top: 10,
    bottom: 40,
    width: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
  },
  timelineStepsCol: {
    flex: 1.2,
    paddingLeft: 0,
    gap: 20,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepCircleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  stepInfoCol: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#000000',
  },
  stepDescText: {
    fontSize: 12.5,
    color: '#444444',
    marginTop: 2,
    lineHeight: 17,
  },
  stepCostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    marginTop: 3,
  },
  stepMetaText: {
    fontSize: 11.5,
    color: '#777777',
    fontWeight: '600',
    marginTop: 3,
  },
  destTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F26522',
  },
  destActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  actionIconBtn: {
    padding: 4,
  },
  assistantColumn: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingLeft: 6,
  },
  floatingBubbleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  bubbleText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 15,
  },
  bubbleBoldText: {
    fontWeight: '900',
    color: '#000000',
  },
  pointingCharacterImg: {
    width: 130,
    height: 190,
    marginBottom: 12,
  },
  startFabButton: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  startFabInnerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startFabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  feedbackModalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 200,
  },
  feedbackCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  feedbackClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  feedbackAvatar: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
  },
  feedbackSub: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  submitFeedbackBtn: {
    backgroundColor: '#F26522',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitFeedbackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
