import React, { useState } from 'react';
import {
  Alert,
  Image,
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

interface TripHistoryItem {
  id: string;
  route: string;
  departure: string;
  arrival: string;
  pointsLabel: string;
}

const HISTORY_ITEMS: TripHistoryItem[] = Array.from({ length: 8 }, (_, idx) => ({
  id: `trip-${idx + 1}`,
  route: 'Adjamé - Plateau',
  departure: '11h39',
  arrival: '11h50',
  pointsLabel: 'Points accumulés',
}));

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  const filteredItems = HISTORY_ITEMS.filter((item) =>
    item.route.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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

        <Text style={styles.headerTitle}>Historique</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rechercher"
          onPress={() => setSearchVisible((prev) => !prev)}
          hitSlop={12}
          style={({ pressed }) => [
            styles.headerSearchButton,
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={require('../../assets/images/icons/search-hd.png')}
            style={styles.headerSearchIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Optional Search Input Bar when magnifier is tapped */}
      {searchVisible && (
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un trajet (ex: Adjamé - Plateau)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectionColor="#EF6622"
            autoFocus
          />
        </View>
      )}

      {/* Trip History List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            {/* Left Orange Route Circle */}
            <View style={styles.routeCircle}>
              <Image
                source={require('../../assets/images/icons/menu-route-hd.png')}
                style={styles.routeIcon}
                resizeMode="contain"
              />
            </View>

            {/* Trip Info */}
            <View style={styles.tripDetails}>
              <Text style={styles.routeTitle}>{item.route}</Text>

              <View style={styles.timesRow}>
                <Text style={styles.timeText}>
                  <Text style={styles.boldText}>Depart</Text> :{item.departure}
                </Text>
                <Text style={[styles.timeText, styles.arrivalSpacing]}>
                  <Text style={styles.boldText}>Arrivée</Text> :{item.arrival}
                </Text>
              </View>

              <View style={styles.pointsPill}>
                <Image
                  source={require('../../assets/images/icons/coins-white-hd.png')}
                  style={styles.pointsCoinIcon}
                  resizeMode="contain"
                />
                <Text style={styles.pointsPillText}>{item.pointsLabel}</Text>
              </View>
            </View>

            {/* Three Vertical Dots Menu Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Options du trajet"
              onPress={() =>
                Alert.alert(
                  item.route,
                  `Départ : ${item.departure} — Arrivée : ${item.arrival}\n+25 points SIRA accumulés sur ce trajet.`
                )
              }
              hitSlop={10}
              style={({ pressed }) => [
                styles.moreDotsButton,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </Pressable>
          </View>
        ))}
      </ScrollView>

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
  headerSearchButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSearchIcon: {
    width: 22,
    height: 22,
  },
  pressed: {
    opacity: 0.75,
  },
  searchBarContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF3EC',
    borderBottomWidth: 1,
    borderBottomColor: '#FBD5C0',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#EF6622',
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 16,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  routeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIcon: {
    width: 28,
    height: 28,
  },
  tripDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  routeTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 2,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    color: '#000000',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10.5,
    lineHeight: 14,
  },
  boldText: {
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
  },
  arrivalSpacing: {
    marginLeft: 24,
  },
  pointsPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF6622',
    borderRadius: 999,
    paddingHorizontal: 8,
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
    fontSize: 8.5,
    fontWeight: '500',
  },
  moreDotsButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#111111',
    marginVertical: 1.2,
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
});
