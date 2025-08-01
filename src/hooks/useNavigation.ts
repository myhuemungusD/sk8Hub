/**
 * Navigation Hooks
 * Elite-level hooks for type-safe navigation throughout the app
 */

import { useCallback, useEffect, useRef } from 'react';
import { 
  useNavigation, 
  useRoute, 
  useFocusEffect,
  useNavigationState,
  NavigationContainerRef
} from '@react-navigation/native';
import { BackHandler, Platform } from 'react-native';
import type { 
  RootStackParamList, 
  MainTabParamList,
  AuthStackParamList,
  NavigationProp 
} from '../types/navigation';

// Type-safe navigation hook for the root navigator
export function useAppNavigation() {
  return useNavigation<NavigationProp<keyof RootStackParamList>>();
}

// Hook for handling Android back button
export function useBackHandler(handler?: () => boolean, deps: any[] = []) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (handler) {
          return handler();
        }
        return false;
      });

      return () => backHandler.remove();
    }, deps)
  );
}

// Hook for preventing back navigation on critical screens
export function usePreventBack(prevent: boolean = true) {
  useBackHandler(() => prevent, [prevent]);
}

// Hook for tracking navigation state changes
export function useNavigationStateLogger() {
  const navigation = useAppNavigation();
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e: any) => {
      if (__DEV__) {
        console.log('Navigation state changed:', e.data.state);
      }
    });

    return unsubscribe;
  }, [navigation]);
}

// Hook for getting current route name
export function useCurrentRouteName() {
  return useNavigationState(state => {
    if (!state) return undefined;
    
    const getCurrentRouteName = (state: any): string => {
      if (!state.routes || state.index === undefined) return 'Unknown';
      
      const route = state.routes[state.index];
      if (route.state) {
        return getCurrentRouteName(route.state);
      }
      return route.name;
    };
    
    return getCurrentRouteName(state);
  });
}

// Hook for tab bar visibility control
export function useTabBarVisibility() {
  const navigation = useAppNavigation();
  const currentRoute = useCurrentRouteName();
  
  const hideTabBar = useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, [navigation]);
  
  const showTabBar = useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'flex',
        // Add your default tab bar styles here
      }
    });
  }, [navigation]);
  
  return { hideTabBar, showTabBar, currentRoute };
}

// Hook for handling deep links
export function useDeepLinkHandler() {
  const navigation = useAppNavigation();
  
  const handleBattleInvite = useCallback((fromUserId: string, fromUsername: string) => {
    navigation.navigate('BattleInvite', { fromUserId, fromUsername });
  }, [navigation]);
  
  const handleSpotDeepLink = useCallback((spotId: string) => {
    navigation.navigate('Main', {
      screen: 'MapStack',
      params: {
        screen: 'SpotDetails',
        params: { spotId, spotName: '', latitude: 0, longitude: 0 }
      }
    });
  }, [navigation]);
  
  const handleShopItemDeepLink = useCallback((itemId: string) => {
    navigation.navigate('Main', {
      screen: 'ShopStack',
      params: {
        screen: 'ItemDetails',
        params: { itemId, itemName: '', price: 0, rarity: 'common' }
      }
    });
  }, [navigation]);
  
  return {
    handleBattleInvite,
    handleSpotDeepLink,
    handleShopItemDeepLink,
  };
}

// Hook for screen analytics tracking
export function useScreenTracking(screenName?: string) {
  const route = useRoute();
  const actualScreenName = screenName || route.name;
  
  useFocusEffect(
    useCallback(() => {
      // Track screen view
      if (__DEV__) {
        console.log(`Screen viewed: ${actualScreenName}`);
      }
      
      // You can integrate with analytics services here
      // Analytics.trackScreenView(actualScreenName);
      
      const startTime = Date.now();
      
      return () => {
        const timeSpent = Date.now() - startTime;
        if (__DEV__) {
          console.log(`Time spent on ${actualScreenName}: ${timeSpent}ms`);
        }
        // Analytics.trackTimeSpent(actualScreenName, timeSpent);
      };
    }, [actualScreenName])
  );
}

// Hook for handling navigation refs (useful for navigation from outside React components)
export function useNavigationRef() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  
  const navigate = useCallback((name: keyof RootStackParamList, params?: any) => {
    if (navigationRef.current?.isReady()) {
      // @ts-ignore - Complex navigation typing requires this override
      navigationRef.current.navigate(name, params);
    }
  }, []);
  
  const goBack = useCallback(() => {
    if (navigationRef.current?.isReady() && navigationRef.current.canGoBack()) {
      navigationRef.current.goBack();
    }
  }, []);
  
  const reset = useCallback((routes: any) => {
    if (navigationRef.current?.isReady()) {
      navigationRef.current.reset(routes);
    }
  }, []);
  
  return {
    navigationRef,
    navigate,
    goBack,
    reset,
  };
}

// Hook for modal navigation
export function useModalNavigation() {
  const navigation = useAppNavigation();
  
  const presentModal = useCallback((
    screen: keyof RootStackParamList, 
    params?: any,
    options?: any
  ) => {
    navigation.navigate(screen, params);
  }, [navigation]);
  
  const dismissModal = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);
  
  return { presentModal, dismissModal };
}

// Hook for handling network-dependent navigation
export function useNetworkAwareNavigation() {
  const navigation = useAppNavigation();
  
  const navigateIfOnline = useCallback((
    screen: keyof RootStackParamList,
    params?: any,
    fallbackAction?: () => void
  ) => {
    // Check network status
    // if (isOnline) {
      navigation.navigate(screen, params);
    // } else {
    //   fallbackAction?.();
    // }
  }, [navigation]);
  
  return { navigateIfOnline };
}

// Hook for batch navigation operations
export function useBatchNavigation() {
  const navigation = useAppNavigation();
  
  const executeBatch = useCallback((operations: Array<() => void>) => {
    // Execute all navigation operations in sequence
    operations.forEach((operation, index) => {
      if (index === 0) {
        operation();
      } else {
        // Delay subsequent operations to ensure proper navigation stack
        setTimeout(operation, index * 100);
      }
    });
  }, []);
  
  return { executeBatch };
}
