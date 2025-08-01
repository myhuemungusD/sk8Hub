# 🛹 SkateHubba

A React Native Expo app built with TypeScript, featuring integrated auto cleaning utilities.

## 🚀 Features

- **Auto Cleaner**: Automatic memory cleanup, cache management, and storage optimization
- **Maps Integration**: React Native Maps for location-based features
- **Navigation**: React Navigation for seamless app navigation
- **Firebase**: Firebase integration for backend services
- **TypeScript**: Full TypeScript support for type safety

## 📱 Auto Utilities

### AutoCleaner
- Automatic cache cleanup based on age
- Memory management and garbage collection
- Storage size management
- Manual cleanup triggers
- Real-time cleanup statistics

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `firebaseConfig.ts` with your Firebase project credentials
   - Replace placeholder values with actual Firebase config

## 🚦 Running the App

### Development
```bash
npm run start
# or
npx expo start
```

### Platform Specific
```bash
npm run android  # Android
npm run ios      # iOS (requires macOS)
npm run web      # Web
```

## 📁 Project Structure

```
SkateHubba/
├── utils/
│   ├── AutoCleaner.ts     # Auto cleaning utility
│   └── index.ts           # Utils exports
├── .github/
│   └── copilot-instructions.md  # Copilot configuration
├── .vscode/
│   └── tasks.json         # VS Code tasks
├── App.tsx                # Main app component
├── firebaseConfig.ts      # Firebase configuration
└── package.json           # Dependencies
```

## 🔧 Dependencies

### Core
- **Expo SDK 53**: React Native framework
- **TypeScript**: Type safety and development experience
- **React Navigation**: Navigation library
- **Firebase**: Backend services

### Utilities
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-maps**: Maps integration
- **expo-location**: Location services

## 🎯 Usage

### Auto Cleaner
```typescript
import AutoCleaner from './utils/AutoCleaner';

// Manual cleanup
const stats = await AutoCleaner.manualCleanup();

// Get storage info
const info = await AutoCleaner.getStorageInfo();

// Clear all cache
await AutoCleaner.clearAllCache();
```

## ⚙️ Configuration

### Debug Configuration
The auto debugger can be configured in development vs production:

```typescript
const debugger = new AutoDebugger({
  enableConsoleLogging: __DEV__,
  enableErrorTracking: true,
  enablePerformanceMonitoring: __DEV__,
  logLevel: __DEV__ ? 'debug' : 'error'
});
```

### Cleanup Configuration
The auto cleaner runs with these default settings:

```typescript
const cleaner = new AutoCleaner({
  enableMemoryCleanup: true,
  enableCacheCleanup: true,
  enableStorageCleanup: true,
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  maxStorageSize: 50 * 1024 * 1024, // 50MB
  cleanupInterval: 30 * 60 * 1000    // 30 minutes
});
```

## 🚨 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Copy your config from Project Settings
4. Update `firebaseConfig.ts` with your actual values:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🐛 Debugging

The app includes comprehensive debugging features:

- **Real-time error tracking**: Automatically captures and logs errors
- **Performance monitoring**: Measures function execution times
- **Memory management**: Tracks and optimizes memory usage
- **Storage analytics**: Monitors cache and storage utilization

## 📊 Monitoring

View real-time statistics in the app:
- Debug log counts by level
- Last cleanup timestamp
- Storage usage and item counts
- Memory optimization metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the auto debugger logs in the app
2. Review the console output
3. Check Firebase configuration
4. Ensure all dependencies are installed

---

Built with ❤️ using Expo and TypeScript
