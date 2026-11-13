import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.52), 215);
const LOGO_HEIGHT = Math.round(LOGO_WIDTH * (185 / 180));
const useNative = Platform.OS !== 'web';

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.45)).current;
  const logoTranslateY = useRef(new Animated.Value(32)).current;
  const logoRotate = useRef(new Animated.Value(-1)).current;
  const logoBreath = useRef(new Animated.Value(1)).current;

  const navigatedRef = useRef(false);

  const navigateToNext = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    router.replace('/welcome');
  };

  useEffect(() => {
    // 1. Dynamic elastic entrance (rise + bounce + straighten)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNative,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 55,
        friction: 5,
        useNativeDriver: useNative,
      }),
      Animated.spring(logoTranslateY, {
        toValue: 0,
        tension: 50,
        friction: 6,
        useNativeDriver: useNative,
      }),
      Animated.spring(logoRotate, {
        toValue: 0,
        tension: 45,
        friction: 6,
        useNativeDriver: useNative,
      }),
    ]).start(() => {
      // 2. Smooth breathing pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoBreath, {
            toValue: 1.06,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
          Animated.timing(logoBreath, {
            toValue: 1,
            duration: 750,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: useNative,
          }),
        ])
      ).start();
    });

    // 3. Smooth exit animation then navigate to register
    const exitTimer = setTimeout(() => {
      if (navigatedRef.current) return;
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: useNative,
        }),
        Animated.timing(logoScale, {
          toValue: 1.18,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: useNative,
        }),
      ]).start(() => {
        navigateToNext();
      });
    }, 2600);

    return () => clearTimeout(exitTimer);
  }, [logoBreath, logoOpacity, logoRotate, logoScale, logoTranslateY]);

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-6deg', '0deg'],
  });

  return (
    <Pressable
      style={styles.container}
      onPress={navigateToNext}
      accessibilityRole="button"
      accessibilityLabel="Passer vers la page d'accueil"
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              { translateY: logoTranslateY },
              { rotate: rotateInterpolate },
              { scale: logoScale },
              { scale: logoBreath },
            ],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/sira-logo-dark.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="Logo Sira Chauffeur"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
