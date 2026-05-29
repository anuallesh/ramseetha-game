/**
 * LobbyPlayers Component
 * Displays list of players waiting in the lobby
 */

export default function LobbyPlayers({ players, maxPlayers = 6 }) {
  const emptySlots = Array(Math.max(0, maxPlayers - players.length)).fill(null);

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-saffron mb-4">
        Players in Lobby ({players.length}/{maxPlayers})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Filled player slots */}
        {players.map((player) => (
          <div
            key={player.socketId}
            className="card p-4 flex items-center space-x-4 animate-slide-in"
          >
            <div className="text-4xl">{player.isBot ? '🤖' : '👤'}</div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg">{player.name}</h4>
              {player.isBot && (
                <span className="badge bg-blue-600 text-white text-xs">BOT</span>
              )}
              {player.isHost && (
                <span className="badge badge-primary text-xs">HOST</span>
              )}
            </div>
            <div className="text-2xl">✓</div>
          </div>
        ))}

        {/* Empty slots */}
        {emptySlots.map((_, index) => (
          <div
            key={`empty-${index}`}
            className="card p-4 flex items-center justify-center opacity-50 border-dashed border-2 border-gray-600"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-gray-400">Waiting...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
