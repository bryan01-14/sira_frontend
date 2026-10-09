import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OsmMapView } from '@/components/osm-map-view';
import { TripFeedbackModal } from '@/components/trip-feedback-modal';

const { width, height } = Dimensions.get('window');

interface NavigationStep {
  id: number;
  instruction: string;
  subtext: string;
  icon: keyof typeof Ionicons.glyphMap;
  modeColor: string;
  distanceRemaining: string;
  timeRemaining: string;
}

export default function NavigationActiveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    departure?: string;
    destination?: string;
    mode?: string;
    suboption?: string;
    durationMinutes?: string;
    distance?: string;
  }>();

  const departure = params.departure || 'Abobo Terminus';
  const targetDestination = params.destination || 'Orange Digital Center';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const steps: NavigationStep[] = [
    {
      id: 1,
      instruction: 'Marchez pendant 6 min',
      subtext: `Depuis ${departure} jusqu'à Gare d'Adjamé.`,
      icon: 'walk',
      modeColor: '#F26522',
      distanceRemaining: '450 m',
      timeRemaining: '6 min',
    },
    {
      id: 2,
      instruction: 'Prenez le Bus 22 (20 min)',
      subtext: "Depuis Gare d'Adjamé jusqu'à Rond-Point Riviera.",
      icon: 'bus',
      modeColor: '#F26522',
      distanceRemaining: '12,5 km',
      timeRemaining: '20 min',
    },
    {
      id: 3,
      instruction: 'Prenez un taxi (7 min)',
      subtext: 'Depuis Rond-Point Riviera jusqu\'à Cocody Riviera 3.',
      icon: 'car',
      modeColor: '#F26522',
      distanceRemaining: '3,2 km',
      timeRemaining: '7 min',
    },
    {
      id: 4,
      instruction: 'Marchez pendant 5 min',
      subtext: `Destination finale ${targetDestination}.`,
      icon: 'walk',
      modeColor: '#F26522',
      distanceRemaining: '350 m',
      timeRemaining: '5 min',
    },
    {
      id: 5,
      instruction: targetDestination,
      subtext: 'Vous êtes bien arrivé !',
      icon: 'location',
      modeColor: '#F26522',
      distanceRemaining: '0 m',
      timeRemaining: '0 min',
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Full Screen Live OsmMapView */}
      <View style={styles.fullMapContainer}>
        <OsmMapView
          style={styles.mapCanvas}
          departureName={departure}
          arrivalName={targetDestination}
        />

        {/* Floating Right Side Zoom (+ / -) Controls */}
        <View style={styles.zoomPillContainer}>
          <TouchableOpacity
            style={styles.zoomBtn}
            activeOpacity={0.8}
            onPress={handleNextStep}
          >
            <Ionicons name="add" size={24} color="#F26522" />
          </TouchableOpacity>
          <View style={styles.zoomBtnDivider} />
          <TouchableOpacity
            style={styles.zoomBtn}
            activeOpacity={0.8}
            onPress={handlePrevStep}
          >
            <Ionicons name="remove" size={24} color="#F26522" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overlay Safe Area */}
      <SafeAreaView style={styles.safeAreaOverlay} pointerEvents="box-none" edges={['top']}>
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
            Démarrer l'itinéraire
          </Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications" size={26} color="#000000" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push('/report-event')}
              activeOpacity={0.8}
            >
              <Ionicons name="warning" size={26} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.middleSpacer} pointerEvents="none" />

        {/* Bottom Card for Navigation Active Step Details */}
        <View style={styles.bottomCardContainer}>
          {/* Top Center Step Icon Circle */}
          <TouchableOpacity
            style={styles.topStepIconCircle}
            activeOpacity={0.9}
            onPress={handleNextStep}
          >
            <Ionicons name={currentStep.icon} size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.cardStepTitle}>{currentStep.instruction}</Text>
          <Text style={styles.cardStepSubtext}>{currentStep.subtext}</Text>
          <Text style={styles.cardStepMeta}>
            Reste : {currentStep.distanceRemaining} • Durée : {currentStep.timeRemaining}
          </Text>

          {/* Bottom Controls Row: Step Switcher & Exit Button */}
          <View style={styles.bottomControlsRow}>
            <View style={styles.stepControlsGroup}>
              <TouchableOpacity
                style={[styles.stepNavCircleBtn, currentStepIndex === 0 && styles.disabledBtn]}
                onPress={handlePrevStep}
                disabled={currentStepIndex === 0}
              >
                <Ionicons name="chevron-back" size={20} color={currentStepIndex === 0 ? '#CCCCCC' : '#000000'} />
              </TouchableOpacity>
              <Text style={styles.stepIndexText}>{currentStepIndex + 1} / {steps.length}</Text>
              <TouchableOpacity
                style={styles.stepNavCircleBtn}
                onPress={handleNextStep}
              >
                <Ionicons name="chevron-forward" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.exitNavButton,
                currentStepIndex === steps.length - 1 && { backgroundColor: '#10B981', shadowColor: '#10B981' }
              ]}
              onPress={() => setShowFeedback(true)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={currentStepIndex === steps.length - 1 ? "checkmark-circle-outline" : "stop-circle-outline"}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.exitNavButtonText}>
                {currentStepIndex === steps.length - 1 ? 'Terminer' : 'Quitter'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Rating Feedback Modal */}
        <TripFeedbackModal
          visible={showFeedback}
          onClose={() => {
            setShowFeedback(false);
            router.back();
          }}
          userName="Diata"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  fullMapContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EAEAEA',
  },
  mapCanvas: {
    width: '100%',
    height: '100%',
  },
  zoomPillContainer: {
    position: 'absolute',
    right: 16,
    top: '38%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  zoomBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomBtnDivider: {
    width: 24,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  safeAreaOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtnWrapper: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
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
  middleSpacer: {
    flex: 1,
  },
  bottomCardContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 18,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 10,
  },
  topStepIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -27,
    marginBottom: 12,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  cardStepTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardStepSubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardStepMeta: {
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  bottomControlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  stepControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNavCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  stepIndexText: {
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '700',
    color: '#333333',
  },
  exitNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  exitNavButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
  },
});
