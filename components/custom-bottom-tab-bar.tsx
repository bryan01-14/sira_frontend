import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabPath = 'explore' | 'routes' | 'alerts' | 'profile' | 'none';

interface CustomBottomTabBarProps {
  activeTab?: TabPath;
}

export function CustomBottomTabBar({ activeTab }: CustomBottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Determine active tab dynamically if not passed explicitly (supports 'none' to disable active badge)
  const currentTab: TabPath = activeTab !== undefined
    ? activeTab
    : (
        pathname.includes('traffic') || pathname.includes('route-detail') || pathname.includes('navigation-active')
          ? 'routes'
          : pathname.includes('report-event') || pathname.includes('notifications') || pathname.includes('accident')
          ? 'alerts'
          : pathname.includes('profile')
          ? 'profile'
          : 'explore'
      );

  const tabs: {
    id: TabPath;
    label: string;
    iconActive: keyof typeof Ionicons.glyphMap;
    iconInactive: keyof typeof Ionicons.glyphMap;
    path: string;
  }[] = [
    {
      id: 'explore',
      label: 'Carte',
      iconActive: 'location',
      iconInactive: 'location',
      path: '/(tabs)/explore',
    },
    {
      id: 'routes',
      label: 'Trajets',
      iconActive: 'car-sport',
      iconInactive: 'car-sport',
      path: '/traffic',
    },
    {
      id: 'alerts',
      label: 'Alertes',
      iconActive: 'warning',
      iconInactive: 'warning',
      path: '/report-event',
    },
    {
      id: 'profile',
      label: 'Profil',
      iconActive: 'person',
      iconInactive: 'person',
      path: '/profile',
    },
  ];

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        if (isActive) {
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.activeTabItemContainer}
              onPress={() => {
                if (pathname !== tab.path) {
                  router.push(tab.path as any);
                }
              }}
              activeOpacity={0.85}
            >
              {/* Outer Light Blue Glow Circle Protruding Upwards */}
              <View style={styles.outerBlueBadge}>
                {/* Inner Orange Circle */}
                <View style={styles.innerOrangeBadge}>
                  <Ionicons name={tab.iconActive} size={26} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.inactiveTabItemContainer}
            onPress={() => {
              if (pathname !== tab.path) {
                router.push(tab.path as any);
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={tab.iconInactive} size={29} color="#EAEAEA" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#262626',
    paddingTop: 10,
    paddingHorizontal: 8,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  inactiveTabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  outerBlueBadge: {
    position: 'absolute',
    top: -24,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#72B5FA',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#72B5FA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  innerOrangeBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F26522',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
