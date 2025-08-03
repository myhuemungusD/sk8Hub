import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Types
interface ShopItem {
  itemId: string;
  name: string;
  brand: string;
  type: string;
  category: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  inStock: boolean;
  isHeroItem: boolean;
  isLimitedTime: boolean;
  availableUntil?: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

interface ItemDrop {
  itemId: string;
  dropDate: admin.firestore.Timestamp;
  isActive: boolean;
  rotationDuration: number;
  rarityWeight: number;
}

// Scheduled function to rotate shop items (runs every 6 hours)
export const rotateShopItems = functions.pubsub
  .schedule('0 */6 * * *') // Every 6 hours
  .timeZone('America/Los_Angeles')
  .onRun(async (context) => {
    console.log('Starting shop item rotation...');

    try {
      // 1. Deactivate expired drops
      await deactivateExpiredDrops();

      // 2. Create new drops based on rarity algorithm
      await createNewDrops();

      console.log('Shop item rotation completed successfully');
      return null;
    } catch (error) {
      console.error('Error during shop rotation:', error);
      throw new functions.https.HttpsError('internal', 'Rotation failed');
    }
  });

// HTTP function to manually trigger item drops (for testing/admin)
export const triggerItemDrop = functions.https.onCall(async (data, context) => {
  // Verify admin authentication in production
  // if (!context.auth?.token.admin) {
  //   throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  // }

  const { itemId, durationHours = 24 } = data;

  if (!itemId) {
    throw new functions.https.HttpsError('invalid-argument', 'itemId is required');
  }

  try {
    const dropId = await createDrop(itemId, durationHours);
    return { success: true, dropId };
  } catch (error) {
    console.error('Error creating drop:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create drop');
  }
});

// HTTP function to get shop statistics
export const getShopStats = functions.https.onCall(async (data, context) => {
  try {
    const stats = {
      totalItems: 0,
      activeDrops: 0,
      itemsByRarity: { Common: 0, Rare: 0, Epic: 0, Legendary: 0 },
      topSellingItems: [],
      lastUpdated: admin.firestore.Timestamp.now()
    };

    // Get total items
    const itemsSnapshot = await db.collection('shopItems').get();
    stats.totalItems = itemsSnapshot.size;

    // Count by rarity
    itemsSnapshot.docs.forEach(doc => {
      const item = doc.data() as ShopItem;
      stats.itemsByRarity[item.rarity]++;
    });

    // Get active drops
    const dropsSnapshot = await db.collection('itemDrops')
      .where('isActive', '==', true)
      .get();
    stats.activeDrops = dropsSnapshot.size;

    return stats;
  } catch (error) {
    console.error('Error getting shop stats:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get stats');
  }
});

// Function triggered when a user makes a purchase
export const onPurchase = functions.firestore
  .document('userInventory/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if items were added (purchase made)
    if (after.items.length > before.items.length) {
      const newItems = after.items.slice(before.items.length);
      
      for (const item of newItems) {
        // Log purchase for analytics
        await db.collection('purchaseHistory').add({
          userId: context.params.userId,
          itemId: item.itemId,
          price: item.price,
          purchasedAt: item.purchasedAt,
          timestamp: admin.firestore.Timestamp.now()
        });

        // Update item popularity metrics
        await updateItemPopularity(item.itemId);
      }
    }

    return null;
  });

// Helper function to deactivate expired drops
async function deactivateExpiredDrops(): Promise<void> {
  const now = admin.firestore.Timestamp.now();
  
  const activeDropsSnapshot = await db.collection('itemDrops')
    .where('isActive', '==', true)
    .get();

  const batch = db.batch();
  let deactivatedCount = 0;

  for (const dropDoc of activeDropsSnapshot.docs) {
    const drop = dropDoc.data() as ItemDrop;
    const expiryTime = new admin.firestore.Timestamp(
      drop.dropDate.seconds + (drop.rotationDuration * 3600), // Convert hours to seconds
      drop.dropDate.nanoseconds
    );

    if (now.seconds > expiryTime.seconds) {
      // Deactivate drop
      batch.update(dropDoc.ref, { isActive: false });

      // Remove from hero items
      const itemSnapshot = await db.collection('shopItems')
        .where('itemId', '==', drop.itemId)
        .get();

      itemSnapshot.docs.forEach(itemDoc => {
        batch.update(itemDoc.ref, {
          isHeroItem: false,
          isLimitedTime: false,
          availableUntil: admin.firestore.FieldValue.delete(),
          updatedAt: admin.firestore.Timestamp.now()
        });
      });

      deactivatedCount++;
    }
  }

  if (deactivatedCount > 0) {
    await batch.commit();
    console.log(`Deactivated ${deactivatedCount} expired drops`);
  }
}

