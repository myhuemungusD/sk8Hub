/**
 * Navigation Type Definitions
 * Elite-level type safety for navigation throughout the app
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack Types
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Onboarding: {
    isFirstTime?: boolean;
  };
};

// Main Tab Types
export type MainTabParamList = {
  MapStack: NavigatorScreenParams<MapStackParamList>;
  BattleStack: NavigatorScreenParams<BattleStackParamList>;
  ShopStack: NavigatorScreenParams<ShopStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Map Stack Types
export type MapStackParamList = {
  MapHome: undefined;
  SpotDetails: {
    spotId: string;
    spotName: string;
    latitude: number;
    longitude: number;
  };
  CheckIn: {
    spotId: string;
  };
  NearbySkaters: {
    spotId: string;
  };
};

// Battle Stack Types
export type BattleStackParamList = {
  BattleHome: undefined;
  BattleLobby: undefined;
  ActiveBattle: {
    battleId: string;
    opponentId: string;
    opponentUsername: string;
  };
  BattleHistory: undefined;
  RecordTrick: {
    battleId: string;
    challenge?: string;
  };
  BattleResults: {
    battleId: string;
    won: boolean;
  };
};

// Shop Stack Types
export type ShopStackParamList = {
  ShopHome: undefined;
  ItemDetails: {
    itemId: string;
    itemName: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  Cart: undefined;
  Checkout: undefined;
  PurchaseSuccess: {
    itemId: string;
    itemName: string;
  };
};

// Profile Stack Types
export type ProfileStackParamList = {
  ProfileHome: undefined;
  Closet: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Stats: undefined;
  Achievements: undefined;
  GearDetails: {
    gearId: string;
    gearName: string;
    equipped: boolean;
  };
};

// Root Stack (contains main app flow)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  // Modal screens (presented over main app)
  BattleInvite: {
    fromUserId: string;
    fromUsername: string;
    spotId?: string;
  };
  SpotModal: {
    spotId: string;
  };
  GearPreview: {
    gearId: string;
  };
  VideoPlayer: {
    videoUri: string;
    title?: string;
  };
};

// Screen Props Types for type-safe navigation
export type AuthScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

export type MapScreenProps<T extends keyof MapStackParamList> = 
  NativeStackScreenProps<MapStackParamList, T>;

export type BattleScreenProps<T extends keyof BattleStackParamList> = 
  NativeStackScreenProps<BattleStackParamList, T>;

export type ShopScreenProps<T extends keyof ShopStackParamList> = 
  NativeStackScreenProps<ShopStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = 
  NativeStackScreenProps<ProfileStackParamList, T>;

export type RootScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// Combined navigation prop for screens that need access to multiple navigators
export type CompositeScreenProps<
  A extends Record<string, any>,
  B extends Record<string, any>
> = A & B;

// Utility type for getting navigation prop
export type NavigationProp<T extends keyof RootStackParamList> = 
  RootScreenProps<T>['navigation'];

// Tab bar visibility configuration
export type TabBarVisibilityConfig = {
  [K in keyof MainTabParamList]: {
    [Screen: string]: boolean;
  };
};
