import { useState, useEffect } from 'react';
import { ShopService, InventoryService, DropService, ShopItem, UserInventory, ItemDrop } from '../lib/shopService';

// Custom hook for shop items
export function useShopItems() {
  const [allItems, setAllItems] = useState<ShopItem[]>([]);
  const [heroItems, setHeroItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to all shop items
    const unsubscribeItems = ShopService.subscribeToShopItems((items) => {
      setAllItems(items);
      setLoading(false);
    });

    // Subscribe to hero items
    const unsubscribeHero = ShopService.subscribeToHeroItems((items) => {
      setHeroItems(items);
    });

    return () => {
      unsubscribeItems();
      unsubscribeHero();
    };
  }, []);

  const getItemsByCategory = (category: string) => {
    if (category === 'all') return allItems;
    return allItems.filter(item => item.category === category);
  };

  return {
    allItems,
    heroItems,
    loading,
    getItemsByCategory
  };
}

// Custom hook for user inventory
export function useInventory(userId: string | null) {
  const [inventory, setInventory] = useState<UserInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadInventory = async () => {
      try {
        setLoading(true);
        const userInventory = await InventoryService.getUserInventory(userId);
        setInventory(userInventory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [userId]);

  const purchaseItem = async (item: ShopItem): Promise<boolean> => {
    if (!userId || !inventory) return false;

    try {
      const success = await InventoryService.purchaseItem(userId, item);
      if (success) {
        // Update local state
        const updatedInventory = await InventoryService.getUserInventory(userId);
        setInventory(updatedInventory);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      return false;
    }
  };

  const addHubbaBucks = async (amount: number) => {
    if (!userId) return;

    try {
      await InventoryService.addHubbaBucks(userId, amount);
      const updatedInventory = await InventoryService.getUserInventory(userId);
      setInventory(updatedInventory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Hubba Bucks');
    }
  };

  return {
    inventory,
    loading,
    error,
    purchaseItem,
    addHubbaBucks,
    hubbaBucks: inventory?.hubbaBucks || 0
  };
}

// Custom hook for item drops
export function useItemDrops() {
  const [activeDrops, setActiveDrops] = useState<ItemDrop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrops = async () => {
      try {
        const drops = await DropService.getActiveDrops();
        setActiveDrops(drops);
      } catch (error) {
        console.error('Error loading drops:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDrops();

    // Check for expired drops every minute
    const interval = setInterval(async () => {
      await DropService.deactivateExpiredDrops();
      loadDrops();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const createDrop = async (itemId: string, durationHours: number = 24) => {
    try {
      await DropService.createDrop(itemId, durationHours);
      // Reload drops
      const drops = await DropService.getActiveDrops();
      setActiveDrops(drops);
    } catch (error) {
      console.error('Error creating drop:', error);
    }
  };

  return {
    activeDrops,
    loading,
    createDrop
  };
}
