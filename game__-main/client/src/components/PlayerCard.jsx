/**
 * PlayerCard Component
 * Displays individual player information with score and status
 */

export default function PlayerCard({
  player,
  score,
  isCurrentPlayer,
  isRamPlayer,
  isSeethaPlayer,
  isGuessTarget,
  onSelect,
  selectable,
}) {
  return (
    <div
      className={`
        card p-4 text-center cursor-pointer transform transition-all duration-300
        ${
          isCurrentPlayer
            ? 'ring-2 ring-gold scale-105 shadow-[0_0_20px_rgba(255,215,0,0.5)]'
            : ''
        }
        ${isGuessTarget ? 'ring-2 ring-crimson scale-105' : ''}
        ${selectable ? 'hover:scale-110 hover:shadow-lg' : 'opacity-75'}
      `}
      onClick={() => selectable && onSelect?.(player.socketId)}
    >
      {/* Player Avatar */}
      <div className="mb-3 text-5xl animate-bounce-slow">👤</div>

      {/* Player Name */}
      <h3 className="font-bold text-lg mb-2 text-white truncate">
        {player.name}
      </h3>

      {/* Role Badges */}
      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        {isRamPlayer && (
          <span className="badge badge-primary text-xs">RAM (1000)</span>
        )}
        {isSeethaPlayer && (
          <span className="badge badge-danger text-xs">SEETHA (0)</span>
        )}
        {!isRamPlayer && !isSeethaPlayer && (
          <span className="badge bg-gray-600 text-white text-xs">???</span>
        )}
      </div>

      {/* Score */}
      <div className="bg-gray-700 rounded-lg p-2 mb-2">
        <p className="text-xs text-gray-400">Score</p>
        <p className="text-2xl font-bold text-gold">{score || 0}</p>
      </div>

      {/* Status Indicator */}
      {isCurrentPlayer && (
        <div className="mt-2 text-xs bg-gold text-gray-900 py-1 px-2 rounded font-bold">
          YOU
        </div>
      )}

      {isGuessTarget && (
        <div className="mt-2 text-xs bg-crimson text-white py-1 px-2 rounded font-bold">
          YOUR GUESS
        </div>
      )}

      {selectable && !isCurrentPlayer && (
        <div className="mt-2 text-xs bg-saffron text-gray-900 py-1 px-2 rounded font-bold animate-pulse">
          CLICK TO SELECT
        </div>
      )}
    </div>
  );
}
