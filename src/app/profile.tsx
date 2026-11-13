import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface MenuItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'vehicle',
    title: 'Mon véhicule',
    icon: require('../../assets/images/icons/menu-car-hd.png'),
  },
  {
    id: 'lines',
    title: 'Mes lignes',
    icon: require('../../assets/images/icons/menu-route-hd.png'),
  },
  {
    id: 'history',
    title: 'Mes historiques',
    icon: require('../../assets/images/icons/menu-history-hd.png'),
  },
  {
    id: 'benefits',
    title: 'Mes avantages',
    icon: require('../../assets/images/icons/menu-trophy-hd.png'),
  },
  {
    id: 'location',
    title: 'Ma localisation',
    icon: require('../../assets/images/icons/menu-pin-hd.png'),
  },
  {
    id: 'about',
    title: 'À propos de SIRA Chauffeur',
    icon: require('../../assets/images/icons/menu-info-hd.png'),
  },
  {
    id: 'logout',
    title: 'Se déconnecter',
    icon: require('../../assets/images/icons/menu-logout-hd.png'),
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const handleTakePhoto = async () => {
    setPhotoModalVisible(false);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission requise',
          "Veuillez autoriser l'accès à l'appareil photo pour prendre une photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert(
        'Erreur',
        "Impossible d'ouvrir l'appareil photo sur cet appareil."
      );
    }
  };

  const handlePickFromGallery = async () => {
    setPhotoModalVisible(false);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission requise',
          "Veuillez autoriser l'accès à votre galerie pour choisir une photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie de photos.");
    }
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.id === 'vehicle') {
      router.push('/vehicle');
      return;
    }

    if (item.id === 'lines') {
      router.push('/lines');
      return;
    }

    if (item.id === 'history') {
      router.push('/history');
      return;
    }

    if (item.id === 'benefits') {
      router.push('/benefits');
      return;
    }

    if (item.id === 'location') {
      router.push('/location');
      return;
    }

    if (item.id === 'logout') {
      Alert.alert(
        'Déconnexion',
        'Voulez-vous vraiment vous déconnecter de votre compte SIRA Chauffeur ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Se déconnecter',
            style: 'destructive',
            onPress: () => router.replace('/welcome'),
          },
        ]
      );
      return;
    }

    if (item.id === 'about') {
      Alert.alert(
        'À propos de SIRA Chauffeur',
        'SIRA Chauffeur v1.0.0\n\nApplication communautaire de suivi du trafic en temps réel et de récompenses pour les chauffeurs partenaires en Côte d’Ivoire.'
      );
      return;
    }

    Alert.alert(item.title, `Section "${item.title}" bientôt disponible.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Orange Header */}
      <View
        style={[
          styles.orangeHeader,
          { paddingTop: Math.max(insets.top + 8, 28) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={handleBack}
          hitSlop={12}
          style={({ pressed }) => [
            styles.headerBackButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/arrow-left-orange-hd.png')}
            style={styles.headerBackIcon}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={styles.headerTitle}>Mon compte</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Modifier mon compte"
          onPress={() => router.push('/edit-profile')}
          hitSlop={12}
          style={({ pressed }) => [
            styles.headerSettingsButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/settings-gear-hd.png')}
            style={styles.headerSettingsIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Driver Profile Summary Row */}
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Pressable
              onPress={() => setPhotoModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Modifier la photo de profil"
              style={({ pressed }) => [
                styles.avatarCircle,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : require('../../assets/images/chauffeur-avatar-clean.png')
                }
                style={styles.avatarImage}
                resizeMode="cover"
                accessibilityLabel="Photo de profil Diata"
              />
            </Pressable>

            <Pressable
              onPress={() => setPhotoModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Changer la photo"
              hitSlop={6}
              style={({ pressed }) => [
                styles.cameraBadge,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/camera-white-hd.png')}
                style={styles.cameraBadgeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Diata</Text>
            <Text style={styles.profilePhone}>+225 0703352619</Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ma ligne : Adjamé-Plateau"
              onPress={() => router.push('/lines')}
              style={({ pressed }) => [
                styles.lineSelectorPill,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.lineSelectorText}>
                Ma ligne : Adjamé-Plateau
              </Text>
              <View style={styles.lineChevronCircle}>
                <Text style={styles.lineChevronDown}>⌄</Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Modifier le profil"
            onPress={() => router.push('/edit-profile')}
            hitSlop={10}
            style={styles.smallChevronCircle}
          >
            <Text style={styles.smallChevronText}>›</Text>
          </Pressable>
        </View>

        {/* 7 Menu Items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => handleMenuPress(item)}
              style={({ pressed }) => [
                styles.menuCard,
                pressed && styles.menuCardPressed,
              ]}
            >
              <View style={styles.menuIconCircle}>
                <Image
                  source={item.icon}
                  style={styles.menuIconImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.menuTitle}>{item.title}</Text>

              <View style={styles.smallChevronCircle}>
                <Text style={styles.smallChevronText}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bottom Congratulations Points Banner */}
        <View style={styles.pointsBannerWrapper}>
          <View style={styles.pointsBannerCard}>
            <Text style={styles.pointsBannerText}>
              <Text style={styles.boldText}>Félicitations</Text> Diata, vous
              {'\n'}avez accumulé{' '}
              <Text style={styles.boldText}>500 points.</Text>
            </Text>
          </View>

          <Image
            source={require('../../assets/images/sharing-characters-hd.png')}
            style={styles.pointsCharactersImage}
            resizeMode="contain"
            accessibilityLabel="Personnages SIRA"
          />
        </View>
      </ScrollView>

      {/* Crisp 100% Native Bottom Navigation Bar (Profile Tab Active) */}
      <View style={styles.navbarOuter}>
        <View style={styles.navbarBar}>
          {/* Tab 1: Home (Inactive) */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Accueil"
            onPress={() => router.replace('/home')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-home-gray-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 2: Traffic / Cars */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Trafic et courses"
            onPress={() => router.push('/traffic')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-cars-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 3: Rewards / Trophy */}
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Récompenses"
            onPress={() => router.push('/benefits')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-trophy-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>

          {/* Tab 4: Profile (Active with Raised White Notch & Orange Circle) */}
          <View style={styles.tabSlot}>
            <View style={styles.activeNotchOuter}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel="Mon compte"
                accessibilityState={{ selected: true }}
                style={styles.activeOrangeCircle}
              >
                <Image
                  source={require('../../assets/images/icons/nav-user-white-hd.png')}
                  style={styles.activeTabIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>

        {insets.bottom > 0 && (
          <View style={{ height: insets.bottom, backgroundColor: '#333333' }} />
        )}
      </View>

      {/* Photo Picker Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPhotoModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Photo de profil</Text>
            <Text style={styles.modalSubtitle}>
              Sélectionnez une option pour votre photo de chauffeur
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Prendre une photo"
              onPress={handleTakePhoto}
              style={({ pressed }) => [
                styles.modalOptionButton,
                styles.modalOptionPrimary,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/camera-white-hd.png')}
                style={styles.modalOptionIcon}
                resizeMode="contain"
              />
              <Text style={styles.modalOptionPrimaryText}>
                Prendre une photo
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choisir une photo"
              onPress={handlePickFromGallery}
              style={({ pressed }) => [
                styles.modalOptionButton,
                styles.modalOptionSecondary,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.modalOptionSecondaryText}>
                Choisir une photo
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              onPress={() => setPhotoModalVisible(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orangeHeader: {
    backgroundColor: '#EF6622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerBackButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackIcon: {
    width: 15,
    height: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18.5,
    fontWeight: '600',
  },
  headerSettingsButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSettingsIcon: {
    width: 24,
    height: 24,
  },
  pressed: {
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    position: 'relative',
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.8,
    borderColor: '#EF6622',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  cameraBadgeIcon: {
    width: 14,
    height: 14,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  profileName: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 19.5,
    fontWeight: '700',
    lineHeight: 24,
  },
  profilePhone: {
    color: '#222222',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 6,
  },
  lineSelectorPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6A29',
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  lineSelectorText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 11,
    fontWeight: '500',
    marginRight: 6,
  },
  lineChevronCircle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineChevronDown: {
    color: '#EF6622',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 11,
    marginTop: -2,
  },
  smallChevronCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallChevronText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
    marginTop: -1,
  },
  menuList: {
    width: '100%',
    marginBottom: 18,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  menuCardPressed: {
    backgroundColor: '#FFF3EC',
    borderColor: '#EF6622',
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconImage: {
    width: 19,
    height: 19,
  },
  menuTitle: {
    flex: 1,
    color: '#000000',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    fontWeight: '500',
  },
  pointsBannerWrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 10,
    marginTop: 'auto',
  },
  pointsBannerCard: {
    width: '100%',
    backgroundColor: '#FFEACD',
    borderRadius: 16,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 130,
    justifyContent: 'center',
    minHeight: 74,
  },
  pointsBannerText: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    lineHeight: 19,
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  pointsCharactersImage: {
    position: 'absolute',
    right: 4,
    bottom: 0,
    width: 128,
    height: 88,
  },
  navbarOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  navbarBar: {
    width: '100%',
    height: 56,
    backgroundColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNotchOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  activeOrangeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIcon: {
    width: 24,
    height: 24,
  },
  navIcon: {
    width: 26,
    height: 26,
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCE1E7',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOptionButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalOptionPrimary: {
    backgroundColor: '#EE6723',
  },
  modalOptionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  modalOptionPrimaryText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOptionSecondary: {
    backgroundColor: '#FFF3EC',
    borderWidth: 1.5,
    borderColor: '#EE6723',
  },
  modalOptionSecondaryText: {
    color: '#EE6723',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalCancelText: {
    color: '#7C8594',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
});
