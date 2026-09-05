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

/* Geometry measured on the designer mockup (canvas 253 x 326 for the hero area) */
const HERO_HEIGHT = height * 0.7;

const BG_WIDTH = width * 3.356;
const BG_HEIGHT = (BG_WIDTH * 664) / 1024;
const BG_LEFT = -width * 1.36;
const BG_TOP = HERO_HEIGHT / 2 - width * 0.9328;

const PHONE_HEIGHT = HERO_HEIGHT * 0.905;
const PHONE_WIDTH = (PHONE_HEIGHT * 501) / 1024;
const PHONE_TOP = HERO_HEIGHT * 0.139;
const PHONE_RIGHT = -PHONE_WIDTH * 0.344;
const PHONE_ROTATION = '11.3deg';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  heroBgImage: any;
  phoneMockupImage: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'LA PREMIÈRE PLATEFORME\nDE MOBILITÉ INTELLIGENTE',
    description: 'pensée pour simplifier vos déplacements\nà abidjan.',
    heroBgImage: require('@/assets/images/bridge-bg.png'),
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
  },
  {
    id: '2',
    title: 'CALCULEZ VOS ITINÉRAIRES\nEN TEMPS RÉEL',
    description: 'trouvez le meilleur moyen de transport\nrapidement et sereinement.',
    heroBgImage: require('@/assets/images/bridge-bg.png'),
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
  },
  {
    id: '3',
    title: 'SUIVEZ VOS TRANSPORTS\nET TRAJETS EN DIRECT',
    description: 'gagnez un temps précieux sur tous\nvos trajets quotidiens.',
    heroBgImage: require('@/assets/images/bridge-bg.png'),
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
  },
  {
    id: '4',
    title: 'VOS DESTINATIONS ET FAVORIS\nEN UN CLIC',
    description: 'enregistrez vos lieux fréquents pour\ny accéder instantanément.',
    heroBgImage: require('@/assets/images/bridge-bg.png'),
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
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

  const handleNavigate = () => {
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={styles.slide}>
        {/* Layer 1: Background Bridge Image framed on the pylon & highway, as in the mockup */}
        <View style={styles.heroBgClip}>
          <Image source={item.heroBgImage} style={styles.heroBgImage} contentFit="fill" />
        </View>
        <View style={styles.heroOverlayGradient} />

        {/* Layer 2: iPhone Mockup matching the designer tilt and right position */}
        <View style={styles.phoneMockupContainer}>
          <Image
            source={item.phoneMockupImage}
            style={styles.phoneMockupImage}
            contentFit="contain"
          />
        </View>
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
          onPress={handleNavigate}
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

      {/* Layer 3: Bottom Sheet Dark Card (Positioned at 33% height, matching Designer mockup) */}
      <View style={styles.bottomCard}>
        {/* Progress Bar (Orange Bar + 3 White Dots) */}
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

        {/* Actions Row: S'INSCRIRE & J'ai déjà un compte. SE CONNECTER on ONE SINGLE LINE */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleNavigate}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>S'INSCRIRE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleNavigate}
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
  },

  /* Layer 1: Background Bridge Image */
  heroBgClip: {
    width: '100%',
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroBgImage: {
    position: 'absolute',
    left: BG_LEFT,
    top: BG_TOP,
    width: BG_WIDTH,
    height: BG_HEIGHT,
  },
  heroOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },

  /* Layer 2: Phone Mockup tilted & positioned exactly as the designer reference */
  phoneMockupContainer: {
    position: 'absolute',
    right: PHONE_RIGHT,
    top: PHONE_TOP,
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    transform: [{ rotate: PHONE_ROTATION }],
    zIndex: 12,
  },
  phoneMockupImage: {
    width: '100%',
    height: '100%',
  },

  /* Layer 3: Bottom Sheet Dark Card starting at bottom 33% height */
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
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
    height: 6,
    borderRadius: 3,
  },
  progressPillActive: {
    width: 48,
    backgroundColor: '#F26522',
  },
  progressPillInactive: {
    width: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
  },

  /* Title: Heavy Uppercase Font on 2 lines */
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

  /* Actions Row: Fits S'INSCRIRE & J'ai déjà un compte. SE CONNECTER on ONE SINGLE LINE */
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registerButton: {
    backgroundColor: '#F26522',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 18,
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
    color: '#C5C5C5',
    fontSize: 10.5,
    fontWeight: '500',
  },
  loginOrangeText: {
    color: '#F26522',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
