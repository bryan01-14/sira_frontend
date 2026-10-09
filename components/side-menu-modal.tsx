import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LogoutModal } from './logout-modal';

const { width, height } = Dimensions.get('window');

interface SideMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SideMenuModal({ visible, onClose }: SideMenuModalProps) {
  const router = useRouter();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Découvre SIRA, l’application de mobilité intelligente ! Calcule tes trajets sans stress à Abidjan : https://sira-app.ci',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleNavigateProfile = () => {
    onClose();
    router.push('/profile');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlayContainer}>
        {/* Backdrop Touchable (Fills Remaining Screen on LEFT) */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Side Drawer Content (Anchored on the RIGHT) */}
        <View style={styles.drawerContent}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header Road Graphics Banner */}
            <View style={styles.headerBanner}>
              <TouchableOpacity
                style={styles.closeButtonCircle}
                onPress={onClose}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Road Diagonal Stripe Graphic & Slogan */}
              <View style={styles.roadDecorWrapper} pointerEvents="none">
                <Image
                  source={require('@/assets/images/road-stripe.png')}
                  style={styles.roadStripeImage}
                  contentFit="fill"
                />
                <View style={styles.sloganContainer}>
                  <Text style={styles.sloganWhite}>ON TRACE, </Text>
                  <Text style={styles.sloganOrange}>SANS STRESS.</Text>
                  <Image
                    source={require('@/assets/images/orange-pin-icon.png')}
                    style={styles.locationPinDecor}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* User Profile Preview Row */}
              <TouchableOpacity
                style={styles.profileRow}
                onPress={handleNavigateProfile}
                activeOpacity={0.8}
              >
                <View style={styles.avatarRing}>
                  <Image
                    source={require('@/assets/images/sira-character-assistant.png')}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                </View>

                <View style={styles.profileTextInfo}>
                  <Text style={styles.userName}>Diata</Text>
                  <Text style={styles.userPhone}>+225 0703352619</Text>
                </View>

                <View style={styles.smallChevronCircle}>
                  <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Section 1: Historique */}
              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={() => {
                  onClose();
                  router.push('/history');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="time" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>Historique</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Section 2: Trafic & Signaler */}
              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={() => {
                  onClose();
                  router.push('/traffic');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="car" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>Trafic</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={() => {
                  onClose();
                  router.push('/report-event');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="warning" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>Signaler un évènement</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Section 3: Paramètres, À propos, Se déconnecter */}
              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={() => {
                  onClose();
                  router.push('/settings');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="settings" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>Paramètres</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={() => {
                  onClose();
                  router.push('/info-settings');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="information-circle" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>À propos de SIRA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItemRow}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircleBadge}>
                  <Ionicons name="log-out" size={18} color="#F26522" />
                </View>
                <Text style={styles.menuItemText}>Se déconnecter</Text>
              </TouchableOpacity>

              {/* Bottom "Partager SIRA" Card Banner */}
              <View style={styles.promoCardContainer}>
                <View style={styles.promoCardContent}>
                  <Text style={styles.promoTitle}>Partager SIRA</Text>
                  <Text style={styles.promoSub}>à mes amis !</Text>

                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShareApp}
                    activeOpacity={0.85}
                  >
                    <View style={styles.shareIconCircle}>
                      <Ionicons name="share-social" size={13} color="#F26522" />
                    </View>
                    <Text style={styles.shareButtonText}>Partager SIRA</Text>
                  </TouchableOpacity>
                </View>

                {/* Right Illustration */}
                <Image
                  source={require('@/assets/images/share-sira-friends.png')}
                  style={styles.promoIllustration}
                  contentFit="contain"
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          onClose();
          router.replace('/login');
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    height: '100%',
  },
  drawerContent: {
    width: Math.min(300, width * 0.73),
    height: '100%',
    backgroundColor: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  safeArea: {
    flex: 1,
  },
  headerBanner: {
    height: 90,
    paddingHorizontal: 12,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  closeButtonCircle: {
    position: 'absolute',
    left: 12,
    top: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 25,
  },
  roadDecorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  roadStripeImage: {
    position: 'absolute',
    top: -2,
    left: 15,
    width: 300,
    height: 85,
    opacity: 0.95,
  },
  sloganContainer: {
    position: 'absolute',
    top: 10,
    left: 52,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ rotate: '-11deg' }],
    zIndex: 10,
  },
  sloganWhite: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    fontFamily: 'Montserrat-Bold',
  },
  sloganOrange: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F26522',
    letterSpacing: 0.3,
    fontFamily: 'Montserrat-Bold',
  },
  locationPinDecor: {
    width: 20,
    height: 24,
    marginLeft: 4,
    transform: [{ rotate: '14deg' }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginRight: 10,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  profileTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },
  userPhone: {
    fontSize: 12.5,
    color: '#A0A0A0',
    fontFamily: 'Montserrat-Regular',
  },
  smallChevronCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
    marginVertical: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircleBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  promoCardContainer: {
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 115,
  },
  promoCardContent: {
    flex: 1,
    paddingRight: 60,
    zIndex: 2,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  promoSub: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F26522',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  shareIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  promoIllustration: {
    width: 135,
    height: 95,
    position: 'absolute',
    right: -4,
    bottom: 0,
    zIndex: 1,
  },
});


