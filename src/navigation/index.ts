/**
 * Navigation Index
 * Centralized exports for all navigation components
 */

// Main navigation component
export { AppNavigation, navigate, goBack, navigationRef } from './AppNavigation';

// Individual navigators
export { RootNavigator } from './RootNavigator';
export { AuthNavigator } from './AuthNavigator';
export { TabNavigator } from './TabNavigator';
export { MapStackNavigator } from './MapStackNavigator';
export { BattleStackNavigator } from './BattleStackNavigator';
export { ShopStackNavigator } from './ShopStackNavigator';
export { ProfileStackNavigator } from './ProfileStackNavigator';

// Configuration
export * from './config';

// Types
export type * from '../types/navigation';

// Hooks
export * from '../hooks/useNavigation';
