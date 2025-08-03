import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Graffiti Wall Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/graff wall.png')`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Main Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 mb-4 tracking-wider transform -rotate-2">
            SKATE
          </h1>
          <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 mb-8 tracking-wider transform rotate-1">
            HUBBA
          </h2>
          <p className="text-lg md:text-xl text-orange-100 font-semibold max-w-2xl mx-auto mb-8">
            The ultimate skateboarding community hub. Find spots, learn tricks, connect with riders.
          </p>
        </div>

        {/* Skateboard Stack */}
        <div className="flex flex-col items-center space-y-4 mb-12">
          {/* Top skateboard */}
          <div className="w-80 h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full border-4 border-orange-500 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer flex items-center justify-center">
            <Link href="/map" className="text-orange-400 font-bold text-lg">
              EXPLORE SPOTS
            </Link>
          </div>
          
          {/* Middle skateboard */}
          <div className="w-80 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full border-4 border-gray-800 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer flex items-center justify-center">
            <Link href="/profile" className="text-white font-bold text-lg">
              MY PROFILE
            </Link>
          </div>
          
          {/* Bottom skateboard */}
          <div className="w-80 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full border-4 border-orange-600 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer flex items-center justify-center">
            <Link href="/shop" className="text-orange-400 font-bold text-lg">
              SKATE SHOP
            </Link>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2">
            <span className="text-orange-200 font-semibold">🏗️ Spot Finder</span>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2">
            <span className="text-orange-200 font-semibold">📚 Trick Library</span>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2">
            <span className="text-orange-200 font-semibold">👥 Community</span>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2">
            <span className="text-orange-200 font-semibold">🛒 Skate Shop</span>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-6 py-2">
            <span className="text-orange-200 font-semibold">📱 Mobile Ready</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-orange-300/70 text-sm">
          <p>&copy; 2025 Sk8Hub • Built for the skating community</p>
          <Link href="/admin" className="text-orange-400 hover:text-orange-300 text-xs underline">
            Admin Panel
          </Link>
        </div>
      </div>

      {/* Floating skateboard elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-30 animate-bounce">
        🛹
      </div>
      <div className="absolute top-20 right-16 text-4xl opacity-20 animate-pulse">
        🛹
      </div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-25 animate-bounce delay-1000">
        🛹
      </div>
    </div>
  );
}
