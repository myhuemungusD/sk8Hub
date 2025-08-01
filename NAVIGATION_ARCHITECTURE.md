# 🧭 Elite Navigation Architecture - SkateHubba

## Overview

This is a production-ready, elite-level navigation architecture for React Native that provides:

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Scalability**: Modular structure that grows with your app
- **Performance**: Optimized navigation with lazy loading and proper memory management
- **Developer Experience**: Rich debugging, analytics, and development tools
- **Flexibility**: Supports complex navigation patterns, modals, and deep linking

## 🏗️ Architecture Overview

```
App.tsx
├── src/navigation/
│   ├── AppNavigation.tsx       // Main navigation container
│   ├── RootNavigator.tsx       // Root-level routing (auth vs main)
│   ├── AuthNavigator.tsx       // Authentication flow
│   ├── TabNavigator.tsx        // Main tab navigation
│   ├── MapStackNavigator.tsx   // Map-related screens
│   ├── BattleStackNavigator.tsx // Battle-related screens
│   ├── ShopStackNavigator.tsx  // Shop-related screens
│   ├── ProfileStackNavigator.tsx // Profile-related screens
│   ├── config.ts              // Navigation configuration
│   └── index.ts               // Centralized exports
├── src/types/
│   └── navigation.ts          // TypeScript type definitions
├── src/hooks/
│   └── useNavigation.ts       // Custom navigation hooks
└── src/components/
    └── NavigationDemo.tsx     // Demo component showing usage
```

## 🎯 Key Features

### 1. **Type-Safe Navigation**
```typescript
// Fully typed navigation with IntelliSense
navigation.navigate('Main', {
  screen: 'MapStack',
  params: {
    screen: 'SpotDetails',
    params: {
      spotId: string,
      spotName: string,
      latitude: number,
      longitude: number
    }
  }
});
```

### 2. **Modular Stack Navigators**
Each feature has its own stack navigator:
- **MapStack**: Map, spot details, check-ins
- **BattleStack**: SKATE battles, recording, results
- **ShopStack**: Shopping, item details, checkout
- **ProfileStack**: Profile, closet, settings

### 3. **Modal System**
```typescript
// Present modals over the entire app
navigation.navigate('BattleInvite', {
  fromUserId: 'user123',
  fromUsername: 'ProSkater'
});
```

### 4. **Custom Hooks**
```typescript
// Rich hooks for common navigation patterns
const { hideTabBar, showTabBar } = useTabBarVisibility();
const currentRoute = useCurrentRouteName();
useBackHandler(() => { /* custom back logic */ });
```

### 5. **Deep Linking Ready**
```typescript
// Automatic deep linking support
https://skatehubba.app/spot/venice-beach
https://skatehubba.app/battle/abc123
https://skatehubba.app/shop/item/deck-001
```

## 🚀 Usage Examples

### Basic Navigation
```typescript
import { useAppNavigation } from '../src/navigation';

function MyComponent() {
  const navigation = useAppNavigation();
  
  const goToSpot = () => {
    navigation.navigate('Main', {
      screen: 'MapStack',
      params: {
        screen: 'SpotDetails',
        params: { spotId: 'spot123', spotName: 'Venice Beach' }
      }
    });
  };
}
```

### Modal Presentation
```typescript
const presentBattleInvite = () => {
  navigation.navigate('BattleInvite', {
    fromUserId: 'user123',
    fromUsername: 'SkaterPro'
  });
};
```

### Tab Bar Control
```typescript
const { hideTabBar, showTabBar } = useTabBarVisibility();

// Hide tab bar for immersive experience
hideTabBar();

// Show it back
showTabBar();
```

### Programmatic Navigation (Outside React)
```typescript
import { navigate } from '../src/navigation';

// Call from anywhere in your app
function handlePushNotification(spotId: string) {
  navigate('Main', {
    screen: 'MapStack',
    params: {
      screen: 'SpotDetails',
      params: { spotId }
    }
  });
}
```

## 🎨 Styling & Configuration

### Centralized Configuration
All navigation styling and behavior is configured in `src/navigation/config.ts`:

```typescript
export const SCREEN_OPTIONS = {
  defaultHeader: {
    headerStyle: { backgroundColor: '#FFFFFF' },
    headerTitleStyle: { fontSize: 18, fontWeight: '600' },
    headerTintColor: '#007AFF',
  },
  transparentHeader: {
    headerTransparent: true,
    headerStyle: { backgroundColor: 'transparent' },
  },
  modal: {
    presentation: 'modal',
    headerShown: false,
  }
};
```

### Tab Bar Customization
```typescript
export const TAB_BAR_CONFIG = {
  style: {
    backgroundColor: '#FFFFFF',
    height: Platform.OS === 'ios' ? 88 : 68,
    // ... custom styling
  },
  activeTintColor: '#007AFF',
  inactiveTintColor: '#8E8E93',
};
```

