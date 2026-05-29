/**
 * Navbar Component
 * Top navigation bar for the application
 */

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-navy to-gray-900 border-b-2 border-saffron shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h1 className="text-2xl font-bold text-gradient">RamSeetha</h1>
              <p className="text-xs text-saffron">Mythological Game</p>
            </div>
          </div>

          {/* Game Info */}
          <div className="hidden sm:flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xs text-gray-400">Max Players</p>
              <p className="text-lg font-bold text-gold">6</p>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Min Players</p>
              <p className="text-lg font-bold text-saffron">4</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
