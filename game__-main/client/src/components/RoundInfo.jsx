/**
 * RoundInfo Component
 * Displays current round information and progress
 */

export default function RoundInfo({ currentRound, totalRounds, playerCount }) {
  const progress = ((currentRound - 1) / totalRounds) * 100;

  return (
    <div className="card p-6 mb-6">
      {/* Round Counter */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-saffron mb-2">
          Round {currentRound} of {totalRounds}
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-saffron to-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {currentRound - 1} completed • {totalRounds - currentRound + 1} remaining
        </p>
      </div>

      {/* Players Info */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Active Players</p>
          <p className="text-2xl font-bold text-gold">{playerCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Characters</p>
          <p className="text-2xl font-bold text-saffron">6</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Max Points/Round</p>
          <p className="text-2xl font-bold text-gold">1000</p>
        </div>
      </div>
    </div>
  );
}
