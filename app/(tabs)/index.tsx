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
    const target = destination.trim();
    if (target) {
      router.push({
        pathname: '/(tabs)/explore',
        params: { destination: target, query: target },
      });
    } else {
      router.push('/(tabs)/explore');
    }
  };

  const handleQuickSelect = (place: string) => {
    setDestination(place);
    router.push({
      pathname: '/(tabs)/explore',
      params: { destination: place, query: place },
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

          {/* 3D Animated Assistant Character */}
          <View style={styles.characterContainer}>
            <Image
              source={require('@/assets/images/sira-character-assistant.png')}
              style={styles.characterImage}
              contentFit="contain"
            />
          </View>
        </View>

        {/* Bottom Destination Section */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.bottomBarContainer}
        >
          {/* Destination Search Bar (Floating Orange Pill with TextInput) */}
          <View style={styles.searchPill}>
            <View style={styles.searchPinCircle}>
              <Ionicons name="location-sharp" size={18} color="#FFFFFF" />
            </View>

            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Où voulez-vous aller ?"
                placeholderTextColor="rgba(255, 255, 255, 0.75)"
                value={destination}
                onChangeText={setDestination}
                onSubmitEditing={handleSearchPress}
                returnKeyType="search"
                autoCapitalize="sentences"
                autoCorrect={false}
              />
            </View>

            {destination.length > 0 && (
              <TouchableOpacity
                style={styles.clearCircle}
                onPress={() => setDestination('')}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.searchArrowCircle}
              onPress={handleSearchPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Favorite Place Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFavsScrollView}
            contentContainerStyle={styles.quickFavsContainer}
          >
            <TouchableOpacity
              style={styles.quickFavChip}
              onPress={() => handleQuickSelect('Abobo Samaké')}
              activeOpacity={0.8}
            >
              <Ionicons name="home" size={13} color="#F26522" />
              <Text style={styles.quickFavText}>Maison</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickFavChip}
              onPress={() => handleQuickSelect('Orange Digital Center')}
              activeOpacity={0.8}
            >
              <Ionicons name="briefcase" size={13} color="#F26522" />
              <Text style={styles.quickFavText}>Travail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickFavChip}
              onPress={() => handleQuickSelect("Gare d'Adjamé")}
              activeOpacity={0.8}
            >
              <Ionicons name="bus" size={13} color="#F26522" />
              <Text style={styles.quickFavText}>Gare Adjamé</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickFavChip}
              onPress={() => handleQuickSelect('Plateau Immeuble CCIA')}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={13} color="#F26522" />
              <Text style={styles.quickFavText}>Plateau</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickFavChip}
              onPress={() => handleQuickSelect('Riviera 3')}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={13} color="#F26522" />
              <Text style={styles.quickFavText}>Riviera 3</Text>
            </TouchableOpacity>
          </ScrollView>
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
    paddingBottom: 0,
  },
  speechBubble: {
    position: 'absolute',
    top: height * 0.05,
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
    width: width * 0.86,
    height: height * 0.36,
    alignSelf: 'flex-start',
    marginLeft: -10,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 115 : 95,
    width: '100%',
  },
  quickFavsScrollView: {
    marginTop: 0,
    maxHeight: 52,
  },
  quickFavsContainer: {
    gap: 10,
    alignItems: 'center',
    paddingVertical: 2,
  },
  quickFavChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(242, 101, 34, 0.15)',
  },
  quickFavText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchPill: {
    backgroundColor: '#F26522',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginBottom: 12,
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
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  clearCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
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
