# SkateHubba - React Native App with Auto Utilities

This is a React Native Expo project built with TypeScript that includes:

## Core Features

- **Auto Cleaner**: Automatic memory cleanup, cache management, and storage optimization
- **Maps Integration**: React Native Maps for location-based features
- **Navigation**: React Navigation for app navigation
- **Firebase**: Firebase integration for backend services

## Project Structure

- `/utils/` - Contains AutoCleaner utility
- `App.tsx` - Main application component with integrated AutoCleaner
- Auto cleaner utility is initialized on app startup and runs continuously

## Development Guidelines

1. Always use TypeScript for type safety
2. Use console.log, console.error for debugging (standard React Native debugging)
3. The AutoCleaner runs automatically but manual cleanup can be triggered
4. Follow React Native best practices for performance
5. Use proper error handling with try-catch blocks

## Auto Cleaner Usage

- **AutoCleaner**: Runs automatically, provides cleanup stats and manual cleanup options
- Use `AutoCleaner.manualCleanup()` for manual cleanup
- Use `AutoCleaner.getStorageInfo()` for storage statistics

## Dependencies

- Expo SDK 53
- React Native Maps
- React Navigation
- Firebase
- AsyncStorage for local storage management
