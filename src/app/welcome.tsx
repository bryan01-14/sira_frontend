import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ImageBackground
        source={require('../../assets/images/welcome-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Bottom dark overlay matching designer's 402x244 overlay */}
        <View
          style={[
            styles.bottomOverlay,
            {
              paddingBottom: Math.max(insets.bottom + 14, 28),
            },
          ]}
        >
          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.titleWhite}>BIENVENUE SUR</Text>
            <Text style={styles.titleOrange}>SIRA CHAUFFEUR</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Partagez votre position et faites{'\n'}
            partie de notre réseau de{'\n'}
            chauffeurs partenaires.
          </Text>

          {/* Primary Pill Button: S'INSCRIRE */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="S'inscrire"
            onPress={handleRegister}
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.registerButtonText}>S&apos;INSCRIRE</Text>
          </Pressable>

          {/* Footer link: J'ai déjà un compte. SE CONNECTER */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPromptText}>
              J&apos;ai déjà un compte.{' '}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
              onPress={handleLogin}
              hitSlop={10}
            >
              <Text style={styles.loginLinkText}>SE CONNECTER</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'flex-end',
  },
  bottomOverlay: {
    width: '100%',
    minHeight: Math.round(SCREEN_HEIGHT * 0.285),
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    paddingHorizontal: 28,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWhite: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 29,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  titleOrange: {
    color: '#EF682E',
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0.5,
    lineHeight: 29,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 18,
  },
  registerButton: {
    width: Math.min(Math.round(SCREEN_WIDTH * 0.485), 210),
    height: 34,
    borderRadius: 999,
    backgroundColor: '#EF682E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptText: {
    color: '#D4D4D4',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
    fontWeight: '400',
  },
  loginLinkText: {
    color: '#D85B2B',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
