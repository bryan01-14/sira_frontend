import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 16;
const BANNER_HEIGHT = Math.round(BANNER_WIDTH * (157 / 391));

interface DriverLine {
  id: string;
  name: string;
  pointsLabel: string;
}

const INITIAL_LINES: DriverLine[] = [
  { id: '1', name: 'Abobo - Adjamé', pointsLabel: 'Points accumulés' },
  { id: '2', name: 'Adjamé - Plateau', pointsLabel: 'Points accumulés' },
  { id: '3', name: 'Plateau - Marcory', pointsLabel: 'Points accumulés' },
];

export default function LinesScreen() {
  const insets = useSafeAreaInsets();
  const [lines, setLines] = useState<DriverLine[]>(INITIAL_LINES);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newLineName, setNewLineName] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  const handleAddLine = () => {
    if (!newLineName.trim()) {
      Alert.alert('Champ requis', 'Veuillez saisir le nom de la ligne (ex: Yopougon - Plateau).');
      return;
    }

    const created: DriverLine = {
      id: String(Date.now()),
      name: newLineName.trim(),
      pointsLabel: 'Points accumulés',
    };
    setLines((prev) => [...prev, created]);
    setNewLineName('');
    setAddModalVisible(false);
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

        <Text style={styles.headerTitle}>Mes lignes</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Paramètres"
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
        {/* Top Map & Orange Taxi Illustration Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('../../assets/images/lines-banner-hd.png')}
            style={styles.bannerImage}
            resizeMode="cover"
            accessibilityLabel="Illustration taxi SIRA sur carte"
          />
        </View>

        {/* Section Subtitle */}
        <Text style={styles.sectionTitle}>Vos différentes lignes sont :</Text>

        {/* Grouped Lines Card */}
        <View style={styles.linesCardContainer}>
          {lines.map((line, index) => (
            <Pressable
              key={line.id}
              accessibilityRole="button"
              accessibilityLabel={line.name}
              onPress={() =>
                Alert.alert(
                  line.name,
                  `Ligne active : ${line.name}\nConsultez vos trajets et points accumulés sur cette ligne.`
                )
              }
              style={({ pressed }) => [
                styles.lineRow,
                index < lines.length - 1 && styles.lineRowBorder,
                pressed && styles.lineRowPressed,
              ]}
            >
              {/* Left Orange Route Circle */}
              <View style={styles.routeCircle}>
                <Image
                  source={require('../../assets/images/icons/menu-route-hd.png')}
                  style={styles.routeIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Middle Line Name & Points Pill */}
              <View style={styles.lineDetails}>
                <Text style={styles.lineName}>{line.name}</Text>

                <View style={styles.pointsPill}>
                  <Image
                    source={require('../../assets/images/icons/coins-white-hd.png')}
                    style={styles.pointsCoinIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.pointsPillText}>{line.pointsLabel}</Text>
                </View>
              </View>

              {/* Right Small Orange Chevron */}
              <View style={styles.smallChevronCircle}>
                <Text style={styles.smallChevronText}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Orange Pill Button: + AJOUTER UNE LIGNE */}
        <View style={styles.addButtonWrapper}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter une ligne"
            onPress={() => setAddModalVisible(true)}
            style={({ pressed }) => [
              styles.addLineButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.plusIconContainer}>
              <View style={styles.plusHorizontalBar} />
              <View style={styles.plusVerticalBar} />
            </View>
            <Text style={styles.addLineButtonText}>AJOUTER UNE LIGNE</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Dark Navigation Bar (Profile Tab Active with Raised Notch) */}
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

          <View style={styles.tabSlot}>
            <View style={styles.activeNotchOuter}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel="Mon compte"
                accessibilityState={{ selected: true }}
                onPress={() => router.replace('/profile')}
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

      {/* Modal to Add a New Line */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setAddModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Ajouter une ligne</Text>
            <Text style={styles.modalSubtitle}>
              Renseignez le trajet de votre nouvelle ligne partenaire
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex : Yopougon - Plateau"
              placeholderTextColor="#94A3B8"
              value={newLineName}
              onChangeText={setNewLineName}
              selectionColor="#EF6622"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddLine}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Valider la nouvelle ligne"
              onPress={handleAddLine}
              style={({ pressed }) => [
                styles.modalSubmitButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.modalSubmitText}>AJOUTER</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              onPress={() => setAddModalVisible(false)}
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
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 24,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16.5,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  linesCardContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  lineRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#DCE1E7',
  },
  lineRowPressed: {
    backgroundColor: '#FFF3EC',
  },
  routeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIcon: {
    width: 27,
    height: 27,
  },
  lineDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  lineName: {
    color: '#000000',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15.5,
    fontWeight: '500',
    lineHeight: 21,
    marginBottom: 4,
  },
  pointsPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6622',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
  },
  pointsCoinIcon: {
    width: 10,
    height: 10,
    marginRight: 4,
  },
  pointsPillText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
    fontWeight: '500',
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
  addButtonWrapper: {
    alignItems: 'center',
    marginTop: 32,
  },
  addLineButton: {
    minWidth: 255,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#EF6622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF6622',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  plusHorizontalBar: {
    position: 'absolute',
    width: 24,
    height: 5,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  plusVerticalBar: {
    position: 'absolute',
    width: 5,
    height: 24,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  addLineButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
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
    marginBottom: 18,
  },
  modalInput: {
    width: '100%',
    height: 46,
    borderWidth: 1.5,
    borderColor: '#DCE1E7',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: '#000000',
    marginBottom: 16,
  },
  modalSubmitButton: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
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
