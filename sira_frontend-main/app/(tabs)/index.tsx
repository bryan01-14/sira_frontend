import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSearchPress = () => {
    router.push({
      pathname: '/(tabs)/explore',
      params: destination.trim() ? { destination: destination.trim() } : undefined,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background: 3D Aerial City Map with Navigation Routes */}
      <Image
        source={require('@/assets/images/city-route-3d-bg.jpg')}
        style={styles.backgroundImage}
        contentFit="cover"
        contentPosition={{ top: '0%', left: '50%' }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header Bar with Menu / Brand Slogan */}
        <View style={styles.topHeader}>
          <View style={styles.sloganRow}>
            <Text style={styles.sloganBlack}>On trace, </Text>
            <Text style={styles.sloganOrange}>sans stress.</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le menu"
          >
            <Ionicons name="menu" size={23} color="#111111" />
          </TouchableOpacity>
        </View>

        {/* Middle Section: Speech Bubble Greeting + 3D Waving Character */}
        <View style={styles.centerSection}>
          {/* Speech / Greeting Bubble */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechGreeting}>Salut Diata, on part où ?</Text>
            <Text style={styles.speechMain}>
              Entrez votre destination
            </Text>
            <Text style={styles.speechSub}>
              et je vous aide à trouver le meilleur trajet.
            </Text>
          </View>

          {/* 3D Animated Assistant Character (Diata / Sira mascot waving) */}
          <View style={styles.characterContainer}>
            <Image
              source={require('@/assets/images/sira-character-assistant.png')}
              style={styles.characterImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Bottom Destination Search Bar (Floating Orange Pill) */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.bottomBarContainer}
        >
          <View style={styles.searchPill}>
            {/* Left Orange Circle with Location Pin */}
            <View style={styles.searchPinCircle}>
              <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
            </View>

            {/* Input / Placeholder Text */}
            <TextInput
              value={destination}
              onChangeText={setDestination}
              onSubmitEditing={handleSearchPress}
              placeholder="Où voulez-vous aller ?"
              placeholderTextColor="#FFFFFF"
              returnKeyType="search"
              style={styles.searchInput}
              accessibilityLabel="Destination"
            />

            {/* Right Arrow / Action Icon */}
            <TouchableOpacity
              style={styles.searchArrowCircle}
              onPress={handleSearchPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Rechercher une destination"
            >
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {menuVisible && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.sideMenu}>
            <View style={styles.menuHeader}>
              <Image
                source={require('@/assets/images/sira-logo-white.png')}
                style={styles.menuLogo}
                contentFit="contain"
              />
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                style={styles.closeMenuButton}
                accessibilityRole="button"
                accessibilityLabel="Fermer le menu"
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileRow}>
              <Image
                source={require('@/assets/images/sira-character-assistant.png')}
                style={styles.profileAvatar}
                contentFit="contain"
              />
              <View>
                <Text style={styles.profileName}>Diata</Text>
                <Text style={styles.profilePhone}>+225 070353269</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color="#F26522" />
            </View>

            <View style={styles.menuItems}>
              <MenuItem icon="time-outline" label="Historique" onPress={() => setMenuVisible(false)} />
              <MenuItem icon="car-outline" label="Trafic" onPress={() => setMenuVisible(false)} />
              <MenuItem icon="warning-outline" label="Signaler un incident" onPress={() => setMenuVisible(false)} />
              <MenuItem icon="settings-outline" label="Paramètres" onPress={() => setMenuVisible(false)} />
              <MenuItem icon="information-circle-outline" label="À propos de SIRA" onPress={() => setMenuVisible(false)} />
            </View>

            <TouchableOpacity style={styles.shareCard} activeOpacity={0.85}>
              <View style={styles.shareTextColumn}>
                <Text style={styles.shareTitle}>Partager SIRA</Text>
                <Text style={styles.shareSubtitle}>à mes amis !</Text>
                <View style={styles.shareButton}>
                  <Ionicons name="share-social" size={13} color="#F26522" />
                  <Text style={styles.shareButtonText}>Partager SIRA</Text>
                </View>
              </View>
              <Ionicons name="people" size={40} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemIcon}>
        <Ionicons name={icon} size={16} color="#F26522" />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={14} color="#777777" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sloganRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sloganBlack: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  sloganOrange: {
    color: '#F26522',
    fontSize: 12,
    fontWeight: '800',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    paddingBottom: 20,
  },
  speechBubble: {
    position: 'absolute',
    top: height * 0.08,
    left: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
    maxWidth: width * 0.65,
  },
  speechGreeting: {
    color: '#121212',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  speechMain: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '500',
  },
  siraBold: {
    color: '#F26522',
    fontWeight: '900',
  },
  speechSub: {
    color: '#555555',
    fontSize: 12.5,
    fontWeight: '400',
  },
  characterContainer: {
    width: width * 0.88,
    height: height * 0.52,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 58 : 66,
    width: '100%',
  },
  searchPill: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 30,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 8,
  },
  searchPinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  searchArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    flexDirection: 'row',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
  },
  sideMenu: {
    width: Math.min(width * 0.82, 320),
    backgroundColor: '#050505',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 52 : 28,
    paddingBottom: 24,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  menuLogo: {
    width: 62,
    height: 28,
  },
  closeMenuButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  profileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#242424',
    borderWidth: 2,
    borderColor: '#F26522',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  profilePhone: {
    color: '#9A9A9A',
    fontSize: 11,
    marginTop: 2,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
    gap: 10,
  },
  menuItemIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    flex: 1,
    color: '#F0F0F0',
    fontSize: 12,
    fontWeight: '700',
  },
  shareCard: {
    marginTop: 'auto',
    minHeight: 84,
    backgroundColor: '#3A3A3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 2,
  },
  shareTextColumn: {
    alignItems: 'flex-start',
  },
  shareTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  shareSubtitle: {
    color: '#BDBDBD',
    fontSize: 10,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 7,
  },
  shareButtonText: {
    color: '#F26522',
    fontSize: 9,
    fontWeight: '800',
  },
});
