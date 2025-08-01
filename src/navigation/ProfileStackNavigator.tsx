/**
 * Profile Stack Navigator
 * Handles profile, closet, and settings screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

// Existing ProfileScreen
import ProfileScreen from '../../screens/ProfileScreen';

// Placeholder components
import { View, Text, StyleSheet } from 'react-native';

const ClosetScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Closet</Text>
    <Text>View and equip your gear</Text>
  </View>
);

const EditProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Edit Profile</Text>
    <Text>Update your avatar and info</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Settings</Text>
    <Text>App preferences and account</Text>
  </View>
);

const StatsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Stats</Text>
    <Text>Your skating statistics</Text>
  </View>
);

const AchievementsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Achievements</Text>
    <Text>Badges and accomplishments</Text>
  </View>
);

const GearDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Gear Details</Text>
    <Text>View gear stats and equip</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        ...SCREEN_OPTIONS.defaultHeader,
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerRight: () => (
            // You can add settings button here
            <View />
          ),
        }}
      />

      <Stack.Screen
        name="Closet"
        component={ClosetScreen}
        options={{
          title: 'Closet',
          headerBackTitle: 'Profile',
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerBackTitle: 'Profile',
        }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerBackTitle: 'Profile',
        }}
      />

      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: 'Statistics',
          headerBackTitle: 'Profile',
        }}
      />

      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: 'Achievements',
          headerBackTitle: 'Profile',
        }}
      />

      <Stack.Screen
        name="GearDetails"
        component={GearDetailsScreen}
        options={({ route }) => ({
          title: route.params.gearName || 'Gear Details',
          headerBackTitle: 'Closet',
        })}
      />
    </Stack.Navigator>
  );
}
