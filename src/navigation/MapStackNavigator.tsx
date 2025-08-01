/**
 * Map Stack Navigator
 * Handles map-related screens and navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MapStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

// Existing MapScreen (we'll update it)
import MapScreen from '../../screens/MapScreen';

// Placeholder components for new screens
import { View, Text, StyleSheet } from 'react-native';

const SpotDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Spot Details</Text>
    <Text>View spot info, checked-in skaters, photos</Text>
  </View>
);

const CheckInScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Check In</Text>
    <Text>Check in/out at this spot</Text>
  </View>
);

const NearbySkatersScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Nearby Skaters</Text>
    <Text>See who's skating nearby</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<MapStackParamList>();

export function MapStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MapHome"
      screenOptions={{
        ...SCREEN_OPTIONS.defaultHeader,
      }}
    >
      <Stack.Screen 
        name="MapHome" 
        component={MapScreen}
        options={{
          title: 'SkateHubba',
          ...SCREEN_OPTIONS.transparentHeader,
        }}
      />
      
      <Stack.Screen 
        name="SpotDetails" 
        component={SpotDetailsScreen}
        options={({ route }) => ({
          title: route.params.spotName || 'Spot Details',
          headerBackTitle: 'Map',
        })}
      />
      
      <Stack.Screen 
        name="CheckIn" 
        component={CheckInScreen}
        options={{
          title: 'Check In',
          headerBackTitle: 'Spot',
          presentation: 'modal',
        }}
      />
      
      <Stack.Screen 
        name="NearbySkaters" 
        component={NearbySkatersScreen}
        options={{
          title: 'Nearby Skaters',
          headerBackTitle: 'Spot',
        }}
      />
    </Stack.Navigator>
  );
}
