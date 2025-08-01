/**
 * Navigation Configuration & Constants
 * Elite-level configuration for consistent navigation behavior
 */

import { Platform } from 'react-native';

// Animation configurations
export const NAVIGATION_ANIMATIONS = {
  // iOS-style slide from right
  slideFromRight: {
    cardStyleInterpolator: ({ current, layouts }: any) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  },

  // Bottom sheet style for modals
  modalPresentationIOS: {
    cardStyleInterpolator: ({ current, layouts }: any) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
              }),
            },
          ],
        },
      };
    },
  },

  // Fade in/out
  fade: {
    cardStyleInterpolator: ({ current }: any) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  },
};

// Screen options configurations
export const SCREEN_OPTIONS = {
  // Default header configuration
  defaultHeader: {
    headerStyle: {
      backgroundColor: '#FFFFFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1A1A1A',
    },
    headerTintColor: '#007AFF',
    headerBackTitleVisible: false,
  },

  // Transparent header for map
  transparentHeader: {
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTransparent: true,
    headerTitleStyle: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600' as const,
    },
    headerTintColor: '#FFFFFF',
  },

  // No header for full-screen experiences
  noHeader: {
    headerShown: false,
  },

  // Modal presentation
  modal: {
    presentation: 'modal' as const,
    headerShown: false,
    cardStyle: { backgroundColor: 'transparent' },
    cardOverlayEnabled: true,
  },
};

// Tab bar configuration
export const TAB_BAR_CONFIG = {
  style: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeTintColor: '#007AFF',
  inactiveTintColor: '#8E8E93',
  labelStyle: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  iconStyle: {
    marginBottom: 2,
  },
};

// Deep linking configuration
export const LINKING_CONFIG = {
  prefixes: ['skatehubba://', 'https://skatehubba.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: 'welcome',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          Onboarding: 'onboarding',
        },
      },
      Main: {
        screens: {
          MapStack: {
            screens: {
              MapHome: 'map',
              SpotDetails: 'spot/:spotId',
              CheckIn: 'checkin/:spotId',
              NearbySkaters: 'nearby/:spotId',
            },
          },
          BattleStack: {
            screens: {
              BattleHome: 'battles',
              BattleLobby: 'battle/lobby',
              ActiveBattle: 'battle/:battleId',
              BattleHistory: 'battle/history',
              RecordTrick: 'battle/:battleId/record',
              BattleResults: 'battle/:battleId/results',
            },
          },
          ShopStack: {
            screens: {
              ShopHome: 'shop',
              ItemDetails: 'shop/item/:itemId',
              Cart: 'shop/cart',
              Checkout: 'shop/checkout',
              PurchaseSuccess: 'shop/success/:itemId',
            },
          },
          ProfileStack: {
            screens: {
              ProfileHome: 'profile',
              Closet: 'profile/closet',
              EditProfile: 'profile/edit',
              Settings: 'profile/settings',
              Stats: 'profile/stats',
              Achievements: 'profile/achievements',
              GearDetails: 'profile/gear/:gearId',
            },
          },
        },
      },
      // Modal screens
      BattleInvite: 'invite/:fromUserId',
      SpotModal: 'spot-modal/:spotId',
      GearPreview: 'gear-preview/:gearId',
      VideoPlayer: 'video/:videoUri',
    },
  },
};

// Navigation timing constants
export const NAVIGATION_TIMING = {
  // Standard transition duration
  TRANSITION_DURATION: 300,

  // Quick transitions for tabs
  TAB_TRANSITION_DURATION: 150,

  // Modal presentation timing
  MODAL_TRANSITION_DURATION: 250,

  // Gesture response distances
  GESTURE_RESPONSE_DISTANCE: {
    horizontal: 50,
    vertical: 135,
  },
};

// Screen-specific configurations
export const SCREEN_CONFIGS = {
  // Screens where tab bar should be hidden
  HIDE_TAB_BAR: [
    'SpotDetails',
    'CheckIn',
    'ActiveBattle',
    'RecordTrick',
    'ItemDetails',
    'Checkout',
    'EditProfile',
    'GearDetails',
  ],

  // Screens that should have swipe gesture disabled
  DISABLE_SWIPE_BACK: ['ActiveBattle', 'RecordTrick', 'Checkout'],

  // Screens that should prevent back navigation
  PREVENT_BACK: ['BattleResults', 'PurchaseSuccess'],
};

// Icon mappings for tab bar
export const TAB_ICONS = {
  MapStack: {
    focused: 'map',
    unfocused: 'map-outline',
  },
  BattleStack: {
    focused: 'videocam',
    unfocused: 'videocam-outline',
  },
  ShopStack: {
    focused: 'storefront',
    unfocused: 'storefront-outline',
  },
  ProfileStack: {
    focused: 'person',
    unfocused: 'person-outline',
  },
} as const;
