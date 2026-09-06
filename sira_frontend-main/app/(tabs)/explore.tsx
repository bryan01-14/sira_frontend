import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
type TransportMode = 'Coulé' | 'Debout' | 'Suspendu';
const MODES: Array<{ name: TransportMode; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { name: 'Coulé', subtitle: 'Moindre cher', icon: 'people' },
  { name: 'Debout', subtitle: 'Standard', icon: 'star' },
  { name: 'Suspendu', subtitle: 'Confort', icon: 'crown' },
];

export default function RouteExploreScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination?: string }>();
  const [selectedMode, setSelectedMode] = useState<TransportMode>('Coulé');
  const [showDetail, setShowDetail] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/sira-logo-vector.png')} style={styles.headerLogo} contentFit="contain" />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconButton} onPress={() => setShowFeedback(true)} accessibilityLabel="Voir les notifications">
              <Ionicons name="notifications" size={17} color="#111111" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()} accessibilityLabel="Retour à l'accueil">
              <Ionicons name="menu" size={22} color="#111111" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.routeCard}>
          <RouteRow color="#34A853" label="Départ" value="Abobo Samaké" />
          <View style={styles.routeDivider} />
          <RouteRow color="#F26522" label="Arrivée" value={destination || 'Orange Digital Center'} />
        </View>

        {!showDetail && (
          <>
            <View style={styles.filterRow}>
              <View style={styles.filterActive}><Ionicons name="apps" size={11} color="#FFFFFF" /><Text style={styles.filterActiveText}>Tout</Text></View>
              {[1, 2, 3, 4].map((item) => <View style={styles.walkFilter} key={item}><Ionicons name="walk" size={11} color="#222222" /><Text style={styles.walkFilterText}>Marche</Text></View>)}
            </View>
            <View style={styles.modeTabs}>
              {MODES.map((mode) => (
                <TouchableOpacity key={mode.name} style={[styles.modeTab, selectedMode === mode.name && styles.modeTabActive]} onPress={() => setSelectedMode(mode.name)} activeOpacity={0.8}>
                  <Ionicons name={mode.icon} size={16} color="#FFFFFF" />
                  <Text style={styles.modeTabText}>{mode.name}</Text>
                  <Text style={styles.modeTabSub}>{mode.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.mapPreview}>
              <Image source={require('@/assets/images/city-route-3d-bg.jpg')} style={styles.mapBackground} contentFit="cover" contentPosition={{ top: '12%', left: '50%' }} />
            </View>
          </>
        )}

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!showDetail ? <RouteSummary mode={selectedMode} onDetails={() => setShowDetail(true)} /> : <RouteDetails onClose={() => setShowDetail(false)} onStart={() => setShowFeedback(true)} />}
        </ScrollView>

        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <View style={styles.feedbackCard}>
              <TouchableOpacity style={styles.feedbackClose} onPress={() => setShowFeedback(false)}><Ionicons name="close" size={20} color="#666666" /></TouchableOpacity>
              <Image source={require('@/assets/images/sira-character-assistant.png')} style={styles.feedbackAvatar} contentFit="contain" />
              <Text style={styles.feedbackTitle}>Notifications SIRA</Text>
              <Text style={styles.feedbackSub}>Votre trajet est prêt à être consulté.</Text>
              <View style={styles.starsRow}>{[1, 2, 3, 4, 5].map((star) => <TouchableOpacity key={star} onPress={() => setRating(star)}><Ionicons name={star <= rating ? 'star' : 'star-outline'} size={25} color="#F26522" /></TouchableOpacity>)}</View>
              <TouchableOpacity style={styles.submitFeedbackBtn} onPress={() => setShowFeedback(false)}><Text style={styles.submitFeedbackText}>Fermer</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

function RouteRow({ color, label, value }: { color: string; label: string; value: string }) {
  return <View style={styles.routeRow}><View style={[styles.routeDot, { backgroundColor: color }]} /><View style={styles.routeTextCol}><Text style={styles.routeLabel}>{label}</Text><Text style={styles.routeValue} numberOfLines={1}>{value}</Text></View></View>;
}

function RouteSummary({ mode, onDetails }: { mode: TransportMode; onDetails: () => void }) {
  return <View style={styles.summaryCard}>
    <View style={styles.summaryHeader}><View><Text style={styles.summaryTitle}>{mode}</Text><Text style={styles.summaryCost}>Coût : entre 500F et 1.500F</Text><Text style={styles.summaryTimes}>Départ : 09H30 • Arrivée : 10H30</Text></View><View style={styles.durationBadge}><Text style={styles.durationNumber}>24</Text><Text style={styles.durationUnit}>min</Text></View></View>
    <View style={styles.trafficRow}><View style={styles.trafficIndicator} /><Text style={styles.trafficText}>Trafic modéré • sur 18 Km</Text></View>
    <View style={styles.stepPillsRow}>{['walk', 'bus', 'car', 'walk'].map((icon, index) => <React.Fragment key={`${icon}-${index}`}>{index > 0 && <Ionicons name="chevron-forward" size={11} color="#999999" />}<View style={styles.stepPill}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={12} color="#F26522" /><Text style={styles.stepPillText}>{[5, 7, 9, 3][index]} min</Text></View></React.Fragment>)}</View>
    <TouchableOpacity style={styles.detailButton} onPress={onDetails}><Text style={styles.detailButtonText}>Détail de l'itinéraire</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" /></TouchableOpacity>
  </View>;
}

function RouteDetails({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const steps = [['walk', 'Marchez pendant 6 min', "Depuis Abobo Terminus jusqu'à Gare d'Adjamé."], ['bus', 'Prenez le Bus 22 pendant 20 min', 'Direction Riviera Palmeraie.'], ['car', 'Prenez un taxi pendant 7 min', "Jusqu'à Cocody Riviera 3."]] as const;
  return <View style={styles.detailCard}><View style={styles.detailCardHeader}><Text style={styles.detailCardTitle}>Décomposition d'itinéraire</Text><TouchableOpacity onPress={onClose}><Ionicons name="close" size={18} color="#666666" /></TouchableOpacity></View>{steps.map(([icon, title, description], index) => <View style={styles.timelineItem} key={title}><View style={styles.timelineIconCol}><View style={styles.timelineIconCircle}><Ionicons name={icon} size={16} color="#F26522" /></View>{index < steps.length - 1 && <View style={styles.timelineLine} />}</View><View style={styles.timelineContent}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepDesc}>{description}</Text><Text style={styles.stepTime}>09:{20 + index * 6} → 09:{26 + index * 6}</Text></View></View>)}<TouchableOpacity style={styles.detailButton} onPress={onStart}><Text style={styles.detailButtonText}>Démarrer l'itinéraire</Text><Ionicons name="navigate" size={18} color="#FFFFFF" /></TouchableOpacity></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 4 }, headerLogo: { width: 52, height: 30 }, headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, headerIconButton: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', position: 'relative' }, notificationDot: { position: 'absolute', top: 4, right: 5, width: 5, height: 5, borderRadius: 3, backgroundColor: '#F26522' },
  routeCard: { marginHorizontal: 12, marginTop: 2, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 9, borderWidth: 1, borderColor: '#E9E9E9', elevation: 2 }, routeRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, routeDot: { width: 9, height: 9, borderRadius: 5 }, routeTextCol: { flex: 1 }, routeLabel: { color: '#999999', fontSize: 9 }, routeValue: { color: '#151515', fontSize: 11, fontWeight: '800', marginTop: 1 }, routeDivider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 6, marginLeft: 18 },
  filterRow: { flexDirection: 'row', gap: 5, marginHorizontal: 12, marginTop: 7 }, filterActive: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F26522', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 }, filterActiveText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800' }, walkFilter: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#F4F4F4', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 }, walkFilterText: { color: '#222222', fontSize: 8 }, modeTabs: { flexDirection: 'row', gap: 7, marginHorizontal: 12, marginTop: 7 }, modeTab: { flex: 1, alignItems: 'center', backgroundColor: '#050505', borderRadius: 8, paddingVertical: 7 }, modeTabActive: { borderWidth: 1, borderColor: '#F26522' }, modeTabText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', marginTop: 2 }, modeTabSub: { color: '#D0D0D0', fontSize: 8 },
  mapPreview: { height: height * 0.31, marginTop: 7, overflow: 'hidden', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E7E7E7' }, mapBackground: { width: '100%', height: '100%' }, scrollContainer: { flex: 1, marginTop: 7 }, scrollContent: { paddingHorizontal: 12, paddingBottom: 24 }, summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 9, padding: 10, borderWidth: 1, borderColor: '#E7E7E7' }, summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, summaryTitle: { color: '#111111', fontSize: 15, fontWeight: '900' }, summaryCost: { color: '#555555', fontSize: 10, marginTop: 2 }, summaryTimes: { color: '#777777', fontSize: 9, marginTop: 2 }, durationBadge: { alignItems: 'center' }, durationNumber: { color: '#111111', fontSize: 19, fontWeight: '900' }, durationUnit: { color: '#555555', fontSize: 9 }, trafficRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 }, trafficIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#34A853' }, trafficText: { color: '#555555', fontSize: 9, fontWeight: '600' }, stepPillsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }, stepPill: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#FFF4EE', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 6 }, stepPillText: { fontSize: 8, color: '#333333' }, detailButton: { backgroundColor: '#F26522', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 9, borderRadius: 9, marginTop: 5 }, detailButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E7E7E7' }, detailCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, detailCardTitle: { color: '#111111', fontSize: 15, fontWeight: '900' }, timelineItem: { flexDirection: 'row', gap: 10, marginBottom: 13 }, timelineIconCol: { alignItems: 'center', width: 26 }, timelineIconCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFF4EE', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F26522' }, timelineLine: { flex: 1, width: 2, backgroundColor: '#F26522', opacity: 0.4 }, timelineContent: { flex: 1 }, stepTitle: { color: '#111111', fontSize: 12, fontWeight: '800' }, stepDesc: { color: '#555555', fontSize: 11, marginTop: 2 }, stepTime: { color: '#F26522', fontSize: 10, fontWeight: '700', marginTop: 4 },
  feedbackOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, zIndex: 100 }, feedbackCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20, alignItems: 'center' }, feedbackClose: { position: 'absolute', top: 12, right: 12, padding: 4 }, feedbackAvatar: { width: 72, height: 72, marginBottom: 8 }, feedbackTitle: { color: '#111111', fontSize: 16, fontWeight: '900' }, feedbackSub: { color: '#666666', fontSize: 12, textAlign: 'center', marginTop: 4 }, starsRow: { flexDirection: 'row', gap: 7, marginVertical: 16 }, submitFeedbackBtn: { backgroundColor: '#F26522', paddingVertical: 10, borderRadius: 14, width: '100%', alignItems: 'center' }, submitFeedbackText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
