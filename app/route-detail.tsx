import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/hooks/use-favorites';
import { OsmMapView } from '@/components/osm-map-view';
import { CustomBottomTabBar } from '@/components/custom-bottom-tab-bar';
import { SideMenuModal } from '@/components/side-menu-modal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type DisplayMode = 'decomposition' | 'full_map';

export default function RouteDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();

  const params = useLocalSearchParams<{
    departure?: string;
    arrival?: string;
    mode?: string;
    suboption?: string;
    durationMinutes?: string;
    distance?: string;
    costRange?: string;
  }>();

  const departure = params.departure || 'Abobo Terminus';
  const arrival = params.arrival || 'Orange Digital Center';
  const modeName = params.mode || 'Coulé';
  const durationText = params.durationMinutes || '24 min';

  const [displayMode, setDisplayMode] = useState<DisplayMode>('decomposition');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const tripTitle = `D’${departure} à ${arrival} (${modeName})`;
  const isFavorite = checkIsFavorite(tripTitle);

  const handleBackPress = () => {
    if (displayMode === 'full_map') {
      setDisplayMode('decomposition');
    } else {
      router.back();
    }
  };

  const handleStartNavigation = () => {
    router.push({
      pathname: '/navigation-active',
      params: {
        departure,
        destination: arrival,
        mode: modeName,
        suboption: params.suboption || 'Gbaka / Bus',
        durationMinutes: durationText,
        distance: params.distance || '18 Km',
      },
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Itinéraire SIRA (${modeName}) : De ${departure} à ${arrival}.\nDurée : ${durationText} | Coût : ${params.costRange || 'entre 500F et 1.500F'}.\nConsultez mon trajet sur SIRA !`,
        title: `Trajet SIRA : ${departure} → ${arrival}`,
      });
    } catch (error) {
      console.log('Erreur lors du partage :', error);
    }
  };

  const handleToggleFavorite = () => {
    const nowFavorite = toggleFavorite({
      departure,
      arrival,
      title: tripTitle,
      mode: modeName,
      transport: params.suboption || 'Gbaka / Bus',
      duration: durationText,
      costRange: params.costRange || 'entre 500F et 1.500F',
    });
    Alert.alert(
      nowFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
      nowFavorite
        ? `Le trajet "${tripTitle}" est enregistré dans vos favoris.`
        : `Le trajet "${tripTitle}" a été retiré de vos favoris.`
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header Bar (Identical on both views) */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backBtnWrapper}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Décomposition d'itinéraire
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

        {/* Main View: Timeline ('decomposition') vs Full Map ('full_map') */}
        <View style={styles.mainContentArea}>
          {displayMode === 'decomposition' ? (
            /* ======================================================== */
            /* VIEW 1: DÉCOMPOSITION D'ITINÉRAIRE ("detail tout")       */
            /* ======================================================== */
            <View style={{ flex: 1, position: 'relative' }}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.timelineScrollContent}
                showsVerticalScrollIndicator={false}
              >
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

                  {/* Compass FAB (Expands Full Map) */}
                  <TouchableOpacity
                    style={styles.mapCompassFabOrange}
                    onPress={() => setDisplayMode('full_map')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="navigate-sharp" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Timeline Breakdown Section */}
                <View style={styles.timelineSectionWrapper}>
                  {/* Watermark Background Decor */}
                  <Image
                    source={require('@/assets/images/signup-map-bg.png')}
                    style={styles.timelineWatermarkBg}
                    contentFit="cover"
                  />

                  {/* Timeline Steps Column */}
                  <View style={styles.timelineColumn}>
                    {/* Sleek Black Vertical Road Line */}
                    <View style={styles.blackRoadStripe}>
                      <View style={styles.dashedCenterLine} />
                    </View>

                    {/* Step 1: Walking 6 min */}
                    <View style={styles.stepItemRow}>
                      <View style={styles.orangeStepIconCircle}>
                        <Ionicons name="walk" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.stepTextWrapper}>
                        <Text style={styles.stepTitle}>Marchez pendant 6 min</Text>
                        <Text style={styles.stepSubDesc}>
                          Depuis {departure} jusqu'à <Text style={styles.boldText}>Gare d'Adjamé.</Text>
                        </Text>
                        <Text style={styles.stepMetaText}>09:20 → 09:26 • 450 m</Text>
                      </View>
                    </View>

                    {/* Step 2: Bus 22 for 20 min */}
                    <View style={styles.stepItemRow}>
                      <View style={styles.orangeStepIconCircle}>
                        <Ionicons name="bus" size={19} color="#FFFFFF" />
                      </View>
                      <View style={styles.stepTextWrapper}>
                        <Text style={styles.stepTitle}>Prenez le Bus 22 pendant 20 min</Text>
                        <Text style={styles.stepSubDesc}>
                          Direction <Text style={styles.boldText}>Riviera Palmeraie.</Text>{'\n'}
                          Montez à <Text style={styles.boldText}>Gare d'Adjamé</Text> et descendez au{' '}
                          <Text style={styles.boldText}>Rond-Point de la Riviera.</Text>
                        </Text>
                        <View style={styles.costBadgeContainer}>
                          <Text style={styles.stepCostText}>
                            Coût estimé : <Text style={styles.boldText}>200 FCFA</Text>
                          </Text>
                        </View>
                        <Text style={styles.stepMetaText}>09:26 → 09:46</Text>
                      </View>
                    </View>



                    {/* Step 3: Taxi 7 min */}
                    <View style={styles.stepItemRow}>
                      <View style={styles.orangeStepIconCircle}>
                        <Ionicons name="bus" size={19} color="#FFFFFF" />
                      </View>
                      <View style={styles.stepTextWrapper}>
                        <Text style={styles.stepTitle}>Prenez un taxi pendant 7 min</Text>
                        <Text style={styles.stepSubDesc}>
                          Depuis le <Text style={styles.boldText}>Rond-Point de la Riviera</Text> jusqu'à{' '}
                          <Text style={styles.boldText}>Cocody Riviera 3.</Text>
                        </Text>
                        <View style={styles.costBadgeContainer}>
                          <Text style={styles.stepCostText}>
                            Coût estimé : <Text style={styles.boldText}>1 000 FCFA</Text>
                          </Text>
                        </View>
                        <Text style={styles.stepMetaText}>09:46 → 09:53 • 3,2 km</Text>
                      </View>
                    </View>

                    {/* Step 4: Walking 5 min */}
                    <View style={styles.stepItemRow}>
                      <View style={styles.orangeStepIconCircle}>
                        <Ionicons name="walk" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.stepTextWrapper}>
                        <Text style={styles.stepTitle}>Marchez pendant 5 min</Text>
                        <Text style={styles.stepSubDesc}>
                          Il ne vous reste plus qu'à marcher jusqu'à votre destination.
                        </Text>
                        <Text style={styles.stepMetaText}>09:53 → 09:58 • 350 m</Text>
                      </View>
                    </View>

                    {/* Step 5: Destination Arrival */}
                    <View style={styles.stepItemRow}>
                      <View style={styles.orangeStepIconCircle}>
                        <Ionicons name="location" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.stepTextWrapper}>
                        <Text style={styles.stepTitle}>{arrival}</Text>
                        <Text style={styles.stepSubDesc}>
                          Vous êtes bien arrivé ! Votre trajet est terminé.
                        </Text>

                        {/* Action Icons Row */}
                        <View style={styles.stepActionsRow}>
                          <TouchableOpacity
                            onPress={() => setIsLiked(!isLiked)}
                            activeOpacity={0.7}
                            style={styles.stepActionIconBtn}
                          >
                            <Ionicons
                              name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
                              size={20}
                              color={isLiked ? '#F26522' : '#000000'}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleShare}
                            activeOpacity={0.7}
                            style={styles.stepActionIconBtn}
                          >
                            <Ionicons name="share-social-outline" size={20} color="#000000" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={handleToggleFavorite}
                            activeOpacity={0.7}
                            style={styles.stepActionIconBtn}
                          >
                            <Ionicons
                              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                              size={20}
                              color={isFavorite ? '#F26522' : '#000000'}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Floating Centered Action Button: Démarrer l'itinéraire */}
              <View
                style={[styles.floatingButtonContainer, { bottom: 70 + (insets.bottom || 0) }]}
                pointerEvents="box-none"
              >
                <TouchableOpacity
                  style={styles.demarrerBtn}
                  onPress={handleStartNavigation}
                  activeOpacity={0.88}
                >
                  <View style={styles.demarrerIconCircle}>
                    <Ionicons name="location" size={16} color="#F26522" />
                  </View>
                  <Text style={styles.demarrerBtnText}>Démarrer l'itinéraire</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ======================================================== */
            /* VIEW 2: CARTE EN GRAND ("carte en grand")                 */
            /* ======================================================== */
            <View style={{ flex: 1, position: 'relative' }}>
              <OsmMapView
                style={styles.mapImageFull}
                departureName={departure}
                arrivalName={arrival}
              />

              {/* Red Accident Callout Badge on Map */}
              <View style={styles.accidentCalloutCardFull}>
                <View style={styles.warningCircleSmall}>
                  <Ionicons name="warning" size={12} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.calloutTitle}>Accident</Text>
                  <Text style={styles.calloutSub}>Circulation ralentie</Text>
                </View>
              </View>

              {/* Zoom Controls (+ / - buttons) on Right Side */}
              <View style={styles.zoomControlsWrapper}>
                <TouchableOpacity style={styles.zoomFabBtn} activeOpacity={0.8}>
                  <Ionicons name="add" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomFabBtn} activeOpacity={0.8}>
                  <Ionicons name="remove" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Bottom Active Step Summary Card */}
              <View style={[styles.bottomStepCard, { bottom: 70 + (insets.bottom || 0) }]}>
                <View style={styles.bottomStepIconCircle}>
                  <Ionicons name="walk" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.bottomStepTextCol}>
                  <Text style={styles.bottomStepTitle}>Marchez pendant 6 min</Text>
                  <Text style={styles.bottomStepSub}>
                    Depuis {departure} jusqu'à <Text style={styles.boldText}>Gare d'Adjamé.</Text>
                  </Text>
                  <Text style={styles.bottomStepMeta}>09:20 → 09:26 • 450 m</Text>
                </View>
              </View>
            </View>
          )}
        </View>

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
  mainContentArea: {
    flex: 1,
  },

  /* Map Container */
  mapSectionContainer: {
    height: Math.max(200, SCREEN_HEIGHT * 0.28),
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapImageFull: {
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
  accidentCalloutCardFull: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    elevation: 4,
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
  mapCompassFabOrange: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  /* Zoom FABs for full map */
  zoomControlsWrapper: {
    position: 'absolute',
    right: 14,
    top: '40%',
    gap: 10,
  },
  zoomFabBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  /* Decomposition Timeline Styles */
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  timelineScrollContent: {
    paddingBottom: 180,
  },
  timelineSectionWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    minHeight: 400,
  },
  timelineWatermarkBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.04,
  },
  timelineColumn: {
    position: 'relative',
    paddingLeft: 42,
    gap: 22,
  },
  blackRoadStripe: {
    position: 'absolute',
    left: 12,
    top: 14,
    bottom: 24,
    width: 16,
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedCenterLine: {
    width: 2,
    height: '100%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  orangeStepIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: -40,
    elevation: 3,
  },
  stepTextWrapper: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
    marginBottom: 3,
  },
  stepSubDesc: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#475569',
    lineHeight: 17,
    marginBottom: 4,
  },
  boldText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '700',
    color: '#000000',
  },
  stepMetaText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: '#94A3B8',
  },
  costBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginVertical: 3,
  },
  stepCostText: {
    fontSize: 11,
    color: '#C2410C',
    fontFamily: 'Montserrat-Regular',
  },

  stepActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  stepActionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 150,
  },
  demarrerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingVertical: 12,
    gap: 8,
    elevation: 6,
  },
  demarrerIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demarrerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },

  /* Full map step card */
  bottomStepCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 6,
  },
  bottomStepIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomStepTextCol: {
    flex: 1,
  },
  bottomStepTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  bottomStepSub: {
    fontSize: 11.5,
    color: '#475569',
    fontFamily: 'Montserrat-Regular',
  },
  bottomStepMeta: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
});
