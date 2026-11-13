import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  badgeText: string;
  unread: boolean;
  icon: ImageSourcePropType;
  hasCoinsIcon?: boolean;
  targetRoute?: '/home' | '/benefits' | '/lines' | '/history';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Alerte trafic : Adjamé - Plateau',
    message:
      'Circulation ralentie signalée sur votre ligne. Partagez votre position pour guider la communauté SIRA.',
    time: 'Il y a 5 min',
    badgeText: 'Info trafic',
    unread: true,
    icon: require('../../assets/images/icons/menu-route-hd.png'),
    targetRoute: '/home',
  },
  {
    id: '2',
    title: '+25 Points accumulés',
    message:
      'Merci Kouadio ! Votre trajet de 11h39 à 11h50 sur Adjamé - Plateau vous a rapporté 25 points.',
    time: 'Il y a 20 min',
    badgeText: 'Points accumulés',
    unread: true,
    icon: require('../../assets/images/icons/bell-white-hd.png'),
    hasCoinsIcon: true,
    targetRoute: '/history',
  },
  {
    id: '3',
    title: 'Bonus Réseau Orange disponible',
    message:
      'Vous avez atteint 500 points ! Activez votre Pass Internet Orange ou votre Bonus Orange Money dès maintenant.',
    time: '11h50',
    badgeText: 'Avantage Orange',
    unread: true,
    icon: require('../../assets/images/icons/menu-trophy-hd.png'),
    hasCoinsIcon: true,
    targetRoute: '/benefits',
  },
  {
    id: '4',
    title: 'Ligne Plateau - Marcory active',
    message:
      'Votre ligne secondaire Plateau - Marcory est bien configurée sur votre profil chauffeur.',
    time: 'Hier, 16h40',
    badgeText: 'Mes lignes',
    unread: false,
    icon: require('../../assets/images/icons/menu-route-hd.png'),
    targetRoute: '/lines',
  },
  {
    id: '5',
    title: 'Bienvenue sur SIRA Chauffeur',
    message:
      'Votre compte chauffeur et votre véhicule Taxi Toyota sont vérifiés. Bonne route avec SIRA !',
    time: 'Hier, 08h15',
    badgeText: 'Compte vérifié',
    unread: false,
    icon: require('../../assets/images/icons/menu-car-hd.png'),
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handlePressNotification = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );

    if (item.targetRoute) {
      Alert.alert(item.title, item.message, [
        { text: 'Fermer', style: 'cancel' },
        {
          text: 'Voir',
          onPress: () => router.push(item.targetRoute!),
        },
      ]);
    } else {
      Alert.alert(item.title, item.message);
    }
  };

  const handleMoreOptions = (item: NotificationItem) => {
    Alert.alert(item.title, 'Que souhaitez-vous faire ?', [
      {
        text: item.unread ? 'Marquer comme lu' : 'Marquer comme non lu',
        onPress: () =>
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === item.id ? { ...n, unread: !n.unread } : n
            )
          ),
      },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () =>
          setNotifications((prev) => prev.filter((n) => n.id !== item.id)),
      },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const filteredNotifications = notifications.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
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

        <Text style={styles.headerTitle}>Notifications</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rechercher une notification"
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

      {/* Optional Search Bar */}
      {searchVisible && (
        <View style={styles.searchBarWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une notification..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectionColor="#EF6622"
            autoFocus
          />
        </View>
      )}

      {/* Top Status & Mark All Read Bar */}
      <View style={styles.topActionBar}>
        <View style={styles.unreadCountRow}>
          <View style={styles.unreadCountBadge}>
            <Text style={styles.unreadCountBadgeText}>{unreadCount}</Text>
          </View>
          <Text style={styles.unreadCountLabel}>
            {unreadCount > 1
              ? 'Nouvelles notifications'
              : unreadCount === 1
                ? 'Nouvelle notification'
                : 'Toutes les notifications sont lues'}
          </Text>
        </View>

        {unreadCount > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tout marquer comme lu"
            onPress={handleMarkAllRead}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Text style={styles.markAllReadText}>Tout lire</Text>
          </Pressable>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {filteredNotifications.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => handlePressNotification(item)}
            style={({ pressed }) => [
              styles.notificationCard,
              item.unread && styles.notificationCardUnread,
              pressed && styles.notificationCardPressed,
            ]}
          >
            {/* Left Orange Icon Circle */}
            <View style={styles.iconCircleWrapper}>
              <View style={styles.orangeIconCircle}>
                <Image
                  source={item.icon}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              </View>
              {item.unread && <View style={styles.unreadDot} />}
            </View>

            {/* Center Text Details */}
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>

              <Text style={styles.cardMessage} numberOfLines={2}>
                {item.message}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.orangeBadgePill}>
                  {item.hasCoinsIcon && (
                    <Image
                      source={require('../../assets/images/icons/coins-white-hd.png')}
                      style={styles.pointsCoinIcon}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.orangeBadgeText}>{item.badgeText}</Text>
                </View>

                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>

            {/* Right 3 Vertical Dots Menu */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Plus d'options"
              onPress={() => handleMoreOptions(item)}
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
          </Pressable>
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
            accessibilityLabel="Mes avantages"
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
    width: 23,
    height: 23,
  },
  pressed: {
    opacity: 0.78,
  },
  searchBarWrapper: {
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2D5C4',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  unreadCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadCountBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  unreadCountBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    fontWeight: '700',
  },
  unreadCountLabel: {
    color: '#222222',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
  },
  markAllReadText: {
    color: '#EF6622',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12.5,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 11,
    paddingVertical: 11,
    paddingLeft: 12,
    paddingRight: 10,
    marginBottom: 8,
  },
  notificationCardUnread: {
    backgroundColor: '#FFF9F5',
    borderColor: '#F8C9B0',
  },
  notificationCardPressed: {
    backgroundColor: '#FFF3EC',
    borderColor: '#EF6622',
  },
  iconCircleWrapper: {
    position: 'relative',
  },
  orangeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EF6622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF6622',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardTitle: {
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 19,
  },
  cardMessage: {
    color: '#374151',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orangeBadgePill: {
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
  orangeBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
    fontWeight: '500',
  },
  timeText: {
    color: '#6B7280',
    fontFamily: 'Montserrat_500Medium',
    fontSize: 10.5,
    fontWeight: '500',
  },
  moreDotsButton: {
    width: 24,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#000000',
    marginVertical: 1.4,
  },
  navbarOuter: {
    width: '100%',
    backgroundColor: '#333333',
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
