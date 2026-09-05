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

/* Geometry measured on the designer mockup (slide canvas 123 x 265) */
const CARD_TOP = height * 0.721;

const PHONE_WIDTH = width * 0.5675;
const PHONE_HEIGHT = (PHONE_WIDTH * 1024) / 501;
const PHONE_TOP = height * 0.208;
const PHONE_RIGHT = -PHONE_WIDTH * 0.34;
const PHONE_ROTATION = '10.4deg';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  /* Brand word rendered in orange right before the description */
  descriptionPrefix?: string;
  heroBgImage: any;
  /* Horizontal framing of the photo, as in the mockup */
  heroBgPosition: string;
  phoneMockupImage?: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'LA PREMIÈRE PLATEFORME\nDE MOBILITÉ INTELLIGENTE',
    description: 'pensée pour simplifier vos déplacements\nà abidjan.',
    heroBgImage: require('@/assets/images/bridge-bg.png'),
    heroBgPosition: '58%',
    phoneMockupImage: require('@/assets/images/sira-app-mockup.png'),
  },
  {
    id: '2',
    title: "TROUVEZ L'ITINÉRAIRE\nQUI VOUS CONVIENT",
    descriptionPrefix: 'Sira',
    description:
      ' analyse les conditions de circulation\npour vous proposer des itinéraires\nadaptés à votre situation.',
    heroBgImage: require('@/assets/images/slide2-bg.jpg'),
    heroBgPosition: '50%',
  },
  {
    id: '3',
    title: 'CHOISISSEZ VOTRE FAÇON\nDE VOUS DÉPLACER',
    description:
      'comparez les différentes options de transport\ndisponibles pour choisir celle qui correspond\nle mieux à votre trajet.',
    heroBgImage: require('@/assets/images/slide3-bg.jpg'),
    heroBgPosition: '50%',
  },
  {
    id: '4',
    title: 'ANTICIPEZ VOTRE TRAJET',
    description:
      'estimez le temps et le coût de\nvotre déplacement avant de prendre la route.',
    heroBgImage: require('@/assets/images/slide4-bg.jpg'),
    heroBgPosition: '66%',
  },
  {
    id: '5',
    title: 'RESTEZ INFORMÉ\nEN TEMPS RÉEL',
    description:
      'recevez des informations sur les perturbations,\nles incidents et les conditions de circulation\nsur votre trajet.',
    heroBgImage: require('@/assets/images/slide5-bg.jpg'),
    heroBgPosition: '50%',
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

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    return (
      <View style={styles.slide}>
        {/* Layer 1: Full bleed photo, framed as in the mockup */}
        <Image
          source={item.heroBgImage}
          style={styles.heroBgImage}
          contentFit="cover"
          contentPosition={{ left: item.heroBgPosition }}
          transition={0}
        />

        {/* Layer 2: Dark scrim covering the bottom third, the photo stays visible through it */}
        <View style={styles.bottomScrim} />

        {/* Layer 3: iPhone mockup, tilted and cropped by the right edge, overlapping the scrim */}
        {item.phoneMockupImage ? (
          <View style={styles.phoneMockupContainer}>
            <Image
              source={item.phoneMockupImage}
              style={styles.phoneMockupImage}
              contentFit="contain"
            />
          </View>
        ) : null}

        {/* Layer 4: Slide copy */}
        <View style={styles.cardContent}>
          {/* Progress: the orange bar sits at the active slide position */}
          <View style={styles.progressRow}>
            {SLIDES.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.progressPill,
                  dotIndex === index ? styles.progressPillActive : styles.progressPillInactive,
                ]}
              />
            ))}
          </View>

          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descriptionText}>
            {item.descriptionPrefix ? (
              <Text style={styles.descriptionBrand}>{item.descriptionPrefix}</Text>
            ) : null}
            {item.description}
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleGoToSignup}
              activeOpacity={0.85}
            >
              <Text style={styles.registerButtonText}>S&apos;INSCRIRE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleGoToLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginPrefixText} numberOfLines={1}>
                J&apos;ai déjà un compte.{' '}
                <Text style={styles.loginOrangeText}>SE CONNECTER</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

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

      {/* Circular back arrow floating above the carousel */}
      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  },
  slide: {
    width: width,
    height: height,
    position: 'relative',
    backgroundColor: '#000000',
  },

  /* Layer 1: full bleed photo */
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /* Layer 2: bottom scrim */
  bottomScrim: {
    position: 'absolute',
    top: CARD_TOP,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.86)',
  },

  /* Layer 3: tilted iPhone mockup */
  phoneMockupContainer: {
    position: 'absolute',
    right: PHONE_RIGHT,
    top: PHONE_TOP,
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    transform: [{ rotate: PHONE_ROTATION }],
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

  /* Layer 4: slide copy */
  cardContent: {
    position: 'absolute',
    top: CARD_TOP,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 22,
  },

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

  titleText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.4,
    lineHeight: 27,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  descriptionText: {
    color: '#C5C5C5',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    marginBottom: 18,
  },
  descriptionBrand: {
    color: '#F5701E',
    fontWeight: '700',
  },
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
