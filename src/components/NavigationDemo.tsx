/**
 * Navigation Demo Component
 * Shows how to use the elite navigation system
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  useAppNavigation,
  useCurrentRouteName,
  useTabBarVisibility,
} from '../hooks/useNavigation';

export default function NavigationDemo() {
  const navigation = useAppNavigation();
  const currentRoute = useCurrentRouteName();
  const { hideTabBar, showTabBar } = useTabBarVisibility();

  const navigationExamples = [
    {
      title: 'Navigate to Spot Details',
      action: () =>
        navigation.navigate('Main', {
          screen: 'MapStack',
          params: {
            screen: 'SpotDetails',
            params: {
              spotId: 'demo-spot-1',
              spotName: 'Venice Beach Skate Park',
              latitude: 33.985,
              longitude: -118.4695,
            },
          },
        }),
    },
    {
      title: 'Start Battle',
      action: () =>
        navigation.navigate('Main', {
          screen: 'BattleStack',
          params: {
            screen: 'BattleLobby',
          },
        }),
    },
    {
      title: 'View Shop Item',
      action: () =>
        navigation.navigate('Main', {
          screen: 'ShopStack',
          params: {
            screen: 'ItemDetails',
            params: {
              itemId: 'deck-001',
              itemName: 'Thunder Deck Pro',
              price: 120,
              rarity: 'epic',
            },
          },
        }),
    },
    {
      title: 'Open Closet',
      action: () =>
        navigation.navigate('Main', {
          screen: 'ProfileStack',
          params: {
            screen: 'Closet',
          },
        }),
    },
    {
      title: 'Show Battle Invite Modal',
      action: () =>
        navigation.navigate('BattleInvite', {
          fromUserId: 'user123',
          fromUsername: 'ProSkater2024',
        }),
    },
    {
      title: 'Hide Tab Bar',
      action: hideTabBar,
    },
    {
      title: 'Show Tab Bar',
      action: showTabBar,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧭 Navigation Demo</Text>
      <Text style={styles.subtitle}>
        Current Route: {currentRoute || 'Unknown'}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Examples</Text>
        {navigationExamples.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={example.action}
          >
            <Text style={styles.buttonText}>{example.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Features</Text>
        <Text style={styles.feature}>
          ✅ Type-safe navigation with TypeScript
        </Text>
        <Text style={styles.feature}>✅ Deep linking support</Text>
        <Text style={styles.feature}>✅ Modal presentations</Text>
        <Text style={styles.feature}>✅ Tab bar visibility control</Text>
        <Text style={styles.feature}>✅ Screen tracking and analytics</Text>
        <Text style={styles.feature}>✅ Back button handling</Text>
        <Text style={styles.feature}>✅ Gesture customization</Text>
        <Text style={styles.feature}>✅ Animation configurations</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Architecture Highlights</Text>
        <Text style={styles.feature}>🏗️ Modular stack navigators</Text>
        <Text style={styles.feature}>🎯 Centralized configuration</Text>
        <Text style={styles.feature}>🪝 Custom navigation hooks</Text>
        <Text style={styles.feature}>🔗 Deep linking ready</Text>
        <Text style={styles.feature}>📱 Modal system</Text>
        <Text style={styles.feature}>🎨 Consistent styling</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 20,
  },
  feature: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});
