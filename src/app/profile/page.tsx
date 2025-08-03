'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Settings,
  Shirt,
  Upload,
  Star,
  Crown,
  CheckCircle,
  Home,
  Map,
  Users,
  User,
  EyeOff,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

const tabs = [
  { key: 'closet', label: 'Closet' },
  { key: 'stats', label: 'Stats' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'badges', label: 'Badges' },
  { key: 'trade', label: 'Trade' },
];

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  badges: string[];
  verified: boolean;
  xp: number;
  xpMax: number;
  closet: Array<{
    name: string;
    type: string;
    imageUrl?: string;
  }>;
  stats: {
    tricks: Array<{ name: string; count: number }>;
    spots: number;
    wins: number;
    losses: number;
    streaks: string[];
  };
  sessions: Array<{
    id: string;
    thumbUrl?: string;
  }>;
  badgesList: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  trades: Array<{
    id: string;
    item: string;
    status: string;
  }>;
}

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState('closet');
  const [ghostMode, setGhostMode] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - replace with actual API call
  useEffect(() => {
    const mockUser: UserProfile = {
      id: 'SK8R_2024_001',
      username: 'SkateKing',
      avatarUrl: '/placeholder-avatar.jpg',
      badges: ['Pro', 'Verified'],
      verified: true,
      xp: 750,
      xpMax: 1000,
      closet: [
        { name: 'Element Deck', type: 'Skateboard', imageUrl: '/gear1.jpg' },
        { name: 'Vans Sk8-Hi', type: 'Shoes', imageUrl: '/gear2.jpg' },
        { name: 'Thrasher Hoodie', type: 'Clothing', imageUrl: '/gear3.jpg' },
        {
          name: 'Independent Trucks',
          type: 'Hardware',
          imageUrl: '/gear4.jpg',
        },
      ],
      stats: {
        tricks: [
          { name: 'Kickflip', count: 42 },
          { name: 'Heelflip', count: 28 },
          { name: '360 Flip', count: 15 },
          { name: 'Hardflip', count: 8 },
        ],
        spots: 12,
        wins: 8,
        losses: 3,
        streaks: ['5-day streak', 'Trick master', 'Spot explorer'],
      },
      sessions: [
        { id: '1', thumbUrl: '/session1.jpg' },
        { id: '2', thumbUrl: '/session2.jpg' },
        { id: '3', thumbUrl: '/session3.jpg' },
        { id: '4', thumbUrl: '/session4.jpg' },
        { id: '5', thumbUrl: '/session5.jpg' },
        { id: '6', thumbUrl: '/session6.jpg' },
      ],
      badgesList: [
        { id: '1', name: 'Pro', icon: 'crown' },
        { id: '2', name: 'Veteran', icon: 'star' },
        { id: '3', name: 'Spot Master', icon: 'map' },
      ],
      trades: [
        { id: '1', item: 'Vintage Powell Deck', status: 'Active' },
        { id: '2', item: 'Bones Swiss Bearings', status: 'Pending' },
      ],
    };

    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">Profile not found!</h2>
        </div>
      </div>
    );
  }

  // Tab Content Components
  const renderCloset = () => (
    <div className="p-5 pb-20">
      <h3 className="text-2xl text-white font-bold mb-4">Your Gear Closet</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {user.closet.map((item, i) => (
          <div key={i} className="text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-lg mx-auto mb-2 border-2 border-gray-600 overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600"></div>
              )}
            </div>
            <p className="text-white font-semibold text-sm">{item.name}</p>
            <p className="text-gray-400 text-xs">{item.type}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button className="bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-white">
          <Shirt size={18} />
          Change Outfit
        </button>
        <button className="bg-gray-800/80 backdrop-blur-sm border border-yellow-500 px-4 py-2 rounded-lg flex items-center gap-2 text-yellow-500">
          <Star size={18} />
          Flex
        </button>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="p-5">
      <h3 className="text-2xl text-white font-bold mb-4">Stats</h3>
      <div className="mb-4">
        <h4 className="text-cyan-400 font-bold mb-2">Tricks Landed</h4>
        {user.stats.tricks.map((trick, i) => (
          <p key={i} className="text-white ml-2 mb-1">
            {trick.name} x{trick.count}
          </p>
        ))}
      </div>
      <p className="text-cyan-400 font-bold mb-2">
        Spots Skated:{' '}
        <span className="text-yellow-500">{user.stats.spots}</span>{' '}
        <span className="text-cyan-400 underline text-sm cursor-pointer">
          View all
        </span>
      </p>
      <p className="text-cyan-400 font-bold mb-2">
        Wins / Losses in SKATE:{' '}
        <span className="text-cyan-400">{user.stats.wins}</span> /{' '}
        <span className="text-red-400">{user.stats.losses}</span>
      </p>
      <div className="mb-4">
        <h4 className="text-cyan-400 font-bold mb-2">Streaks</h4>
        {user.stats.streaks.map((streak, i) => (
          <p key={i} className="text-white ml-2 mb-1">
            {streak}
          </p>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="p-5">
      <h3 className="text-2xl text-white font-bold mb-4">Sessions</h3>
      <div className="flex justify-between items-center mb-4">
        <button className="bg-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 text-white">
          <Upload size={18} />
          Upload Clip
        </button>
        <div className="flex items-center gap-2">
          <span className="text-white">Public</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-400"></div>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {user.sessions.map(session => (
          <div
            key={session.id}
            className="aspect-square bg-gray-700 rounded-lg overflow-hidden"
          >
            {session.thumbUrl ? (
              <Image
                src={session.thumbUrl}
                alt="Session"
                width={120}
                height={120}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="p-5">
      <h3 className="text-2xl text-white font-bold mb-4">Trophy Case</h3>
      <div className="flex overflow-x-auto gap-6 pb-4">
        {user.badgesList.map(badge => (
          <div key={badge.id} className="text-center min-w-0 flex-shrink-0">
            <div className="text-yellow-500 mb-2 flex justify-center">
              <Star size={32} />
            </div>
            <p className="text-yellow-500 text-sm font-semibold">
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrade = () => (
    <div className="p-5">
      <h3 className="text-2xl text-white font-bold mb-4">Trade Zone</h3>
      {user.trades.map(trade => (
        <div
          key={trade.id}
          className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg mb-3 flex justify-between items-center"
        >
          <span className="text-white font-semibold">{trade.item}</span>
          <span className="text-cyan-400 font-semibold">{trade.status}</span>
        </div>
      ))}
      <button className="mt-4 border border-cyan-400 px-4 py-2 rounded-lg flex items-center gap-2 text-cyan-400 mx-auto">
        <RefreshCw size={18} />
        Trade Offers
      </button>
    </div>
  );

  return (
    <div 
      className="min-h-screen pt-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/profilebackground.png')", // Using the correct filename without space
        backgroundColor: '#1a1a1a', // Fallback color if image doesn't load
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-full z-50 hover:bg-gray-700/80 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </Link>

        {/* Ghost Mode Toggle */}
        <div className="absolute top-4 left-16 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 z-50">
          <EyeOff size={18} className="text-white mr-2" />
          <span className="text-white text-sm mr-2">Ghost Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={ghostMode}
              onChange={e => setGhostMode(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-400"></div>
          </label>
        </div>

        {/* Top Profile Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm border-b-2 border-gray-700 text-center py-6 mb-2 relative">
        {/* Settings Button */}
        <button className="absolute top-2 right-4">
          <Settings size={24} className="text-white" />
        </button>

        {/* Avatar */}
        <div className="border-4 border-cyan-400 rounded-full p-2 inline-block mb-2 bg-gray-700">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-cyan-400/20">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cyan-400/20"></div>
            )}
          </div>
        </div>

        {/* Username and Badges */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-white text-2xl font-bold">{user.username}</h2>
          {user.badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center bg-gray-700 rounded-lg px-2 py-1"
            >
              <Crown size={14} className="text-yellow-500 mr-1" />
              <span className="text-yellow-500 text-xs font-semibold">
                {badge}
              </span>
            </div>
          ))}
        </div>

        {/* Player ID and Verification */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-gray-400 text-sm">{user.id}</span>
          {user.verified && <CheckCircle size={16} className="text-cyan-400" />}
        </div>

        {/* XP Progress Bar */}
        <div className="w-2/3 h-3 bg-gray-600 rounded-full overflow-hidden mx-auto border border-gray-700">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${(user.xp / user.xpMax) * 100}%` }}
          ></div>
        </div>
      </div>

        {/* Tabs */}
        <div className="bg-gray-700/80 backdrop-blur-sm border-b border-gray-600 py-1">
        <div className="flex overflow-x-auto px-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-5 py-2 rounded-lg mr-2 font-semibold whitespace-nowrap ${
                selectedTab === tab.key
                  ? 'bg-gray-800/80 backdrop-blur-sm border border-cyan-400 text-cyan-400'
                  : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

        {/* Tab Content */}
        <div className="flex-1 bg-gray-900/60 backdrop-blur-sm">
          {selectedTab === 'closet' && renderCloset()}
          {selectedTab === 'stats' && renderStats()}
          {selectedTab === 'sessions' && renderSessions()}
          {selectedTab === 'badges' && renderBadges()}
          {selectedTab === 'trade' && renderTrade()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-2 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t-2 border-gray-700 flex justify-around py-2 z-20">
        <Link href="/" className="flex flex-col items-center flex-1">
          <Home size={24} className="text-gray-400" />
          <span className="text-gray-400 text-xs font-bold mt-1">Home</span>
        </Link>
        <Link href="/map" className="flex flex-col items-center flex-1">
          <Map size={24} className="text-gray-400" />
          <span className="text-gray-400 text-xs font-bold mt-1">Map</span>
        </Link>
        <button className="flex flex-col items-center flex-1">
          <div className="text-cyan-400">🛹</div>
          <span className="text-gray-400 text-xs font-bold mt-1">Skate</span>
        </button>
        <button className="flex flex-col items-center flex-1">
          <Users size={24} className="text-gray-400" />
          <span className="text-gray-400 text-xs font-bold mt-1">Friends</span>
        </button>
        <button className="flex flex-col items-center flex-1">
          <User size={24} className="text-yellow-500" />
          <span className="text-gray-400 text-xs font-bold mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
