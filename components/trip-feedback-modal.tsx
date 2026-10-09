import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TripFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  onSubmitRating?: (rating: number) => void;
}

export function TripFeedbackModal({
  visible,
  onClose,
  userName = 'Diata',
  onSubmitRating,
}: TripFeedbackModalProps) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);

  const handleStarPress = (selectedStar: number) => {
    setRating(selectedStar);
    if (onSubmitRating) {
      onSubmitRating(selectedStar);
    }
    Alert.alert(
      'Merci !',
      `Merci pour votre évaluation de ${selectedStar} étoile${selectedStar > 1 ? 's' : ''}. Votre avis nous aide à améliorer SIRA.`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Full Screen 3D City Background */}
        <Image
          source={require('@/assets/images/city-route-3d-bg.png')}
          style={styles.backgroundImage}
          contentFit="cover"
        />

        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Top Center Drag Handle Pill */}
          <View style={styles.topDragPill} />

          {/* Top Left Close (X) Button */}
          <TouchableOpacity
            style={[styles.closeBtn, { top: Math.max(insets.top, 16) }]}
            onPress={onClose}
            activeOpacity={0.8}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Center Content: Mascot + Speech Bubble */}
          <View style={styles.contentArea}>
            {/* Speech Bubble (Floating Top Right of Mascot) */}
            <View style={styles.speechBubbleWrapper}>
              <View style={styles.speechBubbleCard}>
                <Text style={styles.speechBubbleText}>
                  Comment{'\n'}s'est passé{'\n'}votre trajet{' '}
                  <Text style={styles.boldText}>{userName}</Text> ?
                </Text>
              </View>
              <View style={styles.speechBubblePointer} />
            </View>

            {/* 3D Mascot Character */}
            <Image
              source={require('@/assets/images/sira-character-assistant.png')}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>

          {/* Bottom Rating Section */}
          <View style={[styles.bottomRatingContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <Text style={styles.ratingSubtitle}>
              <Text style={styles.boldText}>Votre avis</Text> nous aide{'\n'}à{' '}
              <Text style={styles.boldText}>améliorer SIRA.</Text>
            </Text>

            {/* 5 Interactive Black Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  activeOpacity={0.7}
                  style={styles.starTouchArea}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color="#000000"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topDragPill: {
    width: 54,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#000000',
    alignSelf: 'center',
    marginTop: 8,
  },
  closeBtn: {
    position: 'absolute',
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  contentArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  speechBubbleWrapper: {
    position: 'absolute',
    top: '12%',
    right: '8%',
    zIndex: 20,
  },
  speechBubbleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxWidth: SCREEN_WIDTH * 0.58,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  speechBubbleText: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    lineHeight: 26,
  },
  boldText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '800',
    color: '#000000',
  },
  speechBubblePointer: {
    position: 'absolute',
    left: 20,
    bottom: -8,
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    transform: [{ rotate: '45deg' }],
  },
  mascotImage: {
    width: Math.min(SCREEN_WIDTH * 0.75, 310),
    height: Math.min(SCREEN_HEIGHT * 0.55, 420),
    marginBottom: -10,
  },
  bottomRatingContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 30,
  },
  ratingSubtitle: {
    fontSize: 21,
    fontFamily: 'Montserrat-Regular',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starTouchArea: {
    padding: 4,
  },
});
