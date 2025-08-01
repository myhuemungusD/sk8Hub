import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AutoCleaner from './utils/AutoCleaner';

export default function App() {
  const [cleanupStats, setCleanupStats] = useState<any>(null);

  useEffect(() => {
    // Initialize utilities
    console.log('SkateHubba app started');
    
    // Get initial stats
    updateStats();
    
    // Set up periodic stats update
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(interval);
      AutoCleaner.stop();
    };
  }, []);

  const updateStats = async () => {
    try {
      const cleanup = AutoCleaner.getStats();
      const storage = await AutoCleaner.getStorageInfo();
      
      setCleanupStats({ ...cleanup, storage });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  const performManualCleanup = async () => {
    try {
      console.log('Manual cleanup triggered');
      const stats = await AutoCleaner.manualCleanup();
      setCleanupStats({ ...stats, storage: await AutoCleaner.getStorageInfo() });
      Alert.alert('Cleanup Complete', `Cleaned ${stats.itemsCleaned} items`);
    } catch (error) {
      console.error('Manual cleanup failed:', error);
      Alert.alert('Cleanup Failed', 'Please try again later');
    }
  };

  const showAppInfo = () => {
    Alert.alert(
      'SkateHubba Info', 
      'React Native app with AutoCleaner utility\n\n• Automatic cache cleanup\n• Memory management\n• Storage optimization'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛹 SkateHubba</Text>
      <Text style={styles.subtitle}>React Native App with Auto Utils</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 System Stats</Text>
        
        {cleanupStats && (
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Last Cleanup:</Text>
            <Text style={styles.statValue}>
              {new Date(cleanupStats.lastCleanup).toLocaleTimeString()}
            </Text>
            <Text style={styles.statValue}>
              Storage: {cleanupStats.storage?.totalSize} ({cleanupStats.storage?.totalKeys} items)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={performManualCleanup}>
          <Text style={styles.buttonText}>🧹 Manual Cleanup</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={showAppInfo}>
          <Text style={styles.buttonText}>ℹ️ App Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={updateStats}>
          <Text style={styles.buttonText}>🔄 Refresh Stats</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statBlock: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    color: '#777',
    marginLeft: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
