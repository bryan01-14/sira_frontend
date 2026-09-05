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
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding');
    }
  };

  const handleSignup = () => {
    router.replace('/(tabs)');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Background: White Sky with Sira Logo and Slogan */}
      <View style={styles.topHeader}>
        <SafeAreaView style={styles.topSafeArea}>
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Text style={styles.backArrowText}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Sira Brand Logo */}
          <View style={styles.headerLogoContainer}>
            <Image
              source={require('@/assets/images/sira-logo-transparent.png')}
              style={styles.headerLogoImage}
              contentFit="contain"
            />
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Middle Wave City Picture with Tilted iPhone Mockup on the Left */}
          <View style={styles.heroSection}>
            <Image
              source={require('@/assets/images/signup-wave-city.jpg')}
              style={styles.waveCityImage}
              contentFit="cover"
            />

            {/* Tilted iPhone Mockup on the left side of the wave */}
            <View style={styles.mockupContainer}>
              <Image
                source={require('@/assets/images/sira-app-mockup.png')}
                style={styles.mockupImage}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Bottom Card / White Background Section */}
          <View style={styles.bottomSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeTitle}>
                BIENVENUE SUR <Text style={styles.orangeText}>SIRA</Text>
              </Text>
              <Text style={styles.welcomeSubtitle}>
                L'application qui simplifie{
}vos déplacements à Abidjan.
              </Text>
            </View>

            {/* Input 1: Prénom */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Prénom"
                placeholderTextColor="#7E7E7E"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            {/* Input 2: Numéro Orange */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Entrez votre numéro Orange"
                placeholderTextColor="#7E7E7E"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Orange Inscription Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.85}
            >
              <Text style={styles.signupButtonText}>S'INSCRIRE</Text>
            </TouchableOpacity>

            {/* Switch to Login Link */}
            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={handleGoToLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.switchAuthText}>
                Déjà un compte ?{' '}
                <Text style={styles.switchAuthHighlight}>SE CONNECTER</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 4,
    zIndex: 10,
  },
  topSafeArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 6,
  },
  headerLogoImage: {
    width: 130,
    height: 60,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  heroSection: {
    width: '100%',
    height: 250,
    position: 'relative',
    marginVertical: 4,
  },
  waveCityImage: {
    width: '100%',
    height: '100%',
  },
  mockupContainer: {
    position: 'absolute',
    left: 14,
    top: 8,
    width: 140,
    height: 230,
    transform: [{ rotate: '-1.5deg' }],
    zIndex: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  mockupImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingTop: 12,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    color: '#121212',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  orangeText: {
    color: '#F26522',
  },
  welcomeSubtitle: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#353535',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    paddingVertical: 8,
  },
  signupButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  switchAuthButton: {
    marginTop: 18,
    paddingVertical: 6,
  },
  switchAuthText: {
    color: '#8E8E8E',
    fontSize: 12,
    fontWeight: '500',
  },
  switchAuthHighlight: {
    color: '#F26522',
    fontWeight: '800',
  },
});
