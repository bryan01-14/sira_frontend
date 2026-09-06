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

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

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

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Left Circular Orange Back Button */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>
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
            {/* Top Diagonal Road Stripe Banner with Orange Slogan and Official Pin */}
            <View style={styles.roadStripeContainer}>
              <Image
                source={require('@/assets/images/road-stripe-vector.png')}
                style={styles.roadStripeImage}
                contentFit="contain"
              />
              <View style={styles.sloganRow}>
                <Text style={styles.sloganWhite}>ON TRACE, </Text>
                <Text style={styles.sloganOrange}>SANS STRESS.</Text>
                <Image
                  source={require('@/assets/images/orange-pin-icon.png')}
                  style={styles.pinImage}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Sira Brand White Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/sira-logo-white.png')}
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
                Votre mobilité à Abidjan vous attend.{'\n'}
                Entrez votre numéro Orange{'\n'}
                pour accéder à votre compte{'\n'}
                et retrouver votre expérience SIRA.
              </Text>
            </View>

            {/* Input Field: Orange User Icon + Dark Pill */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="person" size={17} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="07 XX XX XX XX"
                placeholderTextColor="#888888"
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
    backgroundColor: 'rgba(8, 8, 8, 0.86)',
  },
  safeArea: {
    flex: 1,
  },
  topNavRow: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
    zIndex: 10,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 4,
    paddingBottom: 35,
    alignItems: 'center',
  },
  roadStripeContainer: {
    width: width,
    alignItems: 'center',
    marginVertical: 12,
    position: 'relative',
    height: 85,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  roadStripeImage: {
    position: 'absolute',
    width: width * 1.5,
    height: 60,
    transform: [{ rotate: '-9.5deg' }],
  },
  sloganRow: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ rotate: '-9.5deg' }],
    zIndex: 5,
    paddingHorizontal: 8,
  },
  sloganWhite: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sloganOrange: {
    color: '#F26522',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  pinImage: {
    width: 32,
    height: 42,
    marginLeft: 8,
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 22,
  },
  logoImage: {
    width: 175,
    height: 88,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    color: '#C0C0C0',
    fontSize: 13,
    lineHeight: 20,
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
    paddingVertical: 5,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#424242',
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
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
  },
  loginButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 38,
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
    fontSize: 12.5,
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
