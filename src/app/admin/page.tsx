'use client';

import { useState } from 'react';
import { useShopItems } from '../../hooks/useShop';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function AdminPanel() {
  const { allItems, loading } = useShopItems();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [dropDuration, setDropDuration] = useState(24);
  const [isCreatingDrop, setIsCreatingDrop] = useState(false);
  const [message, setMessage] = useState('');

  const functions = getFunctions();
  const triggerItemDrop = httpsCallable(functions, 'triggerItemDrop');
  const getShopStats = httpsCallable(functions, 'getShopStats');

  const handleCreateDrop = async () => {
    if (!selectedItemId) {
      setMessage('Please select an item');
      return;
    }

    setIsCreatingDrop(true);
    try {
      const result = await triggerItemDrop({
        itemId: selectedItemId,
        durationHours: dropDuration
      });
      
      setMessage(`Drop created successfully! Drop ID: ${result.data.dropId}`);
      setSelectedItemId('');
    } catch (error) {
      setMessage(`Error creating drop: ${error}`);
      console.error('Drop creation error:', error);
    } finally {
      setIsCreatingDrop(false);
    }
  };

  const handleGetStats = async () => {
    try {
      const result = await getShopStats();
      setMessage(`Shop Stats: ${JSON.stringify(result.data, null, 2)}`);
    } catch (error) {
      setMessage(`Error getting stats: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-400 mb-8 text-center">
          🛠️ Sk8Hub Admin Panel
        </h1>

        {/* Drop Creation */}
        <div className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Create Item Drop</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-orange-300 mb-2">Select Item:</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-orange-500/30 rounded-lg text-white"
              >
                <option value="">Choose an item...</option>
                {allItems.filter(item => !item.isHeroItem).map((item) => (
                  <option key={item.id} value={item.itemId}>
                    {item.brand} - {item.name} ({item.rarity})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-orange-300 mb-2">Duration (hours):</label>
              <input
                type="number"
                value={dropDuration}
                onChange={(e) => setDropDuration(parseInt(e.target.value))}
                min="1"
                max="168"
                className="w-full p-3 bg-gray-800 border border-orange-500/30 rounded-lg text-white"
              />
            </div>
          </div>
          
          <button
            onClick={handleCreateDrop}
            disabled={isCreatingDrop || !selectedItemId}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            {isCreatingDrop ? 'Creating Drop...' : 'Create Drop'}
          </button>
        </div>

        {/* Shop Stats */}
        <div className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Shop Statistics</h2>
          <button
            onClick={handleGetStats}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Get Shop Stats
          </button>
        </div>

        {/* Current Items */}
        <div className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Current Shop Items</h2>
          <div className="grid gap-4">
            {allItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border ${
                  item.isHeroItem 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-gray-600 bg-gray-800/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">
                      {item.brand} - {item.name}
                    </h3>
                    <p className="text-orange-300">
                      {item.rarity} • ${item.price} • {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.isHeroItem && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        HERO ITEM
                      </span>
                    )}
                    {item.isLimitedTime && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-2">
                        LIMITED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-black/70 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
            <h3 className="text-orange-400 font-bold mb-2">System Message:</h3>
            <pre className="text-orange-200 text-sm whitespace-pre-wrap">{message}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
