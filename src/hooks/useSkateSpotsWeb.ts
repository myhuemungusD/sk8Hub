import { useState, useEffect } from 'react';

export interface SkateSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  photo: string;
  color: string;
  active: boolean;
  type: 'street' | 'park' | 'vert' | 'bowl' | 'ledge' | 'rail' | 'stairs';
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  description: string;
  features: string[];
  reviews: number;
  likes: number;
  isVerified: boolean;
}

// Mock data - replace with Firestore integration later
const mockSpots: SkateSpot[] = [
  {
    id: "1",
    name: "Hollenbeck Park®",
    lat: 34.0459,
    lng: -118.2167,
    photo: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=120&q=80",
    color: "#43e2fa",
    active: true,
    type: 'park',
    rating: 4.5,
    difficulty: 'Intermediate',
    description: 'Epic skate park with bowls and street features',
    features: ['Bowl', 'Rails', 'Stairs'],
    reviews: 127,
    likes: 89,
    isVerified: true,
  },
  {
    id: "2",
    name: "Ledge Spot",
    lat: 34.0475,
    lng: -118.2150,
    photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?fit=crop&w=120&q=80",
    color: "#9c72fc",
    active: false,
    type: 'street',
    rating: 4.2,
    difficulty: 'Advanced',
    description: 'Perfect ledges for grinding and technical tricks',
    features: ['Ledges', 'Manual pads'],
    reviews: 83,
    likes: 64,
    isVerified: false,
  },
  {
    id: "3",
    name: "Venice Beach Skate Park",
    lat: 34.0195,
    lng: -118.4912,
    photo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?fit=crop&w=120&q=80",
    color: "#f97316",
    active: true,
    type: 'park',
    rating: 4.8,
    difficulty: 'Pro',
    description: 'Legendary skate spot by the beach',
    features: ['Vert ramp', 'Bowl', 'Street course'],
    reviews: 256,
    likes: 189,
    isVerified: true,
  },
  {
    id: "4",
    name: "DTLA Street Spot",
    lat: 34.0522,
    lng: -118.2437,
    photo: "https://images.unsplash.com/photo-1570993492903-ba4c3088f100?fit=crop&w=120&q=80",
    color: "#10b981",
    active: false,
    type: 'street',
    rating: 3.9,
    difficulty: 'Beginner',
    description: 'Urban street skating with stairs and rails',
    features: ['Stairs', 'Rails', 'Gaps'],
    reviews: 45,
    likes: 32,
    isVerified: false,
  },
];

export const useSkateSpots = () => {
  const [spots, setSpots] = useState<SkateSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchSpots = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSpots(mockSpots);
        setError(null);
      } catch (err) {
        setError('Failed to load skate spots');
        console.error('Error fetching spots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  const addSpot = (spot: Omit<SkateSpot, 'id'>) => {
    const newSpot: SkateSpot = {
      ...spot,
      id: Date.now().toString(),
    };
    setSpots(prev => [...prev, newSpot]);
  };

  const updateSpot = (id: string, updates: Partial<SkateSpot>) => {
    setSpots(prev => prev.map(spot => 
      spot.id === id ? { ...spot, ...updates } : spot
    ));
  };

  const deleteSpot = (id: string) => {
    setSpots(prev => prev.filter(spot => spot.id !== id));
  };

  const getSpotsByType = (type: SkateSpot['type']) => {
    return spots.filter(spot => spot.type === type);
  };

  const getNearbySpots = (lat: number, lng: number, radiusKm: number = 10) => {
    return spots.filter(spot => {
      const distance = calculateDistance(lat, lng, spot.lat, spot.lng);
      return distance <= radiusKm;
    });
  };

  return {
    spots,
    loading,
    error,
    addSpot,
    updateSpot,
    deleteSpot,
    getSpotsByType,
    getNearbySpots,
  };
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