// Helper function to create new drops
async function createNewDrops(): Promise<void> {
  // Get all available items (not currently hero items)
  const availableItemsSnapshot = await db.collection('shopItems')
    .where('isHeroItem', '==', false)
    .where('inStock', '==', true)
    .get();

  if (availableItemsSnapshot.empty) {
    console.log('No available items for drops');
    return;
  }

  const items = availableItemsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (ShopItem & { id: string })[];

  // Rarity-based selection algorithm
  const rarityWeights = {
    'Legendary': 0.05, // 5% chance
    'Epic': 0.15,      // 15% chance
    'Rare': 0.30,      // 30% chance
    'Common': 0.50     // 50% chance
  };

  // Determine how many drops to create (1-3 items)
  const numDrops = Math.floor(Math.random() * 3) + 1;
  const selectedItems: (ShopItem & { id: string })[] = [];

  for (let i = 0; i < numDrops && items.length > 0; i++) {
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    let targetRarity = 'Common';

    // Select rarity based on weights
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulativeWeight += weight;
      if (randomValue <= cumulativeWeight) {
        targetRarity = rarity;
        break;
      }
    }

    // Find items of target rarity
    const rarityItems = items.filter(item => 
      item.rarity === targetRarity && !selectedItems.includes(item)
    );

    if (rarityItems.length > 0) {
      const randomItem = rarityItems[Math.floor(Math.random() * rarityItems.length)];
      selectedItems.push(randomItem);

      // Create drop
      await createDrop(randomItem.itemId, 24); // 24-hour duration
    }
  }

  console.log(`Created ${selectedItems.length} new drops`);
}

// Helper function to create a single drop
async function createDrop(itemId: string, durationHours: number): Promise<string> {
  const batch = db.batch();

  // Create drop record
  const dropRef = db.collection('itemDrops').doc();
  const drop: ItemDrop = {
    itemId,
    dropDate: admin.firestore.Timestamp.now(),
    isActive: true,
    rotationDuration: durationHours,
    rarityWeight: Math.random()
  };
  batch.set(dropRef, drop);

  // Update item to be hero item
  const itemSnapshot = await db.collection('shopItems')
    .where('itemId', '==', itemId)
    .get();

  const availableUntil = admin.firestore.Timestamp.fromMillis(
    Date.now() + (durationHours * 60 * 60 * 1000)
  );

  itemSnapshot.docs.forEach(itemDoc => {
    batch.update(itemDoc.ref, {
      isHeroItem: true,
      isLimitedTime: true,
      availableUntil,
      updatedAt: admin.firestore.Timestamp.now()
    });
  });

  await batch.commit();
  return dropRef.id;
}

// Helper function to update item popularity
async function updateItemPopularity(itemId: string): Promise<void> {
  const popularityRef = db.collection('itemPopularity').doc(itemId);
  
  await db.runTransaction(async (transaction) => {
    const popularityDoc = await transaction.get(popularityRef);
    
    if (popularityDoc.exists) {
      const currentData = popularityDoc.data();
      transaction.update(popularityRef, {
        purchases: (currentData?.purchases || 0) + 1,
        lastPurchased: admin.firestore.Timestamp.now()
      });
    } else {
      transaction.set(popularityRef, {
        itemId,
        purchases: 1,
        lastPurchased: admin.firestore.Timestamp.now(),
        createdAt: admin.firestore.Timestamp.now()
      });
    }
  });
}

// Export all functions
export {
  onPurchase,
  getShopStats
};
