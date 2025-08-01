/**
 * Shop Stack Navigator
 * Handles shopping and gear purchase flows
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '../types/navigation';
import { SCREEN_OPTIONS } from './config';

// Existing ShopScreen
import ShopScreen from '../../screens/ShopScreen';

// Placeholder components
import { View, Text, StyleSheet } from 'react-native';

const ItemDetailsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Item Details</Text>
    <Text>View item info, stats, purchase</Text>
  </View>
);

const CartScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Shopping Cart</Text>
    <Text>Review items before purchase</Text>
  </View>
);

const CheckoutScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Checkout</Text>
    <Text>Complete your purchase</Text>
  </View>
);

const PurchaseSuccessScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Purchase Complete!</Text>
    <Text>Item added to your closet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ShopHome"
      screenOptions={{
        ...SCREEN_OPTIONS.defaultHeader,
      }}
    >
      <Stack.Screen
        name="ShopHome"
        component={ShopScreen}
        options={{
          title: 'Shop',
          headerRight: () => (
            // You can add a cart icon here
            <View />
          ),
        }}
      />

      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={({ route }) => ({
          title: route.params.itemName || 'Item Details',
          headerBackTitle: 'Shop',
        })}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Cart',
          headerBackTitle: 'Shop',
        }}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerBackTitle: 'Cart',
          gestureEnabled: false, // Prevent accidental back during checkout
        }}
      />

      <Stack.Screen
        name="PurchaseSuccess"
        component={PurchaseSuccessScreen}
        options={{
          title: 'Success!',
          headerBackTitle: 'Shop',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
