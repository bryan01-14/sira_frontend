import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);
  const glowOpacity = useSharedValue(0);

  const navigateToHome = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // 1. Logo entry animation
    logoOpacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 100 });
    
    // 2. Glow effect behind the orange pin
    glowOpacity.value = withDelay(
      400,
      withSequence(
        withTiming(0.6, { duration: 600 }),
        withTiming(0.25, { duration: 600 })
      )
    );

    // 3. Auto transition to main app after 2.4 seconds
    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) {
          runOnJS(navigateToHome)();
        }
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background subtle orange glow */}
      <Animated.View style={[styles.glowEffect, animatedGlowStyle]} />

      {/* Pure centered Sira logo (Matching Designer Mockup Exactly) */}
      <View style={styles.logoContainer}>
        <Animated.View style={animatedLogoStyle}>
          <Image
            source={require('@/assets/images/sira-logo-transparent.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F26522',
    opacity: 0.1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
});
