/**
 * ScoreTable Component
 * Displays scores in a formatted table with rankings
 */

export default function ScoreTable({ scores, players }) {
  // Sort players by score in descending order
  const sortedEntries = Object.entries(scores)
    .map(([socketId, score]) => {
      const player = players.find((p) => p.socketId === socketId);
      return {
        socketId,
        name: player?.name || 'Unknown',
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-saffron to-orange-600 text-gray-900">
          <tr>
            <th className="px-4 py-3 text-left font-bold">Rank</th>
            <th className="px-4 py-3 text-left font-bold">Player</th>
            <th className="px-4 py-3 text-right font-bold">Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.map((entry, index) => (
            <tr
              key={entry.socketId}
              className={`
                border-t border-gray-700 transition-all duration-300
                ${
                  index === 0
                    ? 'bg-gradient-to-r from-gold to-yellow-500 bg-opacity-20'
                    : 'hover:bg-gray-700'
                }
              `}
            >
              <td className="px-4 py-3 font-bold">
                <span className={`inline-block w-8 h-8 center-content rounded-full font-bold ${
                  index === 0 ? 'bg-gold text-gray-900' :
                  index === 1 ? 'bg-gray-400 text-gray-900' :
                  'bg-gray-600 text-white'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-white">
                {entry.name}
              </td>
              <td className="px-4 py-3 text-right font-bold">
                <span className={`text-lg ${
                  index === 0 ? 'text-gold' : 'text-saffron'
                }`}>
                  {entry.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
