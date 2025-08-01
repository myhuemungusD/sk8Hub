/**
 * Auto Cleaner Utility
 * Provides automatic cleanup capabilities for the SkateHubba app
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CleanupConfig {
  enableMemoryCleanup: boolean;
  enableCacheCleanup: boolean;
  enableStorageCleanup: boolean;
  maxCacheAge: number; // in milliseconds
  maxStorageSize: number; // in bytes
  cleanupInterval: number; // in milliseconds
}

interface CleanupStats {
  lastCleanup: Date;
  itemsCleaned: number;
  memoryFreed: number;
  storageFreed: number;
}

class AutoCleaner {
  private config: CleanupConfig;
  private cleanupTimer?: ReturnType<typeof setInterval>;
  private stats: CleanupStats = {
    lastCleanup: new Date(),
    itemsCleaned: 0,
    memoryFreed: 0,
    storageFreed: 0
  };

  constructor(config: Partial<CleanupConfig> = {}) {
    this.config = {
      enableMemoryCleanup: true,
      enableCacheCleanup: true,
      enableStorageCleanup: true,
      maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
      maxStorageSize: 50 * 1024 * 1024, // 50MB
      cleanupInterval: 60 * 60 * 1000, // 1 hour
      ...config
    };

    this.startAutoCleanup();
  }

  private startAutoCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.performAutoCleanup();
    }, this.config.cleanupInterval);

    // Initial cleanup
    setTimeout(() => this.performAutoCleanup(), 5000);
  }

  private async performAutoCleanup() {
    console.log('🧹 Starting automatic cleanup...');
    
    try {
      let totalItemsCleaned = 0;
      let totalMemoryFreed = 0;
      let totalStorageFreed = 0;

      if (this.config.enableMemoryCleanup) {
        const memoryFreed = await this.cleanupMemory();
        totalMemoryFreed += memoryFreed;
      }

      if (this.config.enableCacheCleanup) {
        const { itemsCleaned, storageFreed } = await this.cleanupCache();
        totalItemsCleaned += itemsCleaned;
        totalStorageFreed += storageFreed;
      }

      if (this.config.enableStorageCleanup) {
        const { itemsCleaned, storageFreed } = await this.cleanupOldStorage();
        totalItemsCleaned += itemsCleaned;
        totalStorageFreed += storageFreed;
      }

      this.stats = {
        lastCleanup: new Date(),
        itemsCleaned: totalItemsCleaned,
        memoryFreed: totalMemoryFreed,
        storageFreed: totalStorageFreed
      };

      console.log(`✅ Cleanup completed: ${totalItemsCleaned} items, ${this.formatBytes(totalStorageFreed)} storage freed`);
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  private async cleanupMemory(): Promise<number> {
    // Force garbage collection if available
    if (global.gc) {
      const beforeMemory = this.getMemoryUsage();
      global.gc();
      const afterMemory = this.getMemoryUsage();
      const freed = beforeMemory - afterMemory;
      console.log(`🧠 Memory cleanup: ${this.formatBytes(freed)} freed`);
      return freed;
    }
    return 0;
  }

  private async cleanupCache(): Promise<{ itemsCleaned: number; storageFreed: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key: string) => 
        key.startsWith('cache_') || 
        key.startsWith('temp_') ||
        key.startsWith('image_cache_')
      );

      let itemsCleaned = 0;
      let storageFreed = 0;
      const now = Date.now();

      for (const key of cacheKeys) {
        try {
          const item = await AsyncStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            
            // Check if item has expired
            if (parsed.timestamp && (now - parsed.timestamp) > this.config.maxCacheAge) {
              await AsyncStorage.removeItem(key);
              itemsCleaned++;
              storageFreed += item.length;
            }
          }
        } catch (error) {
          // If we can't parse the item, it might be corrupted, so remove it
          await AsyncStorage.removeItem(key);
          itemsCleaned++;
        }
      }

      console.log(`🗂️ Cache cleanup: ${itemsCleaned} items removed, ${this.formatBytes(storageFreed)} freed`);
      return { itemsCleaned, storageFreed };
    } catch (error) {
      console.error('Cache cleanup failed:', error);
      return { itemsCleaned: 0, storageFreed: 0 };
    }
  }

  private async cleanupOldStorage(): Promise<{ itemsCleaned: number; storageFreed: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      let itemsCleaned = 0;
      let storageFreed = 0;

      // Calculate total storage size
      for (const key of keys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }

      // If we're over the limit, remove oldest items
      if (totalSize > this.config.maxStorageSize) {
        const itemsWithTimestamp: Array<{ key: string; timestamp: number; size: number }> = [];

        for (const key of keys) {
          try {
            const item = await AsyncStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              const timestamp = parsed.timestamp || 0;
              itemsWithTimestamp.push({
                key,
                timestamp,
                size: item.length
              });
            }
          } catch (error) {
            // Non-JSON items, assign old timestamp for cleanup
            const item = await AsyncStorage.getItem(key);
            itemsWithTimestamp.push({
              key,
              timestamp: 0,
              size: item?.length || 0
            });
          }
        }

        // Sort by timestamp (oldest first)
        itemsWithTimestamp.sort((a, b) => a.timestamp - b.timestamp);

        let currentSize = totalSize;
        for (const item of itemsWithTimestamp) {
          if (currentSize <= this.config.maxStorageSize) break;
          
          await AsyncStorage.removeItem(item.key);
          currentSize -= item.size;
          storageFreed += item.size;
          itemsCleaned++;
        }
      }

      console.log(`💾 Storage cleanup: ${itemsCleaned} items removed, ${this.formatBytes(storageFreed)} freed`);
      return { itemsCleaned, storageFreed };
    } catch (error) {
      console.error('Storage cleanup failed:', error);
      return { itemsCleaned: 0, storageFreed: 0 };
    }
  }

  private getMemoryUsage(): number {
    try {
      // Try to get memory usage if available
      if (Platform.OS === 'android' && (global as any).nativePerformanceNow) {
        // Android-specific memory usage (if available)
        return (performance as any).memory?.usedJSHeapSize || 0;
      }
    } catch (error) {
      // Ignore errors, return 0
    }
    return 0;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public async manualCleanup(): Promise<CleanupStats> {
    await this.performAutoCleanup();
    return this.getStats();
  }

  public getStats(): CleanupStats {
    return { ...this.stats };
  }

  public updateConfig(newConfig: Partial<CleanupConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.startAutoCleanup(); // Restart with new config
  }

  public async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key: string) => 
        key.startsWith('cache_') || 
        key.startsWith('temp_') ||
        key.startsWith('image_cache_')
      );
      
      await AsyncStorage.multiRemove(cacheKeys);
      console.log(`🗑️ Cleared all cache: ${cacheKeys.length} items removed`);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  public async getStorageInfo(): Promise<{ totalKeys: number; totalSize: string }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      }

      return {
        totalKeys: keys.length,
        totalSize: this.formatBytes(totalSize)
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalKeys: 0, totalSize: '0 Bytes' };
    }
  }

  public stop() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }
}

// Create a singleton instance
const cleaner = new AutoCleaner({
  enableMemoryCleanup: true,
  enableCacheCleanup: true,
  enableStorageCleanup: true,
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
  maxStorageSize: 50 * 1024 * 1024, // 50MB
  cleanupInterval: 30 * 60 * 1000 // 30 minutes
});

export default cleaner;
export { AutoCleaner, type CleanupConfig, type CleanupStats };
