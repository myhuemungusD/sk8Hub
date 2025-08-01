/**
 * SkateHubba App
 * Elite-level React Native app with comprehensive navigation
 */

import React, { useEffect, useState } from 'react';
import { AppNavigation } from './src/navigation';
import AutoCleaner from './utils/AutoCleaner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Initialize app
    initializeApp();

    return () => {
      // Cleanup
      AutoCleaner.stop();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize utilities
      console.log('🛹 SkateHubba app starting...');

      // Check authentication status
      // const user = await checkAuthStatus();
      // setIsAuthenticated(!!user);

      // For development, set to false to see auth flow
      setIsAuthenticated(false);

      // App is ready
      setIsAppReady(true);

      console.log('🛹 SkateHubba app ready!');
    } catch (error) {
      console.error('App initialization failed:', error);
      setIsAppReady(true); // Still show app even if initialization fails
    }
  };

  const handleNavigationReady = () => {
    // Navigation is ready, can perform additional setup
    console.log('🧭 Navigation system ready');
  };

  if (!isAppReady) {
    // You can show a splash screen here
    return null;
  }

  return (
    <AppNavigation
      isAuthenticated={isAuthenticated}
      onNavigationReady={handleNavigationReady}
    />
  );
}
