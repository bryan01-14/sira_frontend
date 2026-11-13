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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

type PickerTarget = 'avatar' | 'document' | null;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [documentUri, setDocumentUri] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const [lastName, setLastName] = useState('Ouattara');
  const [firstName, setFirstName] = useState('Diata');
  const [phone, setPhone] = useState('+225 0703352619');
  const [address, setAddress] = useState('Abobo samaké');
  const [line, setLine] = useState('Adjamé-Plateau');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [idOrLicenseNumber, setIdOrLicenseNumber] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  };

  const handleTakePhoto = async () => {
    const currentTarget = pickerTarget;
    setPickerTarget(null);
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
        aspect: currentTarget === 'document' ? [16, 10] : [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (currentTarget === 'document') {
          setDocumentUri(result.assets[0].uri);
        } else {
          setAvatarUri(result.assets[0].uri);
        }
      }
    } catch {
      Alert.alert(
        'Erreur',
        "Impossible d'ouvrir l'appareil photo sur cet appareil."
      );
    }
  };

  const handlePickFromGallery = async () => {
    const currentTarget = pickerTarget;
    setPickerTarget(null);
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
        aspect: currentTarget === 'document' ? [16, 10] : [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (currentTarget === 'document') {
          setDocumentUri(result.assets[0].uri);
        } else {
          setAvatarUri(result.assets[0].uri);
        }
      }
    } catch {
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie de photos.");
    }
  };

  const handleCreateAccount = () => {
    if (!lastName.trim() || !firstName.trim()) {
      Alert.alert('Champ requis', 'Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Champ requis', 'Veuillez renseigner votre numéro.');
      return;
    }
    if (!idOrLicenseNumber.trim()) {
      Alert.alert(
        'Champ requis',
        "Veuillez renseigner le numéro de votre pièce d'identité ou permis."
      );
      return;
    }
    if (!documentUri) {
      Alert.alert(
        'Photo requise',
        "Veuillez ajouter la photo de votre pièce d'identité ou permis."
      );
      return;
    }

    Alert.alert(
      'Compte créé avec succès',
      'Bienvenue dans la communauté des chauffeurs de SIRA !',
      [
        {
          text: 'Continuer',
          onPress: () => router.replace('/home'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 16, 28) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Header */}
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retour"
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={require('../../assets/images/icons/arrow-left-hd.png')}
                style={styles.backArrowIcon}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.headerTitle}>Inscription</Text>
          </View>

          {/* Avatar Section with Functional Camera Button */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Pressable
                onPress={() => setPickerTarget('avatar')}
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
                  accessibilityLabel="Avatar du chauffeur SIRA"
                />
              </Pressable>

              {/* Dedicated Crisp Camera Badge Button */}
              <Pressable
                onPress={() => setPickerTarget('avatar')}
                accessibilityRole="button"
                accessibilityLabel="Prendre ou choisir une photo de profil"
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

            {/* Community Heading */}
            <Text style={styles.communityTitle}>
              Rejoignez la communauté{'\n'}des{' '}
              <Text style={styles.communityTitleOrange}>
                chauffeurs de SIRA
              </Text>
            </Text>
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

            {/* Marque du véhicule (une seule fois) */}
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

            {/* Numéro de la pièce d'identité ou permis */}
            <View
              style={[
                styles.fieldGroup,
                focusedField === 'idOrLicenseNumber' && styles.fieldGroupFocused,
              ]}
            >
              <Text style={styles.fieldLabel}>
                Numéro de la pièce d&apos;identité ou permis
              </Text>
              <TextInput
                style={styles.fieldInput}
                value={idOrLicenseNumber}
                onChangeText={setIdOrLicenseNumber}
                onFocus={() => setFocusedField('idOrLicenseNumber')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                autoCapitalize="characters"
                returnKeyType="done"
              />
            </View>

            {/* Photo de la pièce d'identité ou permis */}
            <View style={styles.documentSection}>
              <Text style={styles.fieldLabel}>
                Photo de la pièce d&apos;identité ou permis
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ajouter la photo de la pièce d'identité ou du permis"
                onPress={() => setPickerTarget('document')}
                style={({ pressed }) => [
                  styles.documentUploadBox,
                  documentUri && styles.documentUploadBoxFilled,
                  pressed && styles.pressed,
                ]}
              >
                {documentUri ? (
                  <View style={styles.documentPreviewContainer}>
                    <Image
                      source={{ uri: documentUri }}
                      style={styles.documentPreviewImage}
                      resizeMode="cover"
                    />
                    <View style={styles.documentChangeBadge}>
                      <Image
                        source={require('../../assets/images/icons/camera-white-hd.png')}
                        style={styles.documentBadgeIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.documentChangeText}>Modifier</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.documentEmptyContent}>
                    <View style={styles.documentCameraCircle}>
                      <Image
                        source={require('../../assets/images/icons/camera-white-hd.png')}
                        style={styles.documentCameraIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.documentTextWrapper}>
                      <Text style={styles.documentUploadTitle}>
                        Ajouter une photo du document
                      </Text>
                      <Text style={styles.documentUploadHint}>
                        Prendre une photo ou choisir depuis la galerie
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Bottom Submit Pill Button */}
          <View style={styles.buttonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Créer mon compte"
              onPress={handleCreateAccount}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.submitButtonText}>CRÉER MON COMPTE</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Photo Picker Modal (Prendre une photo / Choisir une photo) */}
      <Modal
        visible={pickerTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerTarget(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPickerTarget(null)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {pickerTarget === 'document'
                ? "Pièce d'identité / Permis"
                : 'Photo de profil'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {pickerTarget === 'document'
                ? "Ajoutez une photo lisible de votre pièce d'identité ou permis de conduire"
                : 'Sélectionnez une option pour votre photo de chauffeur'}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Prendre une photo"
              onPress={handleTakePhoto}
              style={({ pressed }) => [
                styles.modalOptionButton,
                styles.modalOptionPrimary,
                pressed && styles.submitButtonPressed,
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
                pressed && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.modalOptionSecondaryText}>
                Choisir une photo
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              onPress={() => setPickerTarget(null)}
              style={({ pressed }) => [
                styles.modalCancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -12,
    marginBottom: 14,
  },
  backButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EE6723',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  backArrowIcon: {
    width: 14,
    height: 14,
  },
  headerTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 134,
    height: 134,
    position: 'relative',
    marginBottom: 14,
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
  communityTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18.5,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  communityTitleOrange: {
    color: '#EE6723',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
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
  documentSection: {
    marginBottom: 18,
    marginTop: 2,
  },
  documentUploadBox: {
    marginTop: 8,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  documentUploadBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#EE6723',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  documentEmptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentCameraCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EE6723',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentCameraIcon: {
    width: 18,
    height: 18,
  },
  documentTextWrapper: {
    flex: 1,
  },
  documentUploadTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  documentUploadHint: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
  },
  documentPreviewContainer: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  documentPreviewImage: {
    width: '100%',
    height: '100%',
  },
  documentChangeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 103, 35, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  documentBadgeIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  documentChangeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11.5,
    fontWeight: '600',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  submitButton: {
    minWidth: 215,
    height: 32,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: '#EE6723',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
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
