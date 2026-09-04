import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Bar */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/sira-logo-transparent.png')}
          style={styles.headerLogo}
          contentFit="contain"
        />
        <TouchableOpacity style={styles.profileButton}>
          <IconSymbol name="house.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeSubtitle}>Bienvenue sur</Text>
          <Text style={styles.welcomeTitle}>Sira App</Text>
          <Text style={styles.welcomeDescription}>
            Votre plateforme de mobilité et de navigation intelligente.
          </Text>
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#F2652220' }]}>
              <IconSymbol name="paperplane.fill" size={24} color="#F26522" />
            </View>
            <Text style={styles.cardTitle}>Itinéraires</Text>
            <Text style={styles.cardSubtitle}>Explorer les trajets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#38EF7D20' }]}>
              <IconSymbol name="house.fill" size={24} color="#38EF7D" />
            </View>
            <Text style={styles.cardTitle}>Favoris</Text>
            <Text style={styles.cardSubtitle}>Vos destinations</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerLogo: {
    width: 90,
    height: 36,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#262626',
  },
  welcomeSubtitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
  },
  welcomeDescription: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#141414',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#262626',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#777777',
    fontSize: 13,
    marginTop: 4,
  },
});
