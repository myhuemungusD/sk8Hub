'use client';

import React from 'react';
import Link from 'next/link';
import MapScreenStable from '@/components/MapScreenStable';
import { ArrowLeft } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <h1 className="text-white text-xl font-bold">🛹 Spot Map</h1>
          </div>
        </div>
      </div>

      {/* Map Component */}
      <div className="pt-16">
        <MapScreenStable />
      </div>
    </div>
  );
}
