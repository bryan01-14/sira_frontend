import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OsrmMap, { OsrmMapMarker } from '../components/osrm-map';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HOME_TRAFFIC_MARKERS: OsrmMapMarker[] = [
  { id: 'm1', lat: 5.394, lon: -4.041, type: 'flood' },
  { id: 'm2', lat: 5.362, lon: -4.025, type: 'jam' },
  { id: 'm3', lat: 5.353, lon: -4.011, type: 'accident' },
  { id: 'm4', lat: 5.374, lon: -3.998, type: 'closed' },
  { id: 'm5', lat: 5.335, lon: -4.019, type: 'jam' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [mapHeight, setMapHeight] = useState(320);
  const [activeTab, setActiveTab] = useState<
    'home' | 'traffic' | 'rewards' | 'profile'
  >('home');

  const handleToggleShareLocation = () => {
    setIsSharingLocation((prev) => !prev);
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Top Header: Crisp HD Sira Logo + Crisp Native Notification Bell with Badge */}
      <View style={styles.topHeader}>
        <Image
          source={require('../../assets/images/sira-logo-header.png')}
          style={styles.headerLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Sira Chauffeur"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={handleNotifications}
          hitSlop={12}
          style={({ pressed }) => [
            styles.bellContainer,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/bell-hd.png')}
            style={styles.bellIcon}
            resizeMode="contain"
          />
          <View style={styles.bellBadgeCircle}>
            <Text style={styles.bellBadgeText}>3</Text>
          </View>
        </Pressable>
      </View>

      {/* Driver Greeting & Line Badge Row */}
      <View style={styles.profileRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mon compte"
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.avatarShadowWrapper,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.avatarCircle}>
            <Image
              source={require('../../assets/images/chauffeur-avatar-clean.png')}
              style={styles.avatarImage}
              resizeMode="cover"
              accessibilityLabel="Photo de profil Kouadio"
            />
          </View>
        </Pressable>

        <View style={styles.greetingContent}>
          <Text style={styles.greetingTitle}>
            Bonjour <Text style={styles.greetingNameBold}>Kouadio</Text>
          </Text>

          <Text style={styles.greetingSubtitle}>
            Prêt à <Text style={styles.boldText}>gagner</Text> des{' '}
            <Text style={styles.boldText}>récompenses</Text>
            {'\n'}avec <Text style={styles.boldText}>SIRA</Text> aujourd’hui ?
          </Text>

          <View style={styles.lineBadge}>
            <Text style={styles.lineBadgeText}>Ma ligne : Adjamé-Plateau</Text>
          </View>
        </View>
      </View>

      {/* Central Live OSRM Traffic Map Section */}
      <View
        style={styles.mapContainer}
        onLayout={(e) => {
          const h = Math.round(e.nativeEvent.layout.height);
          if (h > 80) setMapHeight(h);
        }}
      >
        <OsrmMap
          width={SCREEN_WIDTH}
          height={mapHeight}
          origin={{ lat: 5.4168, lon: -4.0195 }}
          destination={{ lat: 5.3231, lon: -4.0205 }}
          initialCenter={{ lat: 5.365, lon: -4.02 }}
          initialZoom={13}
          routeStyle="traffic"
          markers={HOME_TRAFFIC_MARKERS}
          showDriverPulse={isSharingLocation}
          driverPosition={{ lat: 5.3544, lon: -4.0218 }}
        />

        {/* Top-Right White Location Badge when Sharing is Active */}
        {isSharingLocation && (
          <View style={styles.locationActiveBadge}>
            <Text style={styles.locationActiveTitle}>Localisation activée</Text>
            <Text style={styles.locationActiveSub}>
              <Text style={styles.boldText}>Position</Text> : Rivera latri
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Action Sheet (Adapts dynamically when sharing is active) */}
      <View
        style={[
          styles.bottomCard,
          isSharingLocation && styles.bottomCardSharing,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isSharingLocation ? 'Arrêter le partage' : 'Partager ma position'
          }
          onPress={handleToggleShareLocation}
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.buttonPressed,
          ]}
        >
          {isSharingLocation && (
            <View style={styles.pauseIconContainer}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          )}
          <Text style={styles.shareButtonText}>
            {isSharingLocation ? 'ARRÊTER LE PARTAGE' : 'PARTAGER MA POSITION'}
          </Text>
        </Pressable>

        {isSharingLocation ? (
          <>
            {/* Status text when sharing */}
            <View style={styles.sharingStatusBlock}>
              <Text style={styles.sharingStatusTitle}>Partage en cours</Text>
              <Text style={styles.sharingStatusSubtitle}>
                Votre localisation est transmise à SIRA
              </Text>
            </View>

            {/* Warm Peach Community Impact Banner with 3D SIRA Characters */}
            <View style={styles.impactBannerWrapper}>
              <View style={styles.impactBannerCard}>
                <Text style={styles.impactBannerText}>
                  <Text style={styles.boldText}>Vous participez</Text> à{'\n'}
                  l&apos;<Text style={styles.boldText}>amélioration</Text> des{' '}
                  <Text style={styles.boldText}>déplacements</Text>
                  {'\n'}de{' '}
                  <Text style={styles.boldText}>milliers d&apos;usagers.</Text>
                </Text>
              </View>

              <Image
                source={require('../../assets/images/sharing-characters-hd.png')}
                style={styles.impactCharactersImage}
                resizeMode="contain"
                accessibilityLabel="Chauffeurs partenaires SIRA"
              />
            </View>
          </>
        ) : (
          <Text style={styles.authorizationText}>
            Vous autorisez SIRA à suivre{'\n'}votre position durant votre
            service.
          </Text>
        )}
      </View>

      {/* Crisp 100% Native Bottom Navigation Bar */}
      <View style={styles.navbarOuter}>
        <View style={styles.navbarBar}>
          {/* Tab 1: Home with Raised White Notch & Orange Circle */}
          <View style={styles.tabSlot}>
            <View style={styles.homeNotchOuter}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel="Accueil"
                accessibilityState={{ selected: activeTab === 'home' }}
                onPress={() => setActiveTab('home')}
                style={({ pressed }) => [
                  styles.homeOrangeCircle,
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={require('../../assets/images/icons/nav-home-hd.png')}
                  style={styles.homeIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>

          {/* Tab 2: Traffic / Cars */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Trafic et courses"
            accessibilityState={{ selected: activeTab === 'traffic' }}
            onPress={() => router.push('/traffic')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-cars-hd.png')}
              style={[
                styles.navIcon,
                activeTab === 'traffic' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 3: Rewards / Trophy */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Récompenses"
            accessibilityState={{ selected: activeTab === 'rewards' }}
            onPress={() => router.push('/benefits')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-trophy-hd.png')}
              style={[
                styles.navIcon,
                activeTab === 'rewards' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 4: Profile */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Profil"
            accessibilityState={{ selected: activeTab === 'profile' }}
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-user-hd.png')}
              style={[
                styles.navIcon,
                activeTab === 'profile' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {insets.bottom > 0 && (
          <View style={{ height: insets.bottom, backgroundColor: '#333333' }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 8,
  },
  headerLogo: {
    width: 58,
    height: 58,
  },
  bellContainer: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    width: 26,
    height: 26,
  },
  bellBadgeCircle: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 9.5,
  },
  pressed: {
    opacity: 0.75,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  avatarShadowWrapper: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#EE6723',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  greetingTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 2,
  },
  greetingNameBold: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  greetingSubtitle: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  lineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF6A29',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  lineBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11.5,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  locationActiveBadge: {
    position: 'absolute',
    top: 20,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  locationActiveTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11.5,
    fontWeight: '700',
    lineHeight: 15,
  },
  locationActiveSub: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
    lineHeight: 15,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 22,
    paddingHorizontal: 14,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -16,
    zIndex: 3,
  },
  bottomCardSharing: {
    paddingTop: 16,
    paddingBottom: 18,
  },
  shareButton: {
    width: Math.min(Math.round(SCREEN_WIDTH * 0.72), 290),
    height: 48,
    borderRadius: 999,
    backgroundColor: '#EF6622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#EF6622',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  pauseIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  pauseBar: {
    width: 4.5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  authorizationText: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
  },
  sharingStatusBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sharingStatusTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  sharingStatusSubtitle: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
  },
  impactBannerWrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 8,
    marginBottom: 2,
  },
  impactBannerCard: {
    width: '100%',
    backgroundColor: '#FFEACD',
    borderRadius: 16,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 125,
    justifyContent: 'center',
    minHeight: 74,
  },
  impactBannerText: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  impactCharactersImage: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    width: 126,
    height: 88,
  },
  navbarOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 4,
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
  homeNotchOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  homeOrangeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: {
    width: 24,
    height: 24,
  },
  navIcon: {
    width: 26,
    height: 26,
    opacity: 0.9,
  },
  navIconActive: {
    opacity: 1,
    tintColor: '#EF6622',
  },
});
