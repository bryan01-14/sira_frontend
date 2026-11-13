import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('+225 ');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  };

  const handleLogin = () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned || cleaned === '+225' || cleaned.length < 8) {
      Alert.alert(
        'Numéro requis',
        'Veuillez renseigner un numéro de téléphone valide.'
      );
      return;
    }

    router.replace('/home');
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
            <Text style={styles.headerTitle}>Connexion</Text>
          </View>

          {/* Official Sira Chauffeur Light-Mode HD Logo */}
          <View style={styles.heroSection}>
            <Image
              source={require('../../assets/images/sira-logo-light.png')}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="Logo Sira Chauffeur"
            />

            <Text style={styles.headingTitle}>
              Connectez-vous à votre{'\n'}espace{' '}
              <Text style={styles.headingTitleOrange}>chauffeur SIRA</Text>
            </Text>

            <Text style={styles.headingSubtitle}>
              Entrez votre numéro de téléphone pour accéder à votre compte
              partenaire.
            </Text>
          </View>

          {/* Underlined Form Field: Numero */}
          <View style={styles.formContainer}>
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
                placeholder="+225 0703352619"
                placeholderTextColor="#94A3B8"
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                selectionColor="#EE6723"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.submitButtonText}>SE CONNECTER</Text>
            </Pressable>
          </View>

          {/* Footer Link to Register */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>
              Vous n&apos;avez pas de compte ?{' '}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="S'inscrire"
              onPress={() => router.push('/register')}
              hitSlop={10}
            >
              <Text style={styles.footerLink}>S&apos;INSCRIRE</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 24,
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
  heroSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 36,
  },
  logoImage: {
    width: 132,
    height: 135,
    marginBottom: 20,
  },
  headingTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
  headingTitleOrange: {
    color: '#EE6723',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  headingSubtitle: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  formContainer: {
    width: '100%',
    marginBottom: 28,
  },
  fieldGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCE1E7',
    paddingBottom: 6,
  },
  fieldGroupFocused: {
    borderBottomColor: '#EE6723',
  },
  fieldLabel: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    fontWeight: '400',
    marginBottom: 4,
  },
  fieldInput: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 22,
  },
  submitButton: {
    minWidth: 215,
    height: 36,
    paddingHorizontal: 28,
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
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPrompt: {
    color: '#7C8594',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    fontWeight: '400',
  },
  footerLink: {
    color: '#EE6723',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
