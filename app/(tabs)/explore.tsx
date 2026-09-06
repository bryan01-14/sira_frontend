import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type TransportMode = 'Coulé' | 'Debout' | 'Suspendu';

interface RouteStep {
  id: string;
  type: 'walk' | 'bus' | 'taxi';
  title: string;
  duration: string;
  description: string;
  timeRange: string;
  distanceOrCost: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function RouteExploreScreen() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<TransportMode>('Coulé');
  const [showDetail, setShowDetail] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);

  const routeSteps: RouteStep[] = [
    {
      id: '1',
      type: 'walk',
      title: 'Marchez pendant 6 min',
      duration: '6 min',
      description: "Depuis Abobo Terminus jusqu'à Gare d'Adjamé.",
      timeRange: '09:20 → 09:26',
      distanceOrCost: '450 m',
      icon: 'walk',
    },
    {
      id: '2',
      type: 'bus',
      title: 'Prenez le Bus 22 pendant 20 min',
      duration: '20 min',
      description:
        "Direction Riviera Palmeraie.\nMontez à Gare d'Adjamé et descendez au Rond-Point de la Riviera.",
      timeRange: '09:26 → 09:46',
      distanceOrCost: 'Coût estimé : 200 FCFA',
      icon: 'bus',
    },
    {
      id: '3',
      type: 'taxi',
      title: 'Prenez un taxi pendant 7 min',
      duration: '7 min',
      description: "Depuis le Rond-Point de la Riviera jusqu'à Cocody Riviera 3.",
      timeRange: '09:46 → 09:53',
      distanceOrCost: 'Coût estimé : 1 000 FCFA • 3,2 km',
      icon: 'car',
    },
    {
      id: '4',
      type: 'walk',
      title: 'Marchez pendant 5 min',
      duration: '5 min',
      description: "Il ne vous reste plus qu'à marcher jusqu'à votre destination.",
      timeRange: '09:53 → 09:58',
      distanceOrCost: '350 m',
      icon: 'walk',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background Map */}
      <Image
        source={require('@/assets/images/city-route-3d-bg.jpg')}
        style={styles.mapBackground}
        contentFit="cover"
        contentPosition={{ top: '10%', left: '50%' }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header with Back Button and Brand */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (showDetail ? setShowDetail(false) : router.back())}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#000000" />
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <Image
              source={require('@/assets/images/sira-logo-vector.png')}
              style={styles.headerLogo}
              contentFit="contain"
            />
            <Text style={styles.headerSlogan}>On trace, sans stress.</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowFeedback(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Departure -> Arrival Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <View style={styles.routeTextCol}>
              <Text style={styles.routeLabel}>Départ</Text>
              <Text style={styles.routeValue}>Abobo Samaké</Text>
            </View>
          </View>

          <View style={styles.routeDivider} />

          <View style={styles.routeRow}>
            <View style={styles.dotOrange} />
            <View style={styles.routeTextCol}>
              <Text style={styles.routeLabel}>Arrivée</Text>
              <Text style={styles.routeValue}>Orange Digital Center</Text>
            </View>
          </View>
        </View>

        {/* Transport Option Tabs (Coulé, Debout, Suspendu) */}
        {!showDetail && (
          <View style={styles.modeTabs}>
            {(['Coulé', 'Debout', 'Suspendu'] as TransportMode[]).map((mode) => {
              const isSelected = selectedMode === mode;
              const subtext =
                mode === 'Coulé'
                  ? 'Moindre cher'
                  : mode === 'Debout'
                  ? 'Standard'
                  : 'Confort';

              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeTab, isSelected && styles.modeTabActive]}
                  onPress={() => setSelectedMode(mode)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.modeTabText,
                      isSelected && styles.modeTabTextActive,
                    ]}
                  >
                    {mode}
                  </Text>
                  <Text
                    style={[
                      styles.modeTabSub,
                      isSelected && styles.modeTabSubActive,
                    ]}
                  >
                    {subtext}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Content Section: Route Options or Step-by-Step Breakdown */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!showDetail ? (
            /* Option Summary Card */
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.summaryTitle}>{selectedMode}</Text>
                  <Text style={styles.summaryCost}>
                    Coût : entre 500F et 1.500F
                  </Text>
                  <Text style={styles.summaryTimes}>
                    Départ : 09H30 • Arrivée : 10H30
                  </Text>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationNumber}>24</Text>
                  <Text style={styles.durationUnit}>min</Text>
                </View>
              </View>

              <View style={styles.trafficRow}>
                <View style={styles.trafficIndicator} />
                <Text style={styles.trafficText}>
                  Trafic modéré • sur 18 Km
                </Text>
              </View>

              {/* Step preview pills */}
              <View style={styles.stepPillsRow}>
                <View style={styles.stepPill}>
                  <Ionicons name="walk" size={13} color="#F26522" />
                  <Text style={styles.stepPillText}>5 min</Text>
                </View>
                <Ionicons name="chevron-forward" size={12} color="#999999" />
                <View style={styles.stepPill}>
                  <Ionicons name="bus" size={13} color="#F26522" />
                  <Text style={styles.stepPillText}>7 min</Text>
                </View>
                <Ionicons name="chevron-forward" size={12} color="#999999" />
                <View style={styles.stepPill}>
                  <Ionicons name="car" size={13} color="#F26522" />
                  <Text style={styles.stepPillText}>9 min</Text>
                </View>
                <Ionicons name="chevron-forward" size={12} color="#999999" />
                <View style={styles.stepPill}>
                  <Ionicons name="walk" size={13} color="#F26522" />
                  <Text style={styles.stepPillText}>3 min</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => setShowDetail(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.detailButtonText}>Détail de l'itinéraire</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            /* Itinerary Breakdown / Decomposition */
            <View style={styles.detailCard}>
              <View style={styles.detailCardHeader}>
                <Text style={styles.detailCardTitle}>
                  Décomposition d'itinéraire
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDetail(false)}
                  style={styles.closeDetailBtn}
                >
                  <Ionicons name="close" size={18} color="#666666" />
                </TouchableOpacity>
              </View>

              {/* Assistant guidance tip */}
              <View style={styles.tipBox}>
                <Image
                  source={require('@/assets/images/sira-character-assistant.png')}
                  style={styles.tipAvatar}
                  contentFit="contain"
                />
                <Text style={styles.tipText}>
                  Voici comment vous allez rejoindre votre destination sans stress !
                </Text>
              </View>

              {/* Timeline Steps */}
              {routeSteps.map((step, idx) => (
                <View key={step.id} style={styles.timelineItem}>
                  <View style={styles.timelineIconCol}>
                    <View style={styles.timelineIconCircle}>
                      <Ionicons name={step.icon} size={16} color="#F26522" />
                    </View>
                    {idx < routeSteps.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                    <View style={styles.stepMetaRow}>
                      <Text style={styles.stepTime}>{step.timeRange}</Text>
                      <Text style={styles.stepDist}>{step.distanceOrCost}</Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Start Navigation Action Button */}
              <TouchableOpacity
                style={styles.startNavButton}
                onPress={() => setShowFeedback(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.startNavText}>Démarrer l'itinéraire</Text>
                <Ionicons name="navigate" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Feedback / Trip rating popup modal */}
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
                Comment s'est passé votre trajet Diata ?
              </Text>
              <Text style={styles.feedbackSub}>
                Votre avis nous aide à améliorer SIRA.
              </Text>

              {/* 5 Stars Rating */}
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
    backgroundColor: '#F5F5F7',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandContainer: {
    alignItems: 'center',
  },
  headerLogo: {
    width: 60,
    height: 28,
  },
  headerSlogan: {
    fontSize: 9,
    fontWeight: '800',
    color: '#333333',
    marginTop: 2,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34A853',
  },
  dotOrange: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F26522',
  },
  routeTextCol: {
    flex: 1,
  },
  routeLabel: {
    color: '#8E8E8E',
    fontSize: 11,
    fontWeight: '600',
  },
  routeValue: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 8,
    marginLeft: 22,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
  },
  modeTab: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F26522',
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  modeTabText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '800',
  },
  modeTabTextActive: {
    color: '#F26522',
  },
  modeTabSub: {
    color: '#777777',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  modeTabSubActive: {
    color: '#F26522',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryCost: {
    color: '#555555',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  summaryTimes: {
    color: '#777777',
    fontSize: 11.5,
    marginTop: 2,
  },
  durationBadge: {
    backgroundColor: '#F26522',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  durationNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  durationUnit: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  trafficRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  trafficIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34A853',
  },
  trafficText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '600',
  },
  stepPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 14,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  stepPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
  detailButton: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 6,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailCardTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '900',
  },
  closeDetailBtn: {
    padding: 4,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4EE',
    borderRadius: 14,
    padding: 10,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD9C6',
  },
  tipAvatar: {
    width: 38,
    height: 38,
  },
  tipText: {
    flex: 1,
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 28,
  },
  timelineIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF4EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F26522',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#F26522',
    marginVertical: 4,
    opacity: 0.4,
  },
  timelineContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#111111',
    fontSize: 13.5,
    fontWeight: '800',
  },
  stepDesc: {
    color: '#555555',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  stepMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  stepTime: {
    color: '#F26522',
    fontSize: 11,
    fontWeight: '700',
  },
  stepDist: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '600',
  },
  startNavButton: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    marginTop: 10,
  },
  startNavText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  feedbackModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  feedbackCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  feedbackClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  feedbackAvatar: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  feedbackTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  feedbackSub: {
    color: '#666666',
    fontSize: 12.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  submitFeedbackBtn: {
    backgroundColor: '#F26522',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitFeedbackText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
