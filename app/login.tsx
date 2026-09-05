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

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/onboarding');
    }
  };

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const handleGoToSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Dark City/Highway background */}
      <Image
        source={require('@/assets/images/bridge-bg.jpg')}
        style={styles.bgImage}
        contentFit="cover"
      />
      {/* Dark overlay with highway night atmosphere */}
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Navigation Bar: Orange Circular Back Button (←) */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Text style={styles.backArrowText}>←</Text>
              </TouchableOpacity>
            </View>

            {/* Top Diagonal Road Stripe with Orange Slogan Banner */}
            <View style={styles.roadStripeContainer}>
              <Image
                source={require('@/assets/images/road-stripe.png')}
                style={styles.roadStripeImage}
                contentFit="contain"
              />
              <View style={styles.sloganRow}>
                <Text style={styles.sloganWhite}>ON TRACE, </Text>
                <Text style={styles.sloganOrange}>SANS STRESS.</Text>
                <View style={styles.pinMarker}>
                  <Text style={styles.pinIconText}>📍</Text>
                </View>
              </View>
            </View>

            {/* Sira Brand Logo with Road Element */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/sira-logo-transparent.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            {/* Welcome Headlines */}
            <View style={styles.textContainer}>
              <Text style={styles.titleLine1}>HEUREUX</Text>
              <Text style={styles.titleLine2}>
                DE <Text style={styles.titleOrange}>VOUS REVOIR</Text>
              </Text>
              <Text style={styles.subtitle}>
                Votre mobilité à Abidjan vous attend.{
}
                Entrez votre numéro Orange{
}
                pour accéder à votre compte{
}
                et retrouver votre expérience SIRA.
              </Text>
            </View>

            {/* Input Field: Orange User Icon + Dark Pill */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <IconSymbol name="house.fill" size={16} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="07 XX XX XX XX"
                placeholderTextColor="#7E7E7E"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Orange Connect Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>SE CONNECTER</Text>
            </TouchableOpacity>

            {/* Switch to Signup Link */}
            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={handleGoToSignup}
              activeOpacity={0.7}
            >
              <Text style={styles.switchAuthText}>
                Pas encore de compte ?{' '}
                <Text style={styles.switchAuthHighlight}>S'INSCRIRE</Text>
              </Text>
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
    backgroundColor: '#0F0F0F',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.88)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  roadStripeContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
    height: 54,
    justifyContent: 'center',
  },
  roadStripeImage: {
    position: 'absolute',
    width: width * 0.95,
    height: 48,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.9,
  },
  sloganRow: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ rotate: '-8deg' }],
    zIndex: 5,
  },
  sloganWhite: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  sloganOrange: {
    color: '#F26522',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  pinMarker: {
    marginLeft: 4,
  },
  pinIconText: {
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  logoImage: {
    width: 140,
    height: 70,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleLine1: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  titleLine2: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 2,
  },
  titleOrange: {
    color: '#F26522',
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '400',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#353535',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#424242',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 10,
  },
  loginButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  switchAuthButton: {
    marginTop: 24,
    paddingVertical: 8,
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
