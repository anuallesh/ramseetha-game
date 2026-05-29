/**
 * LoadingScreen Component
 * Displays loading animation with custom messages
 */

export default function LoadingScreen({ message = 'Loading...', variant = 'default' }) {
  const icons = {
    default: '⚙️',
    game: '🎮',
    card: '🎴',
    wait: '⏳',
    success: '✨',
  };

  const colors = {
    default: 'text-saffron',
    game: 'text-gold',
    card: 'text-crimson',
    wait: 'text-sage',
    success: 'text-emerald-500',
  };

  return (
    <div className="full-screen center-content bg-gradient-mythic">
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <div className={`text-6xl animate-bounce-slow ${colors[variant]}`}>
          {icons[variant]}
        </div>

        {/* Loading Text */}
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${colors[variant]}`}>
            {message}
          </h2>
          <p className="text-gray-400">Please wait...</p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-saffron animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-saffron animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-saffron animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
