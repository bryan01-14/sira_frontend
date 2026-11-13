import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function VehicleScreen() {
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const [vehicleType, setVehicleType] = useState('Taxi');
  const [vehicleBrand, setVehicleBrand] = useState('Toyota');
  const [licensePlate, setLicensePlate] = useState('');
  const [otherInfo1, setOtherInfo1] = useState('');
  const [otherInfo2, setOtherInfo2] = useState('');
  const [otherInfo3, setOtherInfo3] = useState('');
  const [otherInfo4, setOtherInfo4] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
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

  const handleSave = () => {
    if (!vehicleType.trim() || !vehicleBrand.trim()) {
      Alert.alert(
        'Champ requis',
        'Veuillez renseigner le type et la marque du véhicule.'
      );
      return;
    }

    Alert.alert(
      'Véhicule enregistré',
      'Les informations de votre véhicule ont été mises à jour avec succès.',
      [
        {
          text: 'OK',
          onPress: () => handleBack(),
        },
      ]
    );
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

        <Text style={styles.headerTitle}>Mon véhicule</Text>

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

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
                onPress={() =>
                  Alert.alert('Ma ligne', 'Ligne actuelle : Adjamé-Plateau')
                }
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

          {/* Rounded Gray Vehicle Form Card with Overlapping Car Illustration */}
          <View style={styles.cardWrapper}>
            <View style={styles.vehicleCard}>
              {/* 1. Type véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'vehicleType' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Type véhicule</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={vehicleType}
                  onChangeText={setVehicleType}
                  onFocus={() => setFocusedField('vehicleType')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="next"
                />
              </View>

              {/* 2. Marque du véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'vehicleBrand' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Marque du véhicule</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={vehicleBrand}
                  onChangeText={setVehicleBrand}
                  onFocus={() => setFocusedField('vehicleBrand')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="next"
                />
              </View>

              {/* 3. Immatriculation du véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'licensePlate' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>
                  Immatriculation du véhicule
                </Text>
                <TextInput
                  style={styles.fieldInput}
                  value={licensePlate}
                  onChangeText={setLicensePlate}
                  onFocus={() => setFocusedField('licensePlate')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  autoCapitalize="characters"
                  returnKeyType="next"
                />
              </View>

              {/* 4. Autres infos du véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'otherInfo1' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Autres infos du véhicule</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={otherInfo1}
                  onChangeText={setOtherInfo1}
                  onFocus={() => setFocusedField('otherInfo1')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="next"
                />
              </View>

              {/* 5. Autres infos du véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'otherInfo2' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Autres infos du véhicule</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={otherInfo2}
                  onChangeText={setOtherInfo2}
                  onFocus={() => setFocusedField('otherInfo2')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="next"
                />
              </View>

              {/* 6. Autres infos du véhicule */}
              <View
                style={[
                  styles.fieldGroup,
                  focusedField === 'otherInfo3' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Autres infos du véhicule</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={otherInfo3}
                  onChangeText={setOtherInfo3}
                  onFocus={() => setFocusedField('otherInfo3')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="next"
                />
              </View>

              {/* 7. Autres infos du véhicule (bottom line with car on right) */}
              <View
                style={[
                  styles.fieldGroup,
                  styles.lastFieldGroup,
                  focusedField === 'otherInfo4' && styles.fieldGroupFocused,
                ]}
              >
                <Text style={styles.fieldLabel}>Autres infos du véhicule</Text>
                <TextInput
                  style={[styles.fieldInput, styles.shortFieldInput]}
                  value={otherInfo4}
                  onChangeText={setOtherInfo4}
                  onFocus={() => setFocusedField('otherInfo4')}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#EE6723"
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
              </View>
            </View>

            {/* Overlapping HD Silver Car Illustration at Bottom-Right */}
            <Image
              source={require('../../assets/images/vehicle-car-hd.png')}
              style={styles.carIllustration}
              resizeMode="contain"
              pointerEvents="none"
              accessibilityLabel="Illustration du véhicule"
            />
          </View>

          {/* Bottom Orange Pill Button: ENREGISTRER */}
          <View style={styles.buttonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enregistrer"
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>ENREGISTRER</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Dark Navigation Bar */}
      <View style={styles.navbarOuter}>
        <View style={styles.navbarBar}>
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

          <Pressable
            accessibilityRole="tab"
            accessibilityLabel="Mon compte"
            onPress={() => router.replace('/profile')}
            style={({ pressed }) => [
              styles.tabSlot,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={require('../../assets/images/icons/nav-user-hd.png')}
              style={styles.navIcon}
              resizeMode="contain"
            />
          </Pressable>
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
                pressed && styles.saveButtonPressed,
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
                pressed && styles.saveButtonPressed,
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 14,
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
  cardWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  vehicleCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
  },
  fieldGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCE1E7',
    marginBottom: 14,
    paddingBottom: 4,
  },
  lastFieldGroup: {
    marginBottom: 4,
  },
  fieldGroupFocused: {
    borderBottomColor: '#EE6723',
  },
  fieldLabel: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    fontWeight: '400',
    marginBottom: 2,
  },
  fieldInput: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16.5,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  shortFieldInput: {
    paddingRight: 165,
  },
  carIllustration: {
    position: 'absolute',
    right: -6,
    bottom: -10,
    width: 195,
    height: 125,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 4,
  },
  saveButton: {
    minWidth: 175,
    height: 32,
    paddingHorizontal: 26,
    borderRadius: 999,
    backgroundColor: '#EE6723',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
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
