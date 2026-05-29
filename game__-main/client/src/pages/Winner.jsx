/**
 * Winner Page
 * Displays final game results and winner
 */

import ScoreTable from '../components/ScoreTable';

export default function Winner({ winner, onPlayAgain }) {
  if (!winner) {
    return <div>Loading...</div>;
  }

  const firstPlace = winner.allPlayers[0];
  const secondPlace = winner.allPlayers[1];
  const thirdPlace = winner.allPlayers[2];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-mythic p-4 md:p-8 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Grand Winner */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 animate-bounce-slow">
            🏆
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-2">
            Game Over!
          </h2>
          <p className="text-2xl md:text-3xl text-gold font-bold mb-8">
            {firstPlace.name} Wins!
          </p>

          {/* Top 3 Players */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* First Place */}
            <div className="card p-8 transform hover:scale-105 transition-transform border-2 border-gold">
              <p className="text-6xl mb-4">🥇</p>
              <h3 className="text-2xl font-bold text-gold mb-2">
                1st Place
              </h3>
              <p className="text-xl font-bold text-white mb-2">
                {firstPlace.name}
              </p>
              <p className="text-4xl font-bold text-gold mb-2">
                {firstPlace.finalScore}
              </p>
              <p className="text-sm text-gray-400">points</p>
            </div>

            {/* Second Place */}
            {secondPlace && (
              <div className="card p-8 transform hover:scale-105 transition-transform border-2 border-gray-400">
                <p className="text-6xl mb-4">🥈</p>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">
                  2nd Place
                </h3>
                <p className="text-xl font-bold text-white mb-2">
                  {secondPlace.name}
                </p>
                <p className="text-4xl font-bold text-gray-400 mb-2">
                  {secondPlace.finalScore}
                </p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            )}

            {/* Third Place */}
            {thirdPlace && (
              <div className="card p-8 transform hover:scale-105 transition-transform border-2 border-amber-700">
                <p className="text-6xl mb-4">🥉</p>
                <h3 className="text-2xl font-bold text-amber-700 mb-2">
                  3rd Place
                </h3>
                <p className="text-xl font-bold text-white mb-2">
                  {thirdPlace.name}
                </p>
                <p className="text-4xl font-bold text-amber-700 mb-2">
                  {thirdPlace.finalScore}
                </p>
                <p className="text-sm text-gray-400">points</p>
              </div>
            )}
          </div>
        </div>

        {/* Final Scores Table */}
        <div className="card p-8 mb-12">
          <h3 className="text-2xl font-bold text-saffron mb-6">
            Final Scores - All Players
          </h3>
          <ScoreTable
            scores={winner.finalScores}
            players={winner.allPlayers}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onPlayAgain} className="btn-primary flex-1 py-4">
            🎮 Play Again
          </button>
          <a href="/" className="btn-secondary flex-1 py-4 text-center">
            🏠 Back to Home
          </a>
        </div>

        {/* Celebration */}
        <div className="text-center mt-12">
          <p className="text-4xl mb-4">🎊 🎉 🎊</p>
          <p className="text-gray-400">Thanks for playing RamSeetha!</p>
        </div>
      </div>
    </div>
  );
}
