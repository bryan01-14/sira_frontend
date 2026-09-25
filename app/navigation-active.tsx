import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OsmMapView } from '@/components/osm-map-view';

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
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isHudMinimized, setIsHudMinimized] = useState(false);
  const [showStepsDrawer, setShowStepsDrawer] = useState(false);

  const steps: NavigationStep[] = [
    {
      id: 1,
      instruction: "Dans 150m, prenez la rue à droite vers la Gare d'Adjamé",
      subtext: "Étape 1/4 • Marche à pied",
      icon: "walk",
      modeColor: "#10B981",
      distanceRemaining: "450 m",
      timeRemaining: "4 min",
    },
    {
      id: 2,
      instruction: "Montez dans le Bus 22 à la Gare d'Adjamé",
      subtext: "Étape 2/4 • Bus SUTRA",
      icon: "bus",
      modeColor: "#F26522",
      distanceRemaining: "12,5 km",
      timeRemaining: "20 min",
    },
    {
      id: 3,
      instruction: "Prenez un taxi au Rond-Point de la Riviera",
      subtext: "Étape 3/4 • Taxi Compteur",
      icon: "car",
      modeColor: "#1E6091",
      distanceRemaining: "3,2 km",
      timeRemaining: "7 min",
    },
    {
      id: 4,
      instruction: "Vous êtes arrivé à votre destination !",
      subtext: "Étape 4/4 • Arrivée",
      icon: "location",
      modeColor: "#FF4500",
      distanceRemaining: "0 m",
      timeRemaining: "0 min",
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto advance steps preview timer for simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev < steps.length - 1 ? prev + 1 : prev;
        if (next === steps.length - 1 && prev !== steps.length - 1) {
          setShowTripCompletedModal(true);
        }
        return next;
      });
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const [showTripCompletedModal, setShowTripCompletedModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([]);

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => {
      const nextIdx = prev < steps.length - 1 ? prev + 1 : prev;
      if (nextIdx === steps.length - 1) {
        setShowTripCompletedModal(true);
      }
      return nextIdx;
    });
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleConfirmArrival = () => {
    setShowTripCompletedModal(false);
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    setShowRatingModal(false);
    setShowThankYouModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Full Screen Live Interactive OsmMapView avec l'itinéraire choisi */}
      <OsmMapView
        style={styles.fullMapImage}
        departureName={departure}
        arrivalName={targetDestination}
      />

      {/* Overlay Safe Area */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} pointerEvents="box-none">
        {/* Top Turn-by-Turn Instruction Banner (HUD) */}
        {isHudMinimized ? (
          <TouchableOpacity
            style={styles.restoreHudPill}
            onPress={() => setIsHudMinimized(false)}
            activeOpacity={0.88}
          >
            <View style={[styles.directionIconCircleSmall, { backgroundColor: currentStep.modeColor }]}>
              <Ionicons name={currentStep.icon} size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.restoreHudText} numberOfLines={1}>
              {currentStep.instruction}
            </Text>
            <View style={styles.restoreExpandBadge}>
              <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.topHudCard}
            onPress={() => setShowStepsDrawer(true)}
            activeOpacity={0.92}
          >
            <View style={styles.hudHeaderRow}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handlePrevStep();
                }}
                disabled={currentStepIndex === 0}
                style={{ opacity: currentStepIndex === 0 ? 0.3 : 1, paddingRight: 6 }}
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={[styles.directionIconCircle, { backgroundColor: currentStep.modeColor }]}>
                <Ionicons name={currentStep.icon} size={24} color="#FFFFFF" />
              </View>

              <View style={styles.hudTextCol}>
                <Text style={styles.hudInstructionText}>{currentStep.instruction}</Text>
                <Text style={styles.hudSubtext}>{currentStep.subtext}</Text>
              </View>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleNextStep();
                }}
                disabled={currentStepIndex === steps.length - 1}
                style={{ opacity: currentStepIndex === steps.length - 1 ? 0.3 : 1, paddingLeft: 4, paddingRight: 6 }}
              >
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setIsHudMinimized(true);
                }}
                style={styles.exitNavBtn}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Distance & Time Countdown Bar inside Top HUD */}
            <View style={styles.hudBottomRow}>
              <View style={styles.hudMetricBadge}>
                <Ionicons name="navigate-outline" size={14} color="#FFFFFF" />
                <Text style={styles.hudMetricText}>Reste : {currentStep.distanceRemaining}</Text>
              </View>
              <View style={styles.hudMetricBadge}>
                <Ionicons name="time-outline" size={14} color="#FFFFFF" />
                <Text style={styles.hudMetricText}>Durée : {currentStep.timeRemaining}</Text>
              </View>
              <View style={[styles.hudMetricBadge, { backgroundColor: 'rgba(242, 101, 34, 0.3)' }]}>
                <Ionicons name="list" size={13} color="#FFFFFF" />
                <Text style={styles.hudMetricText}>Toutes les étapes</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Map Side Quick Action Buttons (Right Side) */}
        <View style={styles.mapSideControls}>
          <TouchableOpacity
            style={styles.mapControlBtn}
            onPress={() => setIsVoiceMuted(!isVoiceMuted)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isVoiceMuted ? 'volume-mute' : 'volume-high'}
              size={22}
              color={isVoiceMuted ? '#94A3B8' : '#F26522'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlBtn} activeOpacity={0.8}>
            <Ionicons name="locate" size={22} color="#1E6091" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlBtn} activeOpacity={0.8}>
            <Ionicons name="layers" size={22} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Traffic Alert Callout on Map */}
        <View style={styles.liveTrafficBadge}>
          <View style={styles.liveDotPulse} />
          <Text style={styles.liveTrafficText}>Trafic fluide sur votre axe</Text>
        </View>

        {/* SIRA Live Voice Assistant Assistant Floating Bar */}
        <View style={styles.siraVoiceFloatingBar}>
          <Image
            source={require('@/assets/images/sira-character-assistant.png')}
            style={styles.siraNavAvatar}
            contentFit="contain"
          />
          <View style={styles.siraSpeechBubble}>
            <View style={styles.voiceWaveHeader}>
              <Ionicons name="mic" size={12} color="#F26522" />
              <Text style={styles.voiceLabel}>SIRA VOCAL</Text>
            </View>
            <Text style={styles.siraSpeechText}>
              Prenez la passerelle à droite pour arriver rapidement à la gare !
            </Text>
          </View>
        </View>

        {/* Bottom Navigation Dashboard Card */}
        <View style={styles.bottomDashboardCard}>
          {/* Progress Bar with Milestones */}
          <View style={styles.progressTrackContainer}>
            <View style={styles.progressTrackBg}>
              <View style={[styles.progressTrackFill, { width: `${((currentStepIndex + 1) / steps.length) * 100}%` }]} />
            </View>
            <View style={styles.milestonesRow}>
              {steps.map((step, idx) => (
                <TouchableOpacity
                  key={step.id}
                  onPress={() => setCurrentStepIndex(idx)}
                  style={[
                    styles.milestoneDot,
                    idx <= currentStepIndex && { backgroundColor: step.modeColor, borderColor: '#FFFFFF' },
                  ]}
                >
                  <Ionicons
                    name={step.icon}
                    size={10}
                    color={idx <= currentStepIndex ? '#FFFFFF' : '#94A3B8'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time, Destination & Actions Footer Row */}
          <View style={styles.dashboardFooterRow}>
            <View style={styles.etaCol}>
              <Text style={styles.etaTimeText}>10:15</Text>
              <Text style={styles.etaLabelText}>Arrivée estimée</Text>
            </View>

            <View style={styles.destCol}>
              <Text style={styles.destNameText} numberOfLines={1}>
                {targetDestination}
              </Text>
              <Text style={styles.destSubText}>27 min • 14,2 km au total</Text>
            </View>

            <TouchableOpacity
              style={styles.sosButton}
              onPress={() => setShowExitConfirm(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="stop-circle" size={20} color="#FFFFFF" />
              <Text style={styles.sosButtonText}>Quitter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Steps & Lane Instructions Modal Drawer */}
        {showStepsDrawer && (
          <View style={styles.exitModalOverlay}>
            <View style={[styles.exitModalCard, { width: '92%', maxWidth: 400, paddingVertical: 20 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: '#000000' }}>Instructions de voie</Text>
                <TouchableOpacity onPress={() => setShowStepsDrawer(false)} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              {steps.map((st, idx) => (
                <TouchableOpacity
                  key={st.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 8,
                    backgroundColor: idx === currentStepIndex ? 'rgba(242, 101, 34, 0.12)' : '#F8FAFC',
                    borderWidth: 1,
                    borderColor: idx === currentStepIndex ? '#F26522' : '#E2E8F0',
                  }}
                  onPress={() => {
                    setCurrentStepIndex(idx);
                    setShowStepsDrawer(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: st.modeColor, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name={st.icon} size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#000000' }}>{st.instruction}</Text>
                    <Text style={{ fontSize: 11.5, color: '#666666', marginTop: 2 }}>{st.subtext} • Reste : {st.distanceRemaining}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.confirmExitBtn, { marginTop: 12, width: '100%' }]}
                onPress={() => setShowStepsDrawer(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmExitText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Exit Confirmation Modal Overlay */}
        {showExitConfirm && (
          <View style={styles.exitModalOverlay}>
            <View style={styles.exitModalCard}>
              <Ionicons name="alert-circle" size={44} color="#F26522" />
              <Text style={styles.exitModalTitle}>Arrêter la navigation ?</Text>
              <Text style={styles.exitModalSub}>
                Voulez-vous vraiment quitter le guidage en direct vers {targetDestination} ?
              </Text>
              <View style={styles.exitModalButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelExitBtn}
                  onPress={() => setShowExitConfirm(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelExitText}>Continuer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmExitBtn}
                  onPress={() => {
                    setShowExitConfirm(false);
                    router.back();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmExitText}>Quitter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Trip Completed Confirmation Modal Overlay */}
        {showTripCompletedModal && (
          <View style={styles.exitModalOverlay}>
            <View style={[styles.exitModalCard, { paddingVertical: 26, paddingHorizontal: 20 }]}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.exitModalTitle}>Trajet terminé !</Text>
              <Text style={[styles.exitModalSub, { marginBottom: 12 }]}>
                Vous êtes bien arrivé à votre destination :{'\n'}
                <Text style={{ fontWeight: '900', color: '#0F172A' }}>{targetDestination}</Text>
              </Text>

              <View style={{ width: '100%', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#F26522',
                    paddingVertical: 14,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#F26522',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={handleConfirmArrival}
                  activeOpacity={0.88}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                    Confirmer l'arrivée
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#F1F5F9',
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowTripCompletedModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: '#475569', fontSize: 13, fontWeight: '700' }}>
                    Continuer la navigation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 5-Star Interactive Rating Modal Overlay */}
        {showRatingModal && (
          <View style={styles.exitModalOverlay}>
            <View style={[styles.exitModalCard, { paddingVertical: 24, paddingHorizontal: 20 }]}>
              <Image
                source={require('@/assets/images/sira-character-assistant.png')}
                style={{ width: 60, height: 70, marginBottom: 8 }}
                contentFit="contain"
              />

              <Text style={{ fontSize: 19, fontWeight: '900', color: '#0F172A', textAlign: 'center' }}>
                Notez votre expérience
              </Text>
              <Text style={{ fontSize: 12.5, color: '#64748B', textAlign: 'center', marginTop: 4, marginBottom: 14 }}>
                Comment s'est passée votre navigation vers {targetDestination} ?
              </Text>

              {/* Interactive 5-Star Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginVertical: 6 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setStarRating(star)}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name={star <= starRating ? 'star' : 'star-outline'}
                      size={36}
                      color={star <= starRating ? '#F59E0B' : '#CBD5E1'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ fontSize: 13, fontWeight: '800', color: '#F26522', marginTop: 2, marginBottom: 14 }}>
                {starRating === 5 && '🌟 Excellent trajet !'}
                {starRating === 4 && '😊 Très bon trajet'}
                {starRating === 3 && '😐 Trajet moyen'}
                {starRating === 2 && '😕 Passable'}
                {starRating === 1 && '😞 À améliorer'}
              </Text>

              {/* Feedback Chip Options */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
                {['Itinéraire précis', 'Assistant vocal clair', 'Trafic exact', 'Gain de temps'].map((tag) => {
                  const isSelected = selectedFeedbackTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => {
                        if (isSelected) {
                          setSelectedFeedbackTags(selectedFeedbackTags.filter((t) => t !== tag));
                        } else {
                          setSelectedFeedbackTags([...selectedFeedbackTags, tag]);
                        }
                      }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: isSelected ? '#F26522' : '#F1F5F9',
                        borderWidth: 1,
                        borderColor: isSelected ? '#F26522' : '#E2E8F0',
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={{ fontSize: 11.5, fontWeight: '700', color: isSelected ? '#FFFFFF' : '#475569' }}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ width: '100%', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#F26522',
                    paddingVertical: 14,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#F26522',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={handleSubmitRating}
                  activeOpacity={0.88}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                    Envoyer ma note
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => router.push('/(tabs)')}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '600' }}>
                    Passer cette étape
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Thank You Modal Overlay */}
        {showThankYouModal && (
          <View style={styles.exitModalOverlay}>
            <View style={[styles.exitModalCard, { paddingVertical: 26, paddingHorizontal: 20 }]}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: 'rgba(242, 101, 34, 0.12)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="heart" size={40} color="#F26522" />
              </View>
              <Text style={styles.exitModalTitle}>Merci pour votre avis !</Text>
              <Text style={styles.exitModalSub}>
                Votre retour nous aide à améliorer SIRA pour tous les usagers d'Abidjan.
              </Text>
              <TouchableOpacity
                style={{
                  width: '100%',
                  backgroundColor: '#F26522',
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginTop: 20,
                  shadowColor: '#F26522',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                }}
                onPress={() => router.push('/(tabs)')}
                activeOpacity={0.88}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                  Retour à l'accueil
                </Text>
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
    backgroundColor: '#0F172A',
  },
  fullMapImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHudCard: {
    marginHorizontal: 16,
    marginTop: Platform.OS === 'android' ? 10 : 0,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  restoreHudPill: {
    marginHorizontal: 16,
    marginTop: Platform.OS === 'android' ? 10 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  directionIconCircleSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreHudText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  restoreExpandBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hudHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  directionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  hudTextCol: {
    flex: 1,
  },
  hudInstructionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  hudSubtext: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  exitNavBtn: {
    padding: 2,
  },
  hudBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hudMetricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hudMetricText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mapSideControls: {
    position: 'absolute',
    right: 16,
    top: height * 0.22,
    gap: 10,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  liveTrafficBadge: {
    position: 'absolute',
    top: height * 0.22,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  liveDotPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveTrafficText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  siraVoiceFloatingBar: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  siraNavAvatar: {
    width: 54,
    height: 64,
  },
  siraSpeechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  voiceWaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  voiceLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F26522',
    letterSpacing: 0.5,
  },
  siraSpeechText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },
  bottomDashboardCard: {
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 10 : 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  progressTrackContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  progressTrackBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: '#F26522',
    borderRadius: 3,
  },
  milestonesRow: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  dashboardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  etaCol: {
    alignItems: 'flex-start',
  },
  etaTimeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F26522',
  },
  etaLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  destCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  destNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  destSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  sosButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  exitModalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  exitModalCard: {
    width: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  exitModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 12,
    textAlign: 'center',
  },
  exitModalSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  exitModalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  cancelExitBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelExitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  confirmExitBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmExitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
