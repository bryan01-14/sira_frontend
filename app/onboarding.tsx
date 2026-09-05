import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  heroBgImage: any;
  phoneMockupImage?: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'LA PREMIÈRE PLATEFORME\nDE MOBILITÉ INTELLIGENTE',
    description: 'pensée pour simplifier vos déplacements\nà abidjan.',
    heroBgImage: require('@/assets/images/bridge-bg.jpg'),
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
  },
  {
    id: '2',
    title: "TROUVEZ L'ITINÉRAIRE\nQUI VOUS CONVIENT",
    description: 'Sira analyse les conditions de circulation\npour vous proposer des itinéraires\nadaptés à votre situation.',
    heroBgImage: require('@/assets/images/slide2-bg.jpg'),
  },
  {
    id: '3',
    title: 'CHOISISSEZ VOTRE FAÇON\nDE VOUS DÉPLACER',
    description: 'comparez les différentes options de transport\ndisponibles pour choisir celle qui correspond\nle mieux à votre trajet.',
    heroBgImage: require('@/assets/images/slide3-bg.jpg'),
  },
  {
    id: '4',
    title: 'ANTICIPEZ VOTRE TRAJET',
    description: 'estimez le temps et le coût de\nvotre déplacement avant de prendre la route.',
    heroBgImage: require('@/assets/images/slide4-bg.jpg'),
  },
  {
    id: '5',
    title: 'RESTEZ INFORMÉ\nEN TEMPS RÉEL',
    description: 'recevez des informations sur les perturbations,\nles incidents et les conditions de circulation\nsur votre trajet.',
    heroBgImage: require('@/assets/images/slide5-bg.jpg'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleBack = () => {
    router.replace('/');
  };

  const handleGoToSignup = () => {
    router.push('/signup');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        {/* Layer 1: Background Image */}
        <Image
          source={item.heroBgImage}
          style={styles.heroBgImage}
          contentFit="cover"
          contentPosition={item.phoneMockupImage ? { top: '0%', left: '46%' } : 'center'}
        />
        <View style={styles.heroOverlayGradient} />

        {/* Layer 2: Black bottom card backdrop */}
        <View style={styles.slideBottomBackdrop} />

        {/* Layer 3: Phone Mockup on Slide 1 - Rendered in FRONT of the black background */}
        {item.phoneMockupImage && (
          <View style={styles.phoneMockupContainer}>
            <Image
              source={item.phoneMockupImage}
              style={styles.phoneMockupImage}
              contentFit="contain"
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Layer 4: Top Left Circular Back Arrow Button (←) */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Horizontal Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.flatList}
      />

      {/* Layer 5: Bottom Sheet UI Content */}
      <View style={styles.bottomCardContent} pointerEvents="box-none">
        {/* Progress Bar (Orange Bar + 4 White Dots) */}
        <View style={styles.progressRow}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.progressPill,
                  isActive ? styles.progressPillActive : styles.progressPillInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Headline Title */}
        <Text style={styles.titleText}>
          {SLIDES[currentIndex].title}
        </Text>

        {/* Subtitle Description */}
        <Text style={styles.descriptionText}>
          {SLIDES[currentIndex].description}
        </Text>

        {/* Actions Row: S'INSCRIRE & J'ai déjà un compte. SE CONNECTER */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleGoToSignup}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>S'INSCRIRE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoToLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.loginPrefixText} numberOfLines={1}>
              J'ai déjà un compte.{' '}
              <Text style={styles.loginOrangeText}>SE CONNECTER</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 18,
    zIndex: 50,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  flatList: {
    flex: 1,
    zIndex: 10,
  },
  slide: {
    width: width,
    height: height,
    position: 'relative',
    overflow: 'hidden',
  },

  /* Layer 1: Background Image */
  heroBgImage: {
    width: '100%',
    height: height * 0.72,
  },
  heroOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.72,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },

  /* Layer 2: Slide Bottom Black Backdrop */
  slideBottomBackdrop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.32,
    backgroundColor: '#000000',
    zIndex: 5,
  },

  /* Layer 3: Phone Mockup in FRONT of black backdrop */
  phoneMockupContainer: {
    position: 'absolute',
    right: -width * 0.17,
    top: height * 0.13,
    width: width * 0.74,
    height: height * 0.64,
    transform: [{ rotate: '13.5deg' }],
    zIndex: 15,
    shadowColor: '#000000',
    shadowOffset: { width: -6, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  phoneMockupImage: {
    width: '100%',
    height: '100%',
  },

  /* Layer 4: Bottom Sheet UI Content */
  bottomCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 38,
    zIndex: 30,
  },

  /* Indicators: Long Orange Pill + Round White Dots */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  progressPill: {
    height: 5,
    borderRadius: 2.5,
  },
  progressPillActive: {
    width: 44,
    backgroundColor: '#F26522',
  },
  progressPillInactive: {
    width: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
  },

  /* Title: Heavy Uppercase Font */
  titleText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
    lineHeight: 27,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  /* Subtitle */
  descriptionText: {
    color: '#C5C5C5',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 22,
  },

  /* Actions Row */
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registerButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  loginButton: {
    paddingVertical: 6,
    flex: 1,
    justifyContent: 'center',
  },
  loginPrefixText: {
    color: '#A8A8A8',
    fontSize: 11,
    fontWeight: '500',
  },
  loginOrangeText: {
    color: '#F26522',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