## 🔧 Advanced Features

### 1. **Screen Analytics Tracking**
```typescript
// Automatic screen tracking
useScreenTracking('CustomScreenName');

// Built into navigation state changes
onStateChange={async () => {
  await analytics().logScreenView({
    screen_name: currentRouteName,
  });
}}
```

### 2. **Network-Aware Navigation**
```typescript
const { navigateIfOnline } = useNetworkAwareNavigation();

navigateIfOnline('ShopStack', params, () => {
  // Fallback for offline
  showOfflineMessage();
});
```

### 3. **Batch Operations**
```typescript
const { executeBatch } = useBatchNavigation();

executeBatch([
  () => navigation.reset(/* new state */),
  () => navigation.navigate('Profile'),
  () => updateUserContext(),
]);
```

### 4. **Custom Back Handling**
```typescript
// Per-screen back button handling
useBackHandler(() => {
  if (hasUnsavedChanges) {
    showSaveDialog();
    return true; // Prevent default back
  }
  return false; // Allow default back
});
```

## 🎯 MVP Implementation Priority

### Phase 1: Core Navigation (✅ Complete)
- [x] Auth flow (Welcome → Login → Onboarding)
- [x] Main tab navigation
- [x] Basic stack navigators
- [x] Type definitions

### Phase 2: Feature-Specific Flows
- [ ] Map screen with real map integration
- [ ] Battle flow with video recording
- [ ] Shop with purchase flow
- [ ] Profile with gear management

### Phase 3: Advanced Features
- [ ] Push notification deep linking
- [ ] Offline navigation handling
- [ ] Advanced animations
- [ ] Analytics integration

## 🛠️ Development Guidelines

### Adding New Screens
1. **Define types** in `src/types/navigation.ts`
2. **Add to appropriate stack** navigator
3. **Create screen component** with proper typing
4. **Update configuration** if needed

Example:
```typescript
// 1. Add to type definition
export type MapStackParamList = {
  // ... existing screens
  NewMapScreen: {
    customParam: string;
  };
};

// 2. Add to MapStackNavigator.tsx
<Stack.Screen 
  name="NewMapScreen" 
  component={NewMapScreen}
  options={{
    title: 'New Map Feature',
  }}
/>

// 3. Create component with proper typing
type Props = MapScreenProps<'NewMapScreen'>;

function NewMapScreen({ route, navigation }: Props) {
  const { customParam } = route.params;
  // ... component logic
}
```

### Adding Modals
```typescript
// 1. Add to RootStackParamList
export type RootStackParamList = {
  // ... existing screens
  NewModal: {
    modalParam: string;
  };
};

// 2. Add to RootNavigator.tsx modal group
<Stack.Screen 
  name="NewModal" 
  component={NewModalComponent}
/>

// 3. Present from anywhere
navigation.navigate('NewModal', { modalParam: 'value' });
```

## 🔍 Debugging & Testing

### Navigation State Logging
All navigation state changes are automatically logged in development:
```
🧭 Navigation ready. Initial route: Welcome
🧭 Route changed: Welcome -> Login
🧭 Route changed: Login -> MapHome
```

### Testing Navigation
```typescript
import { navigationRef } from '../src/navigation';

// Test navigation in unit tests
test('navigates to correct screen', () => {
  navigationRef.navigate('MapStack', {
    screen: 'SpotDetails',
    params: { spotId: 'test' }
  });
  
  expect(navigationRef.getCurrentRoute()?.name).toBe('SpotDetails');
});
```

## 🚀 Performance Optimizations

### 1. **Lazy Loading**
Stack navigators automatically lazy-load screens, improving startup time.

### 2. **Memory Management**
Integrated with your existing AutoCleaner utility for optimal memory usage.

### 3. **Gesture Optimization**
```typescript
// Disable gestures on critical screens
<Stack.Screen 
  options={{
    gestureEnabled: false // Prevents accidental navigation
  }}
/>
```

### 4. **Tab Bar Optimization**
Dynamic tab bar visibility prevents unnecessary renders.

## 🎉 Benefits of This Architecture

1. **Type Safety**: Catch navigation errors at compile time
2. **Scalability**: Easy to add new features and screens
3. **Maintainability**: Centralized configuration and modular structure
4. **Performance**: Optimized for React Native best practices
5. **Developer Experience**: Rich debugging and development tools
6. **Future-Proof**: Supports advanced patterns and integrations

## 🔄 Migration Guide

To integrate this with your existing screens:

1. **Update imports** to use new navigation hooks
2. **Replace basic navigation** calls with typed versions
3. **Move screen-specific logic** to appropriate stack navigators
4. **Add type annotations** to existing components

Your existing AutoCleaner and other utilities are fully compatible and integrated!

---

This navigation architecture provides a solid foundation for your SkateHubba MVP and scales seamlessly as you add new features. The type safety and modular structure will accelerate development while maintaining code quality.
