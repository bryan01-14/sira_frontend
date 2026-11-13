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

type CategoryFilter = 'all' | 'orange' | 'auto';

interface BenefitItem {
  id: string;
  title: string;
  subtitle: string;
  pointsCost: number;
  category: 'orange' | 'auto';
  badgeText: string;
  icon: ImageSourcePropType;
  codePrefix: string;
}

const BENEFITS_LIST: BenefitItem[] = [
  {
    id: 'orange-data-3gb',
    title: 'Pass Internet Orange 3 Go',
    subtitle: 'Activation directe sur le +225 0703352619',
    pointsCost: 200,
    category: 'orange',
    badgeText: '200 Points',
    icon: require('../../assets/images/icons/menu-trophy-hd.png'),
    codePrefix: 'ORG-DATA',
  },
  {
    id: 'orange-credit-1000',
    title: "Crédit d'appel Orange 1 000 FCFA",
    subtitle: 'Recharge immédiate sur votre numéro Orange',
    pointsCost: 300,
    category: 'orange',
    badgeText: '300 Points',
    icon: require('../../assets/images/icons/menu-trophy-hd.png'),
    codePrefix: 'ORG-VOIX',
  },
  {
    id: 'orange-money-2500',
    title: 'Bonus Orange Money 2 500 FCFA',
    subtitle: 'Dépôt direct sur votre compte Orange Money',
    pointsCost: 500,
    category: 'orange',
    badgeText: '500 Points',
    icon: require('../../assets/images/icons/coins-white-hd.png'),
    codePrefix: 'OM-CASH',
  },
  {
    id: 'fuel-voucher-2500',
    title: 'Bon Carburant 2 500 FCFA',
    subtitle: 'Valable dans les stations partenaires SIRA',
    pointsCost: 500,
    category: 'auto',
    badgeText: '500 Points',
    icon: require('../../assets/images/icons/menu-car-hd.png'),
    codePrefix: 'SIRA-CARB',
  },
  {
    id: 'orange-data-10gb',
    title: 'Pass Internet Orange 10 Go',
    subtitle: 'Forfait mensuel haut débit réseau Orange',
    pointsCost: 750,
    category: 'orange',
    badgeText: '750 Points',
    icon: require('../../assets/images/icons/menu-trophy-hd.png'),
    codePrefix: 'ORG-MAX',
  },
  {
    id: 'car-wash-maintenance',
    title: 'Lavage & Entretien Véhicule',
    subtitle: 'Lavage complet gratuit en station partenaire',
    pointsCost: 800,
    category: 'auto',
    badgeText: '800 Points',
    icon: require('../../assets/images/icons/menu-car-hd.png'),
    codePrefix: 'SIRA-AUTO',
  },
];

