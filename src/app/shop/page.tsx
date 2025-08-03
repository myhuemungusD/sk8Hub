'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShopItems, useInventory } from '../../hooks/useShop';
import { initializeSampleData, ShopItem } from '../../lib/shopService';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userId] = useState('demo-user-123'); // In a real app, get from auth
  const [isInitialized, setIsInitialized] = useState(false);

  // Firebase hooks
  const { allItems, heroItems, loading: itemsLoading } = useShopItems();
  const { purchaseItem, hubbaBucks, loading: inventoryLoading } = useInventory(userId);

  // Initialize sample data on first load (development only)
  useEffect(() => {
    const initData = async () => {
      if (!isInitialized && allItems.length === 0 && !itemsLoading) {
        try {
          await initializeSampleData();
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      }
    };

    initData();
  }, [allItems.length, itemsLoading, isInitialized]);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛹' },
    { id: 'deck', name: 'Decks', icon: '🛹' },
    { id: 'wheels', name: 'Wheels', icon: '⚪' },
    { id: 'bearings', name: 'Bearings', icon: '⚙️' },
    { id: 'apparel', name: 'Apparel', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '🎒' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedCategory);

  const handlePurchase = async (item: ShopItem) => {
    if (hubbaBucks >= item.price) {
      const success = await purchaseItem(item);
      if (success) {
        setShowModal(false);
        // Show success message or update UI
        alert(`Successfully purchased ${item.name}!`);
      } else {
        alert('Purchase failed. Please try again.');
      }
    } else {
      alert('Not enough Hubba Bucks!');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'border-gray-500/30';
      case 'Rare': return 'border-blue-500/30 shadow-blue-500/20';
      case 'Epic': return 'border-purple-500/30 shadow-purple-500/20';
      case 'Legendary': return 'border-orange-500/30 shadow-orange-500/20';
      default: return 'border-gray-500/30';
    }
  };

  if (itemsLoading || inventoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛹</div>
          <div className="text-orange-400 text-xl font-bold mb-2">Loading Sk8 Shop...</div>
          <div className="text-orange-300">Fetching the freshest gear</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Shop Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/shopbackground.png')`,
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-black/70 backdrop-blur-sm border-b border-orange-500/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
                ← Sk8Hub
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-orange-400 tracking-wider">
                SKATE SHOP
              </h1>
              <div className="text-orange-400 font-semibold">
                💰 {hubbaBucks} Hubba Bucks
              </div>
            </div>
          </div>
        </header>

        {/* Hero Items Carousel */}
        {heroItems.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
              🔥 LIMITED TIME DROPS
            </h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {heroItems.map((item) => (
                <div
                  key={item.id}
                  className={`min-w-[300px] bg-black/70 backdrop-blur-sm border rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer ${getRarityGlow(item.rarity)}`}
                  onClick={() => { setSelectedItem(item); setShowModal(true); }}
                >
                  <div className="h-48 bg-gradient-to-br from-orange-600/20 to-orange-800/20 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {item.category === 'deck' && '🛹'}
                      {item.category === 'wheels' && '⚪'}
                      {item.category === 'bearings' && '⚙️'}
                      {item.category === 'apparel' && '👕'}
                      {item.category === 'accessories' && '🎒'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-orange-400 text-sm font-semibold mb-1">
                      {item.brand}
                    </div>
                    <h3 className="text-white font-bold mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </span>
                      <span className="text-2xl font-bold text-orange-400">
                        💲{item.price}
                      </span>
                    </div>
                    {item.isLimitedTime && (
                      <div className="mt-2 text-red-400 text-sm font-semibold">
                        ⏰ Limited Time!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Category Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-black/60 text-orange-300 hover:bg-orange-500/20 border border-orange-500/30'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-black/70 backdrop-blur-sm border rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer ${getRarityGlow(item.rarity)}`}
                onClick={() => { setSelectedItem(item); setShowModal(true); }}
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-600/20 to-orange-800/20 flex items-center justify-center relative">
                  <div className="text-6xl opacity-50">
                    {item.category === 'deck' && '🛹'}
                    {item.category === 'wheels' && '⚪'}
                    {item.category === 'bearings' && '⚙️'}
                    {item.category === 'apparel' && '👕'}
                    {item.category === 'accessories' && '🎒'}
                  </div>
                  {item.rarity === 'Legendary' && (
                    <div className="absolute top-2 right-2 text-orange-400 text-xl">
                      ✨
                    </div>
                  )}
                  {item.rarity === 'Epic' && (
                    <div className="absolute top-2 right-2 text-purple-400 text-xl">
                      💎
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="text-orange-400 text-sm font-semibold mb-1">
                    {item.brand}
                  </div>
                  <h3 className="text-white font-bold mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold ${getRarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    <span className="text-2xl font-bold text-orange-400">
                      💲{item.price}
                    </span>
                  </div>
                  {!item.inStock && (
                    <div className="text-red-400 text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                  {item.isLimitedTime && (
                    <div className="text-red-400 text-sm font-semibold">
                      ⏰ Limited Time!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Brands Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-orange-400 text-center mb-8">
              FEATURED BRANDS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['BAKER', 'THRASHER', 'REAL', 'SUICIDAL'].map((brand) => (
                <div
                  key={brand}
                  className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 text-center hover:border-orange-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-2xl font-black text-orange-400 mb-2">
                    {brand}
                  </div>
                  <div className="text-orange-300 text-sm">
                    Premium Quality
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Info */}
          <div className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
              🏪 SHOP INFO
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-orange-400 font-semibold mb-2">📦 Free Shipping</div>
                <div className="text-orange-200 text-sm">On orders over $75</div>
              </div>
              <div>
                <div className="text-orange-400 font-semibold mb-2">🔄 Easy Returns</div>
                <div className="text-orange-200 text-sm">30-day return policy</div>
              </div>
              <div>
                <div className="text-orange-400 font-semibold mb-2">⚡ Fast Delivery</div>
                <div className="text-orange-200 text-sm">2-3 business days</div>
              </div>
            </div>
          </div>
        </main>

        {/* Purchase Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`bg-black/90 backdrop-blur-sm border rounded-lg p-6 max-w-md w-full ${getRarityGlow(selectedItem.rarity)}`}>
              <div className="text-center">
                <div className="h-32 bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-6xl opacity-70">
                    {selectedItem.category === 'deck' && '🛹'}
                    {selectedItem.category === 'wheels' && '⚪'}
                    {selectedItem.category === 'bearings' && '⚙️'}
                    {selectedItem.category === 'apparel' && '👕'}
                    {selectedItem.category === 'accessories' && '🎒'}
                  </div>
                </div>
                
                <div className="text-orange-400 text-sm font-semibold mb-1">
                  {selectedItem.brand}
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  {selectedItem.name}
                </h3>
                <div className={`font-bold mb-2 ${getRarityColor(selectedItem.rarity)}`}>
                  {selectedItem.rarity}
                </div>
                
                {selectedItem.description && (
                  <p className="text-orange-200 text-sm mb-4">
                    {selectedItem.description}
                  </p>
                )}
                
                <div className="text-3xl font-bold text-orange-400 mb-4">
                  💲{selectedItem.price}
                </div>
                
                <div className="text-orange-300 mb-6">
                  Your Hubba Bucks: 💰 {hubbaBucks}
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePurchase(selectedItem)}
                    disabled={!selectedItem.inStock || hubbaBucks < selectedItem.price}
                    className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                      selectedItem.inStock && hubbaBucks >= selectedItem.price
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!selectedItem.inStock 
                      ? 'Out of Stock' 
                      : hubbaBucks < selectedItem.price 
                        ? 'Not Enough Hubba Bucks'
                        : 'Buy Now'
                    }
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-6 rounded-full font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-black/70 backdrop-blur-sm border-t border-orange-500/30 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-orange-300">
              &copy; 2025 Sk8Hub Shop • Authentic skate gear powered by Firebase
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
