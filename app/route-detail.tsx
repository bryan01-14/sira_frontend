import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function RouteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ departure?: string; arrival?: string; mode?: string }>();

  const departure = params.departure || 'Abobo Terminus';
  const arrival = params.arrival || 'Orange Digital Center';

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtnWrapper}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Décomposition d'itinéraire</Text>

          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.8}>
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

        {/* Top Half: Interactive Route Map Section */}
        <View style={styles.mapSection}>
          <Image
            source={require('@/assets/images/city-route-3d-bg.jpg')}
            style={styles.mapImage}
            contentFit="cover"
          />

          {/* Floating Trip Summary Pill (Top Center) */}
          <View style={styles.tripSummaryPill}>
            <Text style={styles.tripSummaryText}>
              ⏱️ <Text style={styles.summaryBold}>38 min</Text> • 💰 <Text style={styles.summaryBold}>1 200 FCFA</Text> • 🟢 <Text style={styles.summaryGreen}>Trafic fluide</Text>
            </Text>
          </View>

          {/* Map Legend Card (Top Right) */}
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

          {/* Map Traffic Alert Callouts */}
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

          {/* Station Departure Badge on Map */}
          <View style={styles.departStationBadge}>
            <Text style={styles.departTag}>DÉPART</Text>
            <Text style={styles.departName}>Abobo Sanmake</Text>
          </View>

          {/* Floating Orange Compass Navigation FAB Button */}
          <TouchableOpacity style={styles.mapCompassFab} activeOpacity={0.85}>
            <Ionicons name="navigate" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Bottom Half: Detailed Timeline Itinerary Decomposition */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.timelineRowLayout}>
            {/* Left Vertical Dashed Bar */}
            <View style={styles.timelineDashedLine} />

            {/* Timeline Steps Column */}
            <View style={styles.timelineStepsCol}>
              {/* Step 1: Walk (Emerald Green Theme) */}
              <View style={styles.stepItemRow}>
                <View style={[styles.stepCircleIcon, { backgroundColor: '#10B981', shadowColor: '#10B981' }]}>
                  <Ionicons name="walk" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Marchez pendant 6 min</Text>
                    <View style={[styles.stepTagBadge, { backgroundColor: '#E6F4EA' }]}>
                      <Text style={[styles.stepTagText, { color: '#10B981' }]}>Marche</Text>
                    </View>
                  </View>
                  <Text style={styles.stepDescText}>
                    Depuis {departure} jusqu'à <Text style={styles.boldText}>Gare d'Adjamé</Text>.
                  </Text>
                  <Text style={styles.stepMetaText}>09:20 → 09:26 • 450 m</Text>
                </View>
              </View>

              {/* Step 2: Bus 22 (Signature SIRA Orange Theme) */}
              <View style={styles.stepItemRow}>
                <View style={[styles.stepCircleIcon, { backgroundColor: '#F26522', shadowColor: '#F26522' }]}>
                  <Ionicons name="bus" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Prenez le Bus 22 (20 min)</Text>
                    <View style={[styles.stepTagBadge, { backgroundColor: '#FFF4EE' }]}>
                      <Text style={[styles.stepTagText, { color: '#F26522' }]}>Bus SUTRA</Text>
                    </View>
                  </View>
                  <Text style={styles.stepDescText}>
                    Direction <Text style={styles.boldText}>Riviera Palmeraie</Text>.
                  </Text>
                  <Text style={styles.stepDescText}>
                    Montez à <Text style={styles.boldText}>Gare d'Adjamé</Text> et descendez au <Text style={styles.boldText}>Rond-Point de la Riviera</Text>.
                  </Text>
                  <View style={styles.stepCostRow}>
                    <Text style={styles.stepCostBadge}>💰 Coût estimé : 200 FCFA</Text>
                    <Text style={styles.stepMetaText}>09:26 → 09:46</Text>
                  </View>
                </View>
              </View>

              {/* Step 3: Taxi (Ocean Blue Theme) */}
              <View style={styles.stepItemRow}>
                <View style={[styles.stepCircleIcon, { backgroundColor: '#1E6091', shadowColor: '#1E6091' }]}>
                  <Ionicons name="car" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Prenez un taxi (7 min)</Text>
                    <View style={[styles.stepTagBadge, { backgroundColor: '#EBF3F9' }]}>
                      <Text style={[styles.stepTagText, { color: '#1E6091' }]}>Taxi compteur</Text>
                    </View>
                  </View>
                  <Text style={styles.stepDescText}>
                    Depuis le <Text style={styles.boldText}>Rond-Point de la Riviera</Text> jusqu'à <Text style={styles.boldText}>Cocody Riviera 3</Text>.
                  </Text>
                  <View style={styles.stepCostRow}>
                    <Text style={styles.stepCostBadge}>💰 Coût estimé : 1 000 FCFA</Text>
                    <Text style={styles.stepMetaText}>09:46 → 09:53 • 3,2 km</Text>
                  </View>
                </View>
              </View>

              {/* Step 4: Walk (Emerald Green Theme) */}
              <View style={styles.stepItemRow}>
                <View style={[styles.stepCircleIcon, { backgroundColor: '#10B981', shadowColor: '#10B981' }]}>
                  <Ionicons name="walk" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.stepCard}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTitleText}>Marchez pendant 5 min</Text>
                    <View style={[styles.stepTagBadge, { backgroundColor: '#E6F4EA' }]}>
                      <Text style={[styles.stepTagText, { color: '#10B981' }]}>Arrivée</Text>
                    </View>
                  </View>
                  <Text style={styles.stepDescText}>
                    Il ne vous reste plus qu'à marcher jusqu'à votre destination.
                  </Text>
                  <Text style={styles.stepMetaText}>09:53 → 09:58 • 350 m</Text>
                </View>
              </View>

              {/* Step 5: Destination Pin */}
              <View style={styles.stepItemRow}>
                <View style={[styles.stepCircleIcon, { backgroundColor: '#FF4500', shadowColor: '#FF4500' }]}>
                  <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
                </View>
                <View style={[styles.stepCard, styles.destStepCard]}>
                  <Text style={styles.destTitleText}>{arrival}</Text>
                  <Text style={styles.stepDescText}>
                    Vous êtes bien arrivé ! Votre trajet est terminé.
                  </Text>
                  <View style={styles.destActionsRow}>
                    <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                      <Ionicons name="thumbs-up" size={18} color="#F26522" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                      <Ionicons name="share-social" size={18} color="#1E6091" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
                      <Ionicons name="bookmark" size={18} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Side Column: Assistant Character + Speech Bubble + Start Button */}
            <View style={styles.assistantColumn}>
              {/* Speech Bubble with SIRA Live Badge */}
              <View style={styles.floatingBubbleBox}>
                <View style={styles.siraBadgeHeader}>
                  <View style={styles.siraDotLive} />
                  <Text style={styles.siraBadgeText}>ASSISTANT SIRA</Text>
                </View>
                <Text style={styles.bubbleText}>
                  Voici comment <Text style={styles.bubbleBoldText}>vous</Text> allez <Text style={styles.bubbleBoldText}>rejoindre</Text> votre destination.
                </Text>
              </View>

              {/* 3D Character Assistant pointing left */}
              <Image
                source={require('@/assets/images/sira-character-assistant.png')}
                style={styles.pointingCharacterImg}
                contentFit="contain"
              />

              {/* Floating Orange Start Itinerary FAB Button */}
              <TouchableOpacity
                style={styles.startFabButton}
                onPress={() =>
                  router.push({
                    pathname: '/navigation-active',
                    params: { destination: arrival },
                  })
                }
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

        {/* Feedback Modal */}
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
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
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
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
  },
  headerRightIcons: {
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
  mapSection: {
    height: height * 0.36,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  tripSummaryPill: {
    position: 'absolute',
    top: 12,
    left: '12%',
    right: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 101, 34, 0.2)',
  },
  tripSummaryText: {
    fontSize: 11.5,
    color: '#333333',
    fontWeight: '500',
  },
  summaryBold: {
    fontWeight: '800',
    color: '#000000',
  },
  summaryGreen: {
    fontWeight: '800',
    color: '#10B981',
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
    top: '36%',
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
    top: '62%',
    left: '38%',
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
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  timelineRowLayout: {
    flexDirection: 'row',
    position: 'relative',
  },
  timelineDashedLine: {
    position: 'absolute',
    left: 18,
    top: 14,
    bottom: 40,
    width: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
  },
  timelineStepsCol: {
    flex: 1.25,
    paddingLeft: 0,
    gap: 16,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepCircleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  destStepCard: {
    borderColor: 'rgba(242, 101, 34, 0.3)',
    backgroundColor: '#FFFBF8',
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  stepTagBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stepTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  stepDescText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  stepCostRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCostBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stepMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  destTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F26522',
  },
  destActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  actionIconBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  assistantColumn: {
    width: 130,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingLeft: 4,
  },
  floatingBubbleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 6,
  },
  siraBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  siraDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  siraBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F26522',
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 14,
  },
  bubbleBoldText: {
    fontWeight: '900',
    color: '#0F172A',
  },
  pointingCharacterImg: {
    width: 120,
    height: 180,
    marginBottom: 10,
  },
  startFabButton: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 9,
    elevation: 7,
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
    fontSize: 11.5,
    fontWeight: '800',
  },
  feedbackModalOverlay: {
    ...StyleSheet.absoluteFillObject,
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