export default function BenefitsScreen() {
  const insets = useSafeAreaInsets();
  const [userPoints, setUserPoints] = useState(500);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('all');
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitItem | null>(
    null
  );
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  const filteredBenefits = BENEFITS_LIST.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const handleSelectBenefit = (benefit: BenefitItem) => {
    if (redeemedIds.includes(benefit.id)) {
      Alert.alert(
        'Avantage déjà activé',
        `Vous avez déjà échangé "${benefit.title}".`
      );
      return;
    }

    if (userPoints < benefit.pointsCost) {
      const missing = benefit.pointsCost - userPoints;
      Alert.alert(
        'Points insuffisants',
        `Il vous manque ${missing} points pour débloquer "${benefit.title}". Partagez votre position sur vos lignes pour gagner plus de points !`
      );
      return;
    }

    setSelectedBenefit(benefit);
    setConfirmModalVisible(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedBenefit) return;

    setUserPoints((prev) => Math.max(0, prev - selectedBenefit.pointsCost));
    setRedeemedIds((prev) => [...prev, selectedBenefit.id]);
    setConfirmModalVisible(false);

    const isOrange = selectedBenefit.category === 'orange';
    Alert.alert(
      'Félicitations Diata !',
      isOrange
        ? `Votre avantage "${selectedBenefit.title}" a été envoyé directement sur votre numéro Orange (+225 0703352619).`
        : `Votre bon "${selectedBenefit.title}" (Code : ${selectedBenefit.codePrefix}-8492) est prêt à être utilisé.`
    );
  };

  const progressRatio = Math.min(1, userPoints / 1000);

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

        <Text style={styles.headerTitle}>Mes avantages</Text>

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

      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Cream Points & Characters Banner */}
        <View style={styles.pointsHeroWrapper}>
          <View style={styles.pointsHeroCard}>
            <View style={styles.pointsBalanceBadge}>
              <Image
                source={require('../../assets/images/icons/coins-white-hd.png')}
                style={styles.pointsBalanceCoin}
                resizeMode="contain"
              />
              <Text style={styles.pointsBalanceBadgeText}>
                Solde : {userPoints} pts
              </Text>
            </View>

            <Text style={styles.pointsHeroTitle}>
              <Text style={styles.boldText}>Félicitations</Text> Diata, vous
              {'\n'}avez accumulé{' '}
              <Text style={styles.boldText}>{userPoints} points.</Text>
            </Text>

            {/* Progress Bar toward 1000 pts */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, Math.round(progressRatio * 100))}%` },
                ]}
              />
            </View>
            <Text style={styles.progressCaption}>
              Réseau partenaire officiel :{' '}
              <Text style={styles.orangeHighlight}>Orange CI</Text>
            </Text>
          </View>

          <Image
            source={require('../../assets/images/sharing-characters-hd.png')}
            style={styles.heroCharactersImage}
            resizeMode="contain"
            accessibilityLabel="Personnages SIRA"
          />
        </View>

        {/* Category Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tous les avantages"
            onPress={() => setSelectedCategory('all')}
            style={[
              styles.filterPill,
              selectedCategory === 'all' && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === 'all' && styles.filterPillTextActive,
              ]}
            >
              Tous
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Avantages Réseau Orange"
            onPress={() => setSelectedCategory('orange')}
            style={[
              styles.filterPill,
              selectedCategory === 'orange' && styles.filterPillActive,
            ]}
          >
            <View style={styles.orangeDot} />
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === 'orange' && styles.filterPillTextActive,
              ]}
            >
              Orange CI
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Avantages Carburant et Auto"
            onPress={() => setSelectedCategory('auto')}
            style={[
              styles.filterPill,
              selectedCategory === 'auto' && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCategory === 'auto' && styles.filterPillTextActive,
              ]}
            >
              Carburant & Auto
            </Text>
          </Pressable>
        </View>

        {/* Rewards List */}
        <View style={styles.benefitsList}>
          {filteredBenefits.map((item) => {
            const isRedeemed = redeemedIds.includes(item.id);
            const canAfford = userPoints >= item.pointsCost;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => handleSelectBenefit(item)}
                style={({ pressed }) => [
                  styles.benefitCard,
                  pressed && styles.benefitCardPressed,
                ]}
              >
                {/* Left Orange Icon Circle */}
                <View
                  style={[
                    styles.benefitIconCircle,
                    !canAfford && !isRedeemed && styles.benefitIconCircleLocked,
                  ]}
                >
                  <Image
                    source={item.icon}
                    style={styles.benefitIconImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Center Info */}
                <View style={styles.benefitInfo}>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                  <Text style={styles.benefitSubtitle}>{item.subtitle}</Text>

                  {/* Orange Points Pill */}
                  <View style={styles.pointsPill}>
                    <Image
                      source={require('../../assets/images/icons/coins-white-hd.png')}
                      style={styles.pointsCoinIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.pointsPillText}>{item.badgeText}</Text>
                  </View>
                </View>

                {/* Right Action Pill */}
                <View
                  style={[
                    styles.actionBadge,
                    isRedeemed
                      ? styles.actionBadgeRedeemed
                      : canAfford
                        ? styles.actionBadgeAvailable
                        : styles.actionBadgeLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionBadgeText,
                      !canAfford && !isRedeemed && styles.actionBadgeTextLocked,
                    ]}
                  >
                    {isRedeemed
                      ? 'Activé ✓'
                      : canAfford
                        ? 'Échanger'
                        : 'Bloqué'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Info Note */}
        <View style={styles.howToEarnCard}>
          <View style={styles.howToEarnHeader}>
            <View style={styles.smallOrangePinCircle}>
              <Image
                source={require('../../assets/images/icons/menu-pin-hd.png')}
                style={styles.smallPinIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.howToEarnTitle}>
              Comment gagner plus de points ?
            </Text>
          </View>
          <Text style={styles.howToEarnText}>
            Activez <Text style={styles.boldText}>Partager ma position</Text>{' '}
            durant vos trajets quotidiens sur vos lignes pour cumuler des points
            et recevoir vos pass et bonus{' '}
            <Text style={styles.orangeHighlight}>Orange</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Dark Navigation Bar (3rd Tab Trophy Active with Raised Notch) */}
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

          {/* Tab 3: Rewards / Trophy (Active with Raised White Notch & Orange Circle) */}
          <View style={styles.tabSlot}>
            <View style={styles.activeNotchOuter}>
              <Pressable
                accessibilityRole="tab"
                accessibilityLabel="Mes avantages"
                accessibilityState={{ selected: true }}
                style={styles.activeOrangeCircle}
              >
                <Image
                  source={require('../../assets/images/icons/nav-trophy-white-hd.png')}
                  style={styles.activeTabIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>

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

      {/* Confirmation Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setConfirmModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + 16, 24) },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalIconCircle}>
              {selectedBenefit && (
                <Image
                  source={selectedBenefit.icon}
                  style={styles.modalIconImage}
                  resizeMode="contain"
                />
              )}
            </View>

            <Text style={styles.modalTitle}>Confirmer l’échange</Text>

            {selectedBenefit && (
              <>
                <Text style={styles.modalBenefitName}>
                  {selectedBenefit.title}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedBenefit.category === 'orange'
                    ? 'Cet avantage sera activé immédiatement sur votre numéro Orange (+225 0703352619).'
                    : 'Un code partenaire SIRA vous sera attribué immédiatement.'}
                </Text>

                <View style={styles.modalSummaryBox}>
                  <View style={styles.modalSummaryRow}>
                    <Text style={styles.modalSummaryLabel}>Coût :</Text>
                    <Text style={styles.modalSummaryValueOrange}>
                      {selectedBenefit.pointsCost} points
                    </Text>
                  </View>
                  <View style={styles.modalSummaryRow}>
                    <Text style={styles.modalSummaryLabel}>
                      Solde après échange :
                    </Text>
                    <Text style={styles.modalSummaryValue}>
                      {userPoints - selectedBenefit.pointsCost} points
                    </Text>
                  </View>
                </View>
              </>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Confirmer et activer l'avantage"
              onPress={handleConfirmRedeem}
              style={({ pressed }) => [
                styles.modalConfirmButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.modalConfirmText}>
                CONFIRMER L’ÉCHANGE
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              onPress={() => setConfirmModalVisible(false)}
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
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  pointsHeroWrapper: {
    width: '100%',
    position: 'relative',
    paddingTop: 6,
    marginBottom: 16,
  },
  pointsHeroCard: {
    width: '100%',
    backgroundColor: '#FFEACD',
    borderRadius: 16,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 132,
    justifyContent: 'center',
  },
  pointsBalanceBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6622',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  pointsBalanceCoin: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  pointsBalanceBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    fontWeight: '700',
  },
  pointsHeroTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13.5,
    lineHeight: 18.5,
    marginBottom: 8,
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF6622',
    borderRadius: 3,
  },
  progressCaption: {
    color: '#333333',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10.5,
    fontWeight: '500',
  },
  orangeHighlight: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  heroCharactersImage: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    width: 132,
    height: 96,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterPillActive: {
    backgroundColor: '#EF6622',
    borderColor: '#EF6622',
  },
  orangeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF7900',
    marginRight: 6,
  },
  filterPillText: {
    color: '#222222',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  benefitsList: {
    width: '100%',
    marginBottom: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  benefitCardPressed: {
    backgroundColor: '#FFF3EC',
    borderColor: '#EF6622',
  },
  benefitIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIconCircleLocked: {
    backgroundColor: '#94A3B8',
  },
  benefitIconImage: {
    width: 24,
    height: 24,
  },
  benefitInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  benefitTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 2,
  },
  benefitSubtitle: {
    color: '#4B5563',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 5,
  },
  pointsPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6622',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pointsCoinIcon: {
    width: 10,
    height: 10,
    marginRight: 4,
  },
  pointsPillText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 9.5,
    fontWeight: '600',
  },
  actionBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeAvailable: {
    backgroundColor: '#EF6622',
  },
  actionBadgeRedeemed: {
    backgroundColor: '#16A34A',
  },
  actionBadgeLocked: {
    backgroundColor: '#E2E8F0',
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBadgeTextLocked: {
    color: '#64748B',
  },
  howToEarnCard: {
    width: '100%',
    backgroundColor: '#FFF7F2',
    borderWidth: 1,
    borderColor: '#FBD5C0',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  howToEarnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  smallOrangePinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  smallPinIcon: {
    width: 14,
    height: 14,
  },
  howToEarnTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13.5,
    fontWeight: '600',
  },
  howToEarnText: {
    color: '#333333',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    lineHeight: 17,
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
    marginBottom: 14,
  },
  modalIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalIconImage: {
    width: 28,
    height: 28,
  },
  modalTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalBenefitName: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#4B5563',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalSummaryBox: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  modalSummaryLabel: {
    color: '#4B5563',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
  },
  modalSummaryValueOrange: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13.5,
  },
  modalSummaryValue: {
    color: '#000000',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13.5,
  },
  modalConfirmButton: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalConfirmText: {
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
