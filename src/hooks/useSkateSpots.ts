'use client';

import { useState, useEffect } from 'react';
// import { collection, onSnapshot, query, where } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

interface SkateSpot {
  id: string;
  name: string;
  type: 'street' | 'park' | 'vert' | 'bowl' | 'ledge' | 'rail' | 'stairs';
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  lat: number;
  lng: number;
  distance: string;
  features: string[];
  images: string[];
  reviews: number;
  likes: number;
  isVerified: boolean;
  isBusy: boolean;
  description: string;
  tags: string[];
  active?: boolean;
  lastSession?: {
    users: Array<{
      username: string;
      avatarUrl: string;
      since: number;
    }>;
    clipUrl?: string;
    tricks: string[];
    vibe: string;
  };
}

export const useSkateSpots = () => {
  const [spots, setSpots] = useState<SkateSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would connect to Firebase Firestore in a real app
    // For now, we'll simulate real-time updates with mock data

    const mockSpots: SkateSpot[] = [
      {
        id: '1',
        name: 'Lincoln Park',
        type: 'park',
        rating: 4.7,
        difficulty: 'Intermediate',
        lat: 37.801234,
        lng: -122.420987,
        distance: '0.3 mi',
        features: ['Bowl section', 'Street course', 'Mini ramp'],
        images: ['/lincoln-park.jpg'],
        reviews: 156,
        likes: 234,
        isVerified: true,
        isBusy: true,
        description:
          'Popular park with active sessions throughout the day. Great community vibe.',
        tags: ['park', 'bowl', 'community', 'active'],
        active: true,
        lastSession: {
          users: [
            {
              username: 'GripGod',
              avatarUrl: 'https://yourcdn/avatar1.png',
              since: Date.now() - 15 * 60 * 1000, // 15 minutes ago
            },
            {
              username: 'SkateKing',
              avatarUrl: 'https://yourcdn/avatar2.png',
              since: Date.now() - 25 * 60 * 1000, // 25 minutes ago
            },
          ],
          clipUrl: 'https://yourcdn/clip1.mp4',
          tricks: ['Kickflip', 'Backtail'],
          vibe: 'Chill',
        },
      },
      // Add other spots...
    ];

    setSpots(mockSpots);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSpots(prevSpots =>
        prevSpots.map(spot => {
          if (spot.active && spot.lastSession) {
            // Randomly update session data
            const shouldUpdate = Math.random() > 0.7;
            if (shouldUpdate) {
              return {
                ...spot,
                lastSession: {
                  ...spot.lastSession,
                  users: spot.lastSession.users.map(user => ({
                    ...user,
                    since: user.since + Math.random() * 60000, // Random time adjustment
                  })),
                },
              };
            }
          }
          return spot;
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { spots, loading };
};

export const useRealTimeSpots = () => {
  const [spots] = useState<SkateSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be:
    // const q = query(collection(db, 'spots'), where('active', '==', true));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const spotsData = querySnapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   })) as SkateSpot[];
    //   setSpots(spotsData);
    //   setLoading(false);
    // });
    // return unsubscribe;

    // For now, return mock data
    setLoading(false);
  }, []);

  return { spots, loading };
};
