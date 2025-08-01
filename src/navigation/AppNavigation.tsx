/**
 * App Navigation Container
 * Elite-level navigation setup with all configurations
 */

import React, { useRef, useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../types/navigation';
import { RootNavigator } from './RootNavigator';
import { LINKING_CONFIG } from './config';

// Navigation reference for programmatic navigation
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Function to navigate from outside React components
export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore - Complex navigation typing
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

interface AppNavigationProps {
  isAuthenticated?: boolean;
  onNavigationReady?: () => void;
}

export function AppNavigation({ 
  isAuthenticated = false, 
  onNavigationReady 
}: AppNavigationProps) {
  // Track navigation state for analytics/debugging
  const routeNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Any initialization logic
    if (__DEV__) {
      console.log('🧭 Navigation system initialized');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        linking={LINKING_CONFIG}
        onReady={() => {
          // Get initial route name
          const currentRouteName = navigationRef.getCurrentRoute()?.name;
          routeNameRef.current = currentRouteName;
          
          if (__DEV__) {
            console.log('🧭 Navigation ready. Initial route:', currentRouteName);
          }
          
          onNavigationReady?.();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute()?.name;

          if (previousRouteName !== currentRouteName) {
            // Track screen changes for analytics
            if (__DEV__) {
              console.log('🧭 Route changed:', previousRouteName, '->', currentRouteName);
            }
            
            // You can integrate analytics here:
            // await analytics().logScreenView({
            //   screen_name: currentRouteName,
            //   screen_class: currentRouteName,
            // });
          }

          // Save the current route name for next change
          routeNameRef.current = currentRouteName;
        }}
        fallback={null} // You can add a loading component here
      >
        <RootNavigator isAuthenticated={isAuthenticated} />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Export navigation utilities
export { useAppNavigation, useBackHandler, useTabBarVisibility } from '../hooks/useNavigation';
export type { 
  RootStackParamList, 
  MainTabParamList,
  AuthStackParamList,
  MapStackParamList,
  BattleStackParamList,
  ShopStackParamList,
  ProfileStackParamList 
} from '../types/navigation';
