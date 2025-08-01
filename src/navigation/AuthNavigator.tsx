/**
 * Auth Navigator
 * Handles authentication and onboarding flow
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

// Placeholder components - you'll replace these with actual screens
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to SkateHubba</Text>
    <Text>Choose Login or Register</Text>
  </View>
);

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
  </View>
);

const RegisterScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
  </View>
);

const ForgotPasswordScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Forgot Password</Text>
  </View>
);

const OnboardingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome! Set up your profile</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        ...SCREEN_OPTIONS.defaultHeader,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          ...SCREEN_OPTIONS.noHeader,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Welcome Back',
          headerBackTitle: 'Back',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Join SkateHubba',
          headerBackTitle: 'Back',
        }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          headerBackTitle: 'Login',
        }}
      />

      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          ...SCREEN_OPTIONS.noHeader,
          gestureEnabled: false, // Prevent swipe back during onboarding
        }}
      />
    </Stack.Navigator>
  );
}
