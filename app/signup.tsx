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

export default function SignupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = () => {
    router.replace('/(tabs)');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Subtle Background Watermark GPS Path */}
      <Image
        source={require('@/assets/images/pin-path-decor-vector.png')}
        style={styles.bgWatermarkDecor}
        contentFit="contain"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Navigation Row with Black Back Button and Sira Brand Logo */}
            <View style={styles.topNavHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.headerLogoContainer}>
                <Image
                  source={require('@/assets/images/sira-logo-vector.png')}
                  style={styles.headerLogoImage}
                  contentFit="contain"
                />
                <View style={styles.headerTaglineRow}>
                  <Text style={styles.taglineBlack}>ON TRACE, </Text>
                  <Text style={styles.taglineOrange}>SANS STRESS.</Text>
                </View>
              </View>

              {/* Balance spacer */}
              <View style={styles.spacerRight} />
            </View>

            {/* Middle Wave City Picture with iPhone Mockup on the Left over pure white background */}
            <View style={styles.heroSection}>
              <Image
                source={require('@/assets/images/signup-wave-city-pure.png')}
                style={styles.waveCityImage}
                contentFit="contain"
              />

              {/* Front-facing iPhone Mockup on the left side of the wave */}
              <View style={styles.mockupContainer}>
                <Image
                  source={require('@/assets/images/sira-phone-vertical-straight.png')}
                  style={styles.mockupImage}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Bottom Form Section */}
            <View style={styles.bottomSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeTitle}>
                  BIENVENUE SUR <Text style={styles.orangeText}>SIRA</Text>
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  L'application qui simplifie{'\n'}vos déplacements à Abidjan.
                </Text>
              </View>

              {/* Input 1: Prénom */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={17} color="#FFFFFF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Prenom"
                  placeholderTextColor="#888888"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              {/* Input 2: Numéro Orange */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person" size={17} color="#FFFFFF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Entrez votre numéro Orange"
                  placeholderTextColor="#888888"
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
  },
  bgWatermarkDecor: {
    position: 'absolute',
    top: 10,
    right: -10,
    width: width * 0.95,
    height: 380,
    opacity: 0.12,
    zIndex: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 25,
  },
  topNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 4,
    zIndex: 5,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  spacerRight: {
    width: 34,
  },
  headerLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoImage: {
    width: 145,
    height: 68,
  },
  headerTaglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taglineBlack: {
    color: '#111111',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  taglineOrange: {
    color: '#F26522',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroSection: {
    width: '100%',
    height: 310,
    position: 'relative',
    marginVertical: 4,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  waveCityImage: {
    width: '100%',
    height: '100%',
  },
  mockupContainer: {
    position: 'absolute',
    left: 14,
    bottom: 22,
    width: 124,
    height: 216,
    zIndex: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 10,
  },
  mockupImage: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingTop: 10,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#111111',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  orangeText: {
    color: '#F26522',
  },
  welcomeSubtitle: {
    color: '#555555',
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
    paddingVertical: 5,
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
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#F26522',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
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
