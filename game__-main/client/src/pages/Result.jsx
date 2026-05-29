/**
 * Result Page
 * Displays round results and updated scores
 */

import ScoreTable from '../components/ScoreTable';

export default function Result({ results, room, isHost, onContinue }) {
  if (!results || !room) {
    return <div>Loading...</div>;
  }

  const ramPlayer = room.players.find(
    (p) => p.socketId === results.ramPlayer
  );
  const seethaPlayer = room.players.find(
    (p) => p.socketId === results.correctSeethaPlayer
  );

  const ramName = ramPlayer ? ramPlayer.name : 'Unknown';
  const seethaName = seethaPlayer ? seethaPlayer.name : 'Unknown';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-mythic p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {results.ramCorrect ? (
              <span className="text-gradient">🎉 Ram Was Correct!</span>
            ) : (
              <span className="text-gradient">😢 Ram Was Wrong!</span>
            )}
          </h1>

          <div className="card p-8 inline-block">
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Ram Was</p>
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="text-center">
                  <p className="text-6xl mb-2">🙏</p>
                  <p className="font-bold text-white mb-2">{ramName}</p>
                  <p className={`text-3xl font-bold ${
                    results.ramCorrect ? 'text-gold' : 'text-gray-400'
                  }`}>
                    {results.ramCorrect ? '+1000' : '+0'}
                  </p>
                </div>

                <div className="text-4xl text-gray-500">→</div>

                <div className="text-center">
                  <p className="text-6xl mb-2">👸</p>
                  <p className="font-bold text-white mb-2">
                    {seethaName}
                  </p>
                  <p className={`text-3xl font-bold ${
                    !results.ramCorrect ? 'text-gold' : 'text-gray-400'
                  }`}>
                    {!results.ramCorrect ? '+1000' : '+0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-saffron mb-6">
            📊 Updated Scores (Round {results.roundNumber})
          </h2>
          <ScoreTable
            scores={results.cumulativeScores}
            players={room.players}
          />
        </div>

        {/* Continue Button */}
        {isHost ? (
          <button onClick={onContinue} className="btn-primary w-full py-4 text-xl">
            Continue to Next Round →
          </button>
        ) : (
          <div className="w-full text-center p-4 bg-gray-800 border border-gray-700 rounded-lg text-saffron font-bold text-lg animate-pulse shadow-md">
            ⏳ Waiting for host to start the next round...
          </div>
        )}
      </div>
    </div>
  );
}
