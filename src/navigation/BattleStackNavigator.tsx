/**
 * Battle Stack Navigator
 * Handles SKATE battle-related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BattleStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

// Existing SkateScreen (we'll update it)
import SkateScreen from '../../screens/SkateScreen';

// Placeholder components
import { View, Text, StyleSheet } from 'react-native';

const BattleLobbyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Battle Lobby</Text>
    <Text>Choose opponent, start new battle</Text>
  </View>
);

const ActiveBattleScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Active Battle</Text>
    <Text>S-K-A-T-E battle in progress</Text>
  </View>
);

const BattleHistoryScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Battle History</Text>
    <Text>View past battles and results</Text>
  </View>
);

const RecordTrickScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Record Trick</Text>
    <Text>Record your trick video</Text>
  </View>
);

const BattleResultsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Battle Results</Text>
    <Text>You won/lost the battle!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<BattleStackParamList>();

export function BattleStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BattleHome"
      screenOptions={{
        ...SCREEN_OPTIONS.defaultHeader,
      }}
    >
      <Stack.Screen
        name="BattleHome"
        component={SkateScreen}
        options={{
          title: 'SKATE Battles',
        }}
      />

      <Stack.Screen
        name="BattleLobby"
        component={BattleLobbyScreen}
        options={{
          title: 'Start Battle',
          headerBackTitle: 'Battles',
        }}
      />

      <Stack.Screen
        name="ActiveBattle"
        component={ActiveBattleScreen}
        options={({ route }) => ({
          title: `vs ${route.params.opponentUsername}`,
          headerBackTitle: 'Battles',
          gestureEnabled: false, // Prevent accidental swipe back during battle
        })}
      />

      <Stack.Screen
        name="BattleHistory"
        component={BattleHistoryScreen}
        options={{
          title: 'Battle History',
          headerBackTitle: 'Battles',
        }}
      />

      <Stack.Screen
        name="RecordTrick"
        component={RecordTrickScreen}
        options={{
          title: 'Record Trick',
          headerBackTitle: 'Battle',
          presentation: 'fullScreenModal',
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="BattleResults"
        component={BattleResultsScreen}
        options={{
          title: 'Battle Complete',
          headerBackTitle: 'Battles',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
