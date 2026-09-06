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
  ScrollView,
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

  const handleSearchPress = () => {
    // Navigate to route planning screen
    router.push('/(tabs)/explore');
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
        </View>

        {/* Middle Section: Speech Bubble Greeting + 3D Waving Character */}
        <View style={styles.centerSection}>
          {/* Speech / Greeting Bubble */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechGreeting}>Salut Diata</Text>
            <Text style={styles.speechMain}>
              Je suis <Text style={styles.siraBold}>SIRA</Text>, votre
            </Text>
            <Text style={styles.speechSub}>assistant de mobilité.</Text>
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
          <TouchableOpacity
            style={styles.searchPill}
            onPress={handleSearchPress}
            activeOpacity={0.9}
          >
            {/* Left Orange Circle with Location Pin */}
            <View style={styles.searchPinCircle}>
              <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
            </View>

            {/* Input / Placeholder Text */}
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchTitle}>Où voulez-vous aller ?</Text>
              <Text style={styles.searchSubtitle}>Entrez votre destination</Text>
            </View>

            {/* Right Arrow / Action Icon */}
            <View style={styles.searchArrowCircle}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
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
    justifyContent: 'flex-start',
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
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
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
  searchInputWrapper: {
    flex: 1,
    paddingHorizontal: 12,
  },
  searchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  searchSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11.5,
    fontWeight: '400',
    marginTop: 1,
  },
  searchArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
