/**
 * Lobby Page
 * Waiting area for players to gather before game starts
 */

import { useState } from 'react';
import LobbyPlayers from '../components/LobbyPlayers';

export default function Lobby({ room, isHost, onStartGame, onLeave }) {
  const [selectedRounds, setSelectedRounds] = useState(10);
  const [showRoundSelection, setShowRoundSelection] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (room.players.length >= 4) {
      onStartGame(selectedRounds);
    }
  };

  const canStart = room.players.length >= 4;
  const isReady = room.players.length === 6;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-mythic p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Lobby
          </h1>

          {/* Room Code Display */}
          <div className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-400 mb-2">Room Code</p>
              <p className="text-4xl font-bold text-saffron font-mono">
                {room.roomCode}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="btn-secondary md:w-auto"
            >
              {copied ? '✓ Copied!' : '📋 Copy Code'}
            </button>
            <button onClick={onLeave} className="btn-danger md:w-auto">
              Leave Lobby
            </button>
          </div>
        </div>

        {/* Players Section */}
        <div className="mb-8">
          <LobbyPlayers players={room.players} maxPlayers={6} />
        </div>

        {/* Status and Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-saffron mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Players Ready</span>
                <span className="text-2xl font-bold text-gold">
                  {room.players.length}/6
                </span>
              </div>
              {room.players.length >= 4 ? (
                <div className="bg-sage bg-opacity-20 border border-sage rounded p-3 text-center">
                  <p className="font-bold text-sage">✓ Ready to start!</p>
                </div>
              ) : (
                <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded p-3 text-center">
                  <p className="text-yellow-400">
                    Waiting for {4 - room.players.length} more player{4 - room.players.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Round Selection (Host Only) */}
          {isHost && (
            <div className="card p-6">
              <h3 className="text-xl font-bold text-saffron mb-4">
                Game Settings
              </h3>
              {!showRoundSelection ? (
                <div>
                  <p className="text-gray-400 mb-4">Selected Rounds</p>
                  <div className="text-4xl font-bold text-gold mb-6">
                    {selectedRounds}
                  </div>
                  <button
                    onClick={() => setShowRoundSelection(true)}
                    className="btn-secondary w-full mb-4"
                  >
                    Change Rounds
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {[5, 10, 15, 20].map((rounds) => (
                    <button
                      key={rounds}
                      onClick={() => {
                        setSelectedRounds(rounds);
                        setShowRoundSelection(false);
                      }}
                      className={`w-full py-2 px-4 rounded font-bold transition-all ${
                        selectedRounds === rounds
                          ? 'bg-saffron text-gray-900'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {rounds} Rounds
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Not Host Info */}
          {!isHost && (
            <div className="card p-6 bg-blue-900 bg-opacity-20 border border-blue-600">
              <h3 className="text-xl font-bold text-blue-400 mb-4">
                Waiting for Host
              </h3>
              <p className="text-gray-300">
                The game host will start the game when ready. Make sure you've
                joined the correct room!
              </p>
            </div>
          )}
        </div>

        {/* Start Button (Host Only) */}
        {isHost && (
          <div className="mt-8">
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              className={`w-full py-4 text-xl font-bold rounded-lg transition-all ${
                canStart
                  ? 'btn-primary animate-pulse'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {canStart ? '🎮 Start Game' : '⏳ Waiting for Players'}
            </button>
            {!canStart && (
              <p className="text-center text-gray-400 mt-2">
                Need at least 2 players to start
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
