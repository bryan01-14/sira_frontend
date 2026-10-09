import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/hooks/use-favorites';
import { OsmMapView } from '@/components/osm-map-view';
import { CustomBottomTabBar } from '@/components/custom-bottom-tab-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();

  const params = useLocalSearchParams<{
    departure?: string;
    arrival?: string;
    option?: string;
    transport?: string;
    duration?: string;
    costRange?: string;
    date?: string;
  }>();

  const departure = params.departure || 'Abobo Samaké';
  const arrival = params.arrival || 'Orange Digital Center';
  const tripTitle = `D’${departure} à ${arrival}`;
  const isFavorite = checkIsFavorite(tripTitle);

  const handleRepeatTrip = () => {
    router.push({
      pathname: '/navigation-active',
      params: {
        departure,
        destination: arrival,
        mode: params.option || 'Coulé',
        suboption: params.transport || 'Gbaka',
        durationMinutes: params.duration || '24 min',
      },
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Trajet historique SIRA : De ${departure} à ${arrival}.\nDurée : ${params.duration || '24 min'} | Coût : ${params.costRange || 'entre 500F et 1.500F'}.`,
        title: `Trajet SIRA : ${departure} → ${arrival}`,
      });
    } catch (error) {
      console.log('Erreur de partage :', error);
    }
  };

  const handleToggleFavorite = () => {
    const nowFavorite = toggleFavorite({
      departure,
      arrival,
      title: tripTitle,
      mode: params.option || 'Coulé',
      transport: params.transport || 'Gbaka',
      duration: params.duration || '24 min',
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
            Detail trajet
          </Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications" size={24} color="#000000" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/report-event')}
              activeOpacity={0.8}
            >
              <Ionicons name="warning" size={24} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContentArea}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Upper Map Section */}
            <View style={styles.mapSectionContainer}>
              <OsmMapView
                style={styles.mapImage}
                departureName={departure}
                arrivalName={arrival}
              />

              {/* Floating Departure/Arrival Address Card */}
              <View style={styles.floatingAddressCard}>
                <View style={styles.addressLeftCol}>
                  {/* Departure Row */}
                  <View style={styles.addressRow}>
                    <View style={styles.departDotRing}>
                      <View style={styles.departDotInner} />
                    </View>
                    <View style={styles.addressTextWrapper}>
                      <Text style={styles.addressLabelText}>Départ</Text>
                      <Text style={styles.addressNameText} numberOfLines={1}>
                        {departure}
                      </Text>
                    </View>
                  </View>

                  {/* Dotted Vertical Connector Line */}
                  <View style={styles.verticalDottedLineContainer}>
                    <View style={styles.dottedConnectorLine} />
                  </View>

                  {/* Arrival Row */}
                  <View style={styles.addressRow}>
                    <Ionicons name="location" size={18} color="#F26522" style={{ marginRight: 6 }} />
                    <View style={styles.addressTextWrapper}>
                      <Text style={styles.addressLabelText}>Arrivée</Text>
                      <Text style={styles.addressNameText} numberOfLines={1}>
                        {arrival}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.swapBtnWrapper} activeOpacity={0.7}>
                  <Ionicons name="swap-vertical" size={22} color="#000000" />
                </TouchableOpacity>
              </View>

              {/* Bottom Right Orange Compass FAB Button */}
              <TouchableOpacity
                style={styles.mapCompassFab}
                activeOpacity={0.85}
                onPress={handleRepeatTrip}
              >
                <Ionicons name="navigate-sharp" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Completed Trip Meta Summary Section */}
            <View style={styles.historySummarySection}>
              <Text style={styles.historyTitleText}>
                {params.date ? `TRAJET EFFECTUÉ LE ${params.date.toUpperCase()}` : 'TRAJET EFFECTUÉ LE LUNDI 14 SEPTEMBRE 2026 À 08H40'}
              </Text>

              <View style={styles.historyRowGroup}>
                <Text style={styles.historyMetaLabel}>
                  Option : <Text style={styles.historyMetaVal}>{params.option || 'Coulé'}</Text>
                </Text>
                <Text style={styles.historyMetaLabel}>
                  Transport : <Text style={styles.historyMetaVal}>{params.transport || 'Gbaka'}</Text>
                </Text>
                <Text style={styles.historyMetaLabel}>
                  Durée : <Text style={styles.historyMetaVal}>{params.duration || '24 min'}</Text>
                </Text>
              </View>

              <View style={styles.historyRowGroup}>
                <Text style={styles.historyMetaLabel}>
                  Coût : entre <Text style={styles.historyMetaVal}>500F</Text> et <Text style={styles.historyMetaVal}>1.500F</Text>
                </Text>
              </View>

              <View style={styles.historyRowGroup}>
                <Text style={styles.historyMetaLabel}>
                  Depart : <Text style={styles.historyMetaVal}>09H30</Text>
                </Text>
                <Text style={styles.historyMetaLabel}>
                  Arrivée : <Text style={styles.historyMetaVal}>10H30</Text>
                </Text>
              </View>
            </View>

            {/* Timeline Breakdown Section */}
            <View style={styles.timelineSectionWrapper}>
              {/* Light Watermark Background Decor */}
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

                {/* Step 1 */}
                <View style={styles.stepItemRow}>
                  <View style={styles.orangeStepIconCircle}>
                    <Ionicons name="walk" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTextWrapper}>
                    <Text style={styles.stepTitle}>Marchez pendant 7 min</Text>
                    <Text style={styles.stepSubDesc}>
                      Marchez jusqu'à la gare de gbaka
                    </Text>
                    <Text style={styles.stepMetaText}>09:20 → 09:26 • 450 m</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.stepItemRow}>
                  <View style={styles.orangeStepIconCircle}>
                    <Ionicons name="bus" size={19} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTextWrapper}>
                    <Text style={styles.stepTitle}>Prenez un gbaka pour Adjamé liberté</Text>
                    <Text style={styles.stepSubDesc}>
                      Le cout varira entre 200f et 500f en fonction de l'heure.
                    </Text>
                    <Text style={styles.stepMetaText}>09:26 → 09:46 • 450 m</Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.stepItemRow}>
                  <View style={styles.orangeStepIconCircle}>
                    <Ionicons name="walk" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTextWrapper}>
                    <Text style={styles.stepTitle}>Marchez pendant 25 min</Text>
                    <Text style={styles.stepSubDesc}>
                      Arrivé à Adjamé liberté, tournez à votre gauche et marchez tout droit.
                    </Text>
                    <Text style={styles.stepMetaText}>09:20 → 09:26 • 450 m</Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={styles.stepItemRow}>
                  <View style={styles.orangeStepIconCircle}>
                    <Ionicons name="location" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTextWrapper}>
                    <Text style={styles.stepTitle}>{arrival}</Text>
                    <Text style={styles.stepSubDesc}>
                      Vous êtes bien arrivé !
                    </Text>
                    {/* Action Icons Row */}
                    <View style={styles.stepActionsRow}>
                      <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.actionIconButton}>
                        <Ionicons name="share-social-outline" size={20} color="#000000" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={handleToggleFavorite} activeOpacity={0.7} style={styles.actionIconButton}>
                        <Ionicons
                          name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                          size={20}
                          color={isFavorite ? '#F26522' : '#000000'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.actionIconButton}>
                        <Ionicons name="trash-outline" size={20} color="#000000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Floating Action Button: Refaire ce trajet */}
          <View style={styles.floatingButtonContainer} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.refaireBtn}
              onPress={handleRepeatTrip}
              activeOpacity={0.88}
            >
              <View style={styles.refaireIconCircle}>
                <Ionicons name="location" size={16} color="#F26522" />
              </View>
              <Text style={styles.refaireBtnText}>Refaire ce trajet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Navigation Tab Bar (unselected activeTab="none") */}
      <CustomBottomTabBar activeTab="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 12,
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
    marginHorizontal: 8,
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
    fontSize: 11,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
  mainContentArea: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  mapSectionContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  floatingAddressCard: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  addressLeftCol: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departDotRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  departDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F26522',
  },
  verticalDottedLineContainer: {
    height: 12,
    marginLeft: 8,
    justifyContent: 'center',
  },
  dottedConnectorLine: {
    width: 1,
    height: '100%',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#999999',
  },
  addressTextWrapper: {
    flex: 1,
  },
  addressLabelText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Regular',
    color: '#888888',
  },
  addressNameText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  swapBtnWrapper: {
    padding: 6,
    marginLeft: 8,
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
    shadowRadius: 6,
    elevation: 5,
  },
  historySummarySection: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  historyTitleText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  historyRowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 4,
  },
  historyMetaLabel: {
    fontSize: 12.5,
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
  },
  historyMetaVal: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  timelineSectionWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    position: 'relative',
  },
  timelineWatermarkBg: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  timelineColumn: {
    flex: 1,
    position: 'relative',
    zIndex: 5,
    paddingRight: 0,
  },
  blackRoadStripe: {
    position: 'absolute',
    left: 18,
    top: 14,
    bottom: 30,
    width: 8,
    backgroundColor: '#000000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dashedCenterLine: {
    width: 2,
    height: '94%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  orangeStepIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    zIndex: 2,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  stepTextWrapper: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    color: '#000000',
    fontSize: 14.5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    marginBottom: 3,
    lineHeight: 19,
  },
  stepSubDesc: {
    color: '#444444',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
    lineHeight: 17,
  },
  stepMetaText: {
    color: '#666666',
    fontSize: 11.5,
    fontFamily: 'Montserrat-Medium',
  },
  stepActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
    elevation: 10,
  },
  refaireBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 13,
    gap: 10,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  refaireIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refaireBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
  actionIconButton: {
    padding: 6,
  },
});
