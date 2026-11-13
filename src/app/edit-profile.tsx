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

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const [lastName, setLastName] = useState('Ouattara');
  const [firstName, setFirstName] = useState('Diata');
  const [phone, setPhone] = useState('+225 0703352619');
  const [address, setAddress] = useState('Abobo samaké');
  const [line, setLine] = useState('Adjamé-Plateau');
  const [vehicleType, setVehicleType] = useState('Taxi');
  const [vehicleBrand, setVehicleBrand] = useState('');
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
    if (!lastName.trim() || !firstName.trim()) {
      Alert.alert('Champ requis', 'Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Champ requis', 'Veuillez renseigner votre numéro.');
      return;
    }

    Alert.alert(
      'Modifications enregistrées',
      'Vos informations de profil ont été mises à jour avec succès.',
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

        <Text style={styles.headerTitle}>Modifier mon compte</Text>
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
          {/* Centered Avatar with Camera Badge */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Pressable
                onPress={() => setPhotoModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Photo de profil"
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
                accessibilityLabel="Prendre ou choisir une photo"
                hitSlop={8}
                style={({ pressed }) => [
                  styles.cameraBadge,
                  pressed && styles.cameraBadgePressed,
                ]}
              >
                <Image
                  source={require('../../assets/images/icons/camera-white-hd.png')}
                  style={styles.cameraIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>

          {/* Underlined Form Fields */}
          <View style={styles.formContainer}>
            {/* Nom */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'lastName' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Nom</Text>
              <TextInput
                style={styles.fieldInput}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Prenom */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'firstName' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Prenom</Text>
              <TextInput
                style={styles.fieldInput}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Numero */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'phone' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Numero</Text>
              <TextInput
                style={styles.fieldInput}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            {/* Adresse */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'address' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Adresse</Text>
              <TextInput
                style={styles.fieldInput}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                returnKeyType="next"
              />
            </View>

            {/* Ligne */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'line' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Ligne</Text>
              <TextInput
                style={styles.fieldInput}
                value={line}
                onChangeText={setLine}
                onFocus={() => setFocusedField('line')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                returnKeyType="next"
              />
            </View>

            {/* Type du véhicule */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'vehicleType' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>Type du véhicule</Text>
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

            {/* Marque du véhicule */}
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
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>
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
    marginRight: 18,
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
  pressed: {
    opacity: 0.8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 134,
    height: 134,
    position: 'relative',
  },
  avatarCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: '#EE6723',
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
    right: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EE6723',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cameraBadgePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },
  cameraIcon: {
    width: 20,
    height: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 18,
  },
  fieldGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCE1E7',
    marginBottom: 14,
    paddingBottom: 4,
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
    fontSize: 17,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 6,
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
