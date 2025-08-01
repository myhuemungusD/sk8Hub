/**
 * Root Navigator
 * Top-level navigation that handles auth flow and main app
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';

// Modal screens
import { View, Text, StyleSheet } from 'react-native';

const BattleInviteModal = () => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Battle Invitation</Text>
      <Text>You've been challenged to a SKATE battle!</Text>
    </View>
  </View>
);

const SpotModal = () => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Spot Quick View</Text>
      <Text>Spot details modal</Text>
    </View>
  </View>
);

const GearPreviewModal = () => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Gear Preview</Text>
      <Text>3D gear preview</Text>
    </View>
  </View>
);

const VideoPlayerModal = () => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Video Player</Text>
      <Text>Full-screen video player</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 300,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isAuthenticated: boolean;
}

export function RootNavigator({ isAuthenticated = false }: RootNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // Authentication Flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Main App Flow
        <Stack.Screen name="Main" component={TabNavigator} />
      )}

      {/* Modal Screens - Available in both authenticated and unauthenticated states */}
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <Stack.Screen name="BattleInvite" component={BattleInviteModal} />

        <Stack.Screen name="SpotModal" component={SpotModal} />

        <Stack.Screen name="GearPreview" component={GearPreviewModal} />
      </Stack.Group>

      {/* Full Screen Modals */}
      <Stack.Group
        screenOptions={{
          presentation: 'fullScreenModal',
          ...SCREEN_OPTIONS.noHeader,
        }}
      >
        <Stack.Screen name="VideoPlayer" component={VideoPlayerModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
