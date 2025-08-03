import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface ShopItem {
  id: string;
  itemId: string;
  name: string;
  brand: string;
  type: 'deck' | 'wheels' | 'bearings' | 'trucks' | 'apparel' | 'accessories';
  category: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  image?: string;
  description?: string;
  inStock: boolean;
  isHeroItem: boolean;
  isLimitedTime: boolean;
  availableUntil?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserInventory {
  userId: string;
  items: InventoryItem[];
  hubbaBucks: number;
  lastUpdated: Timestamp;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  purchasedAt: Timestamp;
  price: number;
}

export interface ItemDrop {
  id: string;
  itemId: string;
  dropDate: Timestamp;
  isActive: boolean;
  rotationDuration: number; // hours
  rarityWeight: number;
}

// Shop Items Service
export class ShopService {
  private static itemsCollection = collection(db, 'shopItems');
  private static dropsCollection = collection(db, 'itemDrops');
  private static inventoryCollection = collection(db, 'userInventory');

  // Get all shop items
  static async getAllItems(): Promise<ShopItem[]> {
    try {
      const snapshot = await getDocs(this.itemsCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShopItem[];
    } catch (error) {
      console.error('Error fetching shop items:', error);
      return [];
    }
  }

  // Get hero items (featured/limited time)
  static async getHeroItems(): Promise<ShopItem[]> {
    try {
      const q = query(
        this.itemsCollection, 
        where('isHeroItem', '==', true),
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShopItem[];
    } catch (error) {
      console.error('Error fetching hero items:', error);
      return [];
    }
  }

  // Get items by category
  static async getItemsByCategory(category: string): Promise<ShopItem[]> {
    try {
      if (category === 'all') {
        return this.getAllItems();
      }
      
      const q = query(
        this.itemsCollection, 
        where('category', '==', category),
        where('inStock', '==', true),
        orderBy('rarity', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShopItem[];
    } catch (error) {
      console.error('Error fetching items by category:', error);
      return [];
    }
  }

  // Real-time listener for shop items
  static subscribeToShopItems(callback: (items: ShopItem[]) => void) {
    const q = query(this.itemsCollection, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShopItem[];
      callback(items);
    });
  }

  // Real-time listener for hero items
  static subscribeToHeroItems(callback: (items: ShopItem[]) => void) {
    const q = query(
      this.itemsCollection,
      where('isHeroItem', '==', true),
      where('inStock', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShopItem[];
      callback(items);
    });
  }

  // Add new item to shop (admin function)
  static async addItem(item: Omit<ShopItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.itemsCollection, {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  // Update item
  static async updateItem(itemId: string, updates: Partial<ShopItem>): Promise<void> {
    try {
      const itemRef = doc(this.itemsCollection, itemId);
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }
}

// User Inventory Service
export class InventoryService {
  private static inventoryCollection = collection(db, 'userInventory');

  // Get user inventory
  static async getUserInventory(userId: string): Promise<UserInventory | null> {
    try {
      const docRef = doc(this.inventoryCollection, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { 
          userId,
          items: data.items || [],
          hubbaBucks: data.hubbaBucks || 2000,
          lastUpdated: data.lastUpdated || Timestamp.now(),
          ...data
        } as UserInventory;
      }
      
      // Create new inventory for user
      const newInventory: UserInventory = {
        userId,
        items: [],
        hubbaBucks: 2000, // Starting amount
        lastUpdated: Timestamp.now()
      };
      
      await setDoc(docRef, newInventory);
      return newInventory;
    } catch (error) {
      console.error('Error getting user inventory:', error);
      return null;
    }
  }

  // Purchase item
  static async purchaseItem(userId: string, item: ShopItem): Promise<boolean> {
    try {
      const inventory = await this.getUserInventory(userId);
      if (!inventory || inventory.hubbaBucks < item.price) {
        return false;
      }

      // Update inventory
      const existingItem = inventory.items.find(i => i.itemId === item.itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        inventory.items.push({
          itemId: item.itemId,
          quantity: 1,
          purchasedAt: Timestamp.now(),
          price: item.price
        });
      }

      // Deduct hubba bucks
      inventory.hubbaBucks -= item.price;
      inventory.lastUpdated = Timestamp.now();

      // Save to Firestore
      const docRef = doc(this.inventoryCollection, userId);
      await setDoc(docRef, inventory);

      return true;
    } catch (error) {
      console.error('Error purchasing item:', error);
      return false;
    }
  }

  // Add hubba bucks
  static async addHubbaBucks(userId: string, amount: number): Promise<void> {
    try {
      const inventory = await this.getUserInventory(userId);
      if (inventory) {
        inventory.hubbaBucks += amount;
        inventory.lastUpdated = Timestamp.now();
        
        const docRef = doc(this.inventoryCollection, userId);
        await setDoc(docRef, inventory);
      }
    } catch (error) {
      console.error('Error adding hubba bucks:', error);
      throw error;
    }
  }
}

// Item Drop/Rotation Service
export class DropService {
  private static dropsCollection = collection(db, 'itemDrops');

  // Get active drops
  static async getActiveDrops(): Promise<ItemDrop[]> {
    try {
      const q = query(
        this.dropsCollection,
        where('isActive', '==', true),
        orderBy('dropDate', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ItemDrop[];
    } catch (error) {
      console.error('Error fetching active drops:', error);
      return [];
    }
  }

  // Create new drop rotation
  static async createDrop(itemId: string, durationHours: number = 24): Promise<string> {
    try {
      const drop: Omit<ItemDrop, 'id'> = {
        itemId,
        dropDate: Timestamp.now(),
        isActive: true,
        rotationDuration: durationHours,
        rarityWeight: Math.random() // Random weight for drop algorithm
      };

      const docRef = await addDoc(this.dropsCollection, drop);
      
      // Set the item as hero item and limited time
      await ShopService.updateItem(itemId, {
        isHeroItem: true,
        isLimitedTime: true,
        availableUntil: Timestamp.fromMillis(Date.now() + (durationHours * 60 * 60 * 1000))
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating drop:', error);
      throw error;
    }
  }

  // Deactivate expired drops
  static async deactivateExpiredDrops(): Promise<void> {
    try {
      const activeDrops = await this.getActiveDrops();
      const now = Timestamp.now();

      for (const drop of activeDrops) {
        const expiryTime = Timestamp.fromMillis(
          drop.dropDate.toMillis() + (drop.rotationDuration * 60 * 60 * 1000)
        );

        if (now.toMillis() > expiryTime.toMillis()) {
          // Deactivate drop
          const dropRef = doc(this.dropsCollection, drop.id);
          await updateDoc(dropRef, { isActive: false });

          // Remove from hero items
          await ShopService.updateItem(drop.itemId, {
            isHeroItem: false,
            isLimitedTime: false,
            availableUntil: undefined
          });
        }
      }
    } catch (error) {
      console.error('Error deactivating expired drops:', error);
    }
  }
}

// Initialize sample data (run once)
export async function initializeSampleData() {
  const sampleItems: Omit<ShopItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      itemId: 'koston1',
      name: "Koston 1's",
      brand: 'NIKE SB',
      type: 'apparel',
      category: 'apparel',
      price: 500,
      rarity: 'Rare',
      description: "Legendary Eric Koston signature shoes from Nike SB",
      inStock: true,
      isHeroItem: true,
      isLimitedTime: true
    },
    {
      itemId: 'hookups-deck',
      name: "Hook Ups Deck",
      brand: 'HOOK UPS',
      type: 'deck',
      category: 'deck',
      price: 1200,
      rarity: 'Legendary',
      description: "Rare Hook Ups skateboard deck from the 90s",
      inStock: true,
      isHeroItem: true,
      isLimitedTime: false
    },
    {
      itemId: 'baker-deck-1',
      name: 'Pro Model Deck',
      brand: 'BAKER',
      type: 'deck',
      category: 'deck',
      price: 65,
      rarity: 'Common',
      description: "Standard Baker skateboard deck",
      inStock: true,
      isHeroItem: false,
      isLimitedTime: false
    },
    {
      itemId: 'thrasher-tee',
      name: 'Classic Tee',
      brand: 'THRASHER',
      type: 'apparel',
      category: 'apparel',
      price: 25,
      rarity: 'Common',
      description: "Classic Thrasher magazine t-shirt",
      inStock: true,
      isHeroItem: false,
      isLimitedTime: false
    },
    {
      itemId: 'spitfire-wheels',
      name: 'Formula Four Wheels',
      brand: 'SPITFIRE',
      type: 'wheels',
      category: 'wheels',
      price: 45,
      rarity: 'Rare',
      description: "High performance skateboard wheels",
      inStock: true,
      isHeroItem: false,
      isLimitedTime: false
    }
  ];

  // Add items to Firestore
  for (const item of sampleItems) {
    try {
      await ShopService.addItem(item);
      console.log(`Added item: ${item.name}`);
    } catch (error) {
      console.error(`Error adding item ${item.name}:`, error);
    }
  }
}
