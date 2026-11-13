import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OsrmMap, { OsrmMapMarker } from '../components/osrm-map';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = Math.round(SCREEN_WIDTH * (259 / 398));

const LOCATION_MARKERS: OsrmMapMarker[] = [
  {
    id: 'acc-1',
    lat: 5.3635,
    lon: -4.0225,
    type: 'accident',
    label: 'Accident',
    sublabel: 'Circulation ralentie',
  },
];

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('Abobo samaké, abobo, rue 099');
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top White Header with Circular Back Button + "Localisation" */}
        <View
          style={[
            styles.headerRow,
            { paddingTop: Math.max(insets.top + 10, 28) },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backButtonCircle,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/arrow-left-hd.png')}
              style={styles.backArrowIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Text style={styles.headerTitle}>Localisation</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Full-Width Live OSRM Map Section */}
          <View style={styles.mapContainer}>
            <OsrmMap
              width={SCREEN_WIDTH}
              height={MAP_HEIGHT}
              origin={{ lat: 5.4168, lon: -4.0195 }}
              destination={{ lat: 5.3231, lon: -4.0205 }}
              initialCenter={{ lat: 5.362, lon: -4.014 }}
              initialZoom={13}
              routeStyle="blue"
              markers={LOCATION_MARKERS}
              showDriverPulse
              driverPosition={{ lat: 5.3544, lon: -4.0241 }}
            />

            {/* Crisp Native "Votre position" Pill Overlay */}
            <View style={styles.yourPositionPill}>
              <Text style={styles.yourPositionText}>Votre position</Text>
            </View>
          </View>

          {/* Bottom Content Section */}
          <View style={styles.contentSection}>
            {/* Position Input Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Position</Text>
              <TextInput
                style={styles.fieldInput}
                value={address}
                onChangeText={setAddress}
                placeholder="Saisissez votre position actuelle"
                placeholderTextColor="#94A3B8"
                selectionColor="#EF6622"
              />
            </View>

            {/* "Accès à la position" Toggle Card */}
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Accès à la position"
              accessibilityState={{ checked: locationEnabled }}
              onPress={() => setLocationEnabled((prev) => !prev)}
              style={styles.accessCard}
            >
              <View style={styles.accessTextBlock}>
                <Text style={styles.accessTitle}>Accès à la position</Text>
                <Text style={styles.accessDescription}>
                  Permet à SIRA d’utiliser automatiquement votre position pour
                  vous proposer des itinéraires adaptés.
                </Text>
              </View>

              {/* Custom Crisp Toggle Switch */}
              <View
                style={[
                  styles.switchTrack,
                  locationEnabled
                    ? styles.switchTrackActive
                    : styles.switchTrackInactive,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    locationEnabled
                      ? styles.switchThumbActive
                      : styles.switchThumbInactive,
                  ]}
                />
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Bottom Dark Navigation Bar */}
        <View style={styles.navbarOuter}>
          <View style={styles.navbarBar}>
            <Pressable
              accessibilityRole="tab"
              accessibilityLabel="Accueil"
              onPress={() => router.replace('/home')}
              style={({ pressed }) => [
                styles.tabSlot,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/nav-home-gray-hd.png')}
                style={styles.navIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityLabel="Trafic et courses"
              onPress={() => router.push('/traffic')}
              style={({ pressed }) => [
                styles.tabSlot,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/nav-cars-hd.png')}
                style={styles.navIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityLabel="Récompenses"
              onPress={() => router.push('/benefits')}
              style={({ pressed }) => [
                styles.tabSlot,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/nav-trophy-hd.png')}
                style={styles.navIcon}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              accessibilityLabel="Mon compte"
              onPress={() => router.replace('/profile')}
              style={({ pressed }) => [
                styles.tabSlot,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/nav-user-hd.png')}
                style={styles.navIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {insets.bottom > 0 && (
            <View
              style={{ height: insets.bottom, backgroundColor: '#333333' }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backArrowIcon: {
    width: 16,
    height: 16,
  },
  headerTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  pressed: {
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  mapContainer: {
    width: SCREEN_WIDTH,
    height: MAP_HEIGHT,
    position: 'relative',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  yourPositionPill: {
    position: 'absolute',
    top: 12,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 4,
  },
  yourPositionText: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12.5,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 15,
    paddingTop: 22,
  },
  fieldGroup: {
    width: '86%',
    marginBottom: 18,
  },
  fieldLabel: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
  },
  fieldInput: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17.5,
    fontWeight: '700',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D4D8DE',
  },
  accessCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F6F8',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 11,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  accessTextBlock: {
    flex: 1,
    paddingRight: 14,
  },
  accessTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  accessDescription: {
    color: '#333333',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 17.5,
  },
  switchTrack: {
    width: 46,
    height: 25,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  switchTrackInactive: {
    backgroundColor: '#D8DCE2',
  },
  switchTrackActive: {
    backgroundColor: '#EF6622',
  },
  switchThumb: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbInactive: {
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  navbarOuter: {
    width: '100%',
    backgroundColor: '#333333',
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
  navIcon: {
    width: 26,
    height: 26,
    opacity: 0.9,
  },
});
