/**
 * Tab Navigator
 * Main tab navigation for authenticated users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types/navigation';
import { TAB_BAR_CONFIG, TAB_ICONS } from './config';

// Import stack navigators
import { MapStackNavigator } from './MapStackNavigator';
import { BattleStackNavigator } from './BattleStackNavigator';
import { ShopStackNavigator } from './ShopStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MapStack"
      screenOptions={({ route }) => ({
        headerShown: false, // Let individual stacks handle their headers
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'MapStack':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'BattleStack':
              iconName = focused ? 'videocam' : 'videocam-outline';
              break;
            case 'ShopStack':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'ProfileStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: TAB_BAR_CONFIG.style,
        tabBarActiveTintColor: TAB_BAR_CONFIG.activeTintColor,
        tabBarInactiveTintColor: TAB_BAR_CONFIG.inactiveTintColor,
        tabBarLabelStyle: TAB_BAR_CONFIG.labelStyle,
        tabBarIconStyle: TAB_BAR_CONFIG.iconStyle,
      })}
    >
      <Tab.Screen
        name="MapStack"
        component={MapStackNavigator}
        options={{
          title: 'Map',
          tabBarLabel: 'Map',
        }}
      />

      <Tab.Screen
        name="BattleStack"
        component={BattleStackNavigator}
        options={{
          title: 'SKATE',
          tabBarLabel: 'SKATE',
        }}
      />

      <Tab.Screen
        name="ShopStack"
        component={ShopStackNavigator}
        options={{
          title: 'Shop',
          tabBarLabel: 'Shop',
          tabBarBadge: undefined, // You can add badge for new items
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
