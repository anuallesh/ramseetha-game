/**
 * Game Page
 * Main gameplay screen where players see their cards and Ram makes guesses
 */

import { useState, useEffect } from 'react';
import { socket } from '../socket/socket';
import RoundInfo from '../components/RoundInfo';
import PlayerCard from '../components/PlayerCard';
import LoadingScreen from '../components/LoadingScreen';

export default function Game({
  gameData,
  room,
  roomCode,
  roundTimeLeft,
  onGuess,
  onRevealCard,
}) {
  const [guessedPlayer, setGuessedPlayer] = useState(null);
  const [isRam, setIsRam] = useState(false);
  const [showCardReveal, setShowCardReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(roundTimeLeft ?? null);

  // Determine if current player is Ram
  useEffect(() => {
    if (gameData?.myCard) {
      setIsRam(gameData.myCard.character === 'RAM');
    }
  }, [gameData?.myCard]);

  useEffect(() => {
    setShowCardReveal(false);
    setGuessedPlayer(null);
  }, [gameData?.currentRound]);

  useEffect(() => {
    setTimeLeft(roundTimeLeft ?? null);
  }, [roundTimeLeft, gameData?.currentRound]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (!gameData || !room) {
    return <LoadingScreen message="Loading game..." variant="game" />;
  }

  const handleGuess = () => {
    if (guessedPlayer && isRam) {
      onGuess(guessedPlayer);
      setGuessedPlayer(null);
    }
  };

  const handleRevealCard = () => {
    setShowCardReveal(true);
    onRevealCard?.();
  };

  const currentPlayerId = socket.id;
  const currentPlayer = room.players.find((p) => p.socketId === currentPlayerId);
  const otherPlayers = room.players.filter((p) => p.socketId !== currentPlayerId);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-mythic p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Round Info */}
        <RoundInfo
          currentRound={gameData.currentRound}
          totalRounds={gameData.totalRounds}
          playerCount={room.players.length}
        />

        {/* My Card Section */}
        {gameData.myCard && (
          <div className="card p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold text-saffron mb-4">Your Card</h2>

            {!showCardReveal ? (
              <div className="mb-6">
                <div className="text-8xl mb-4 animate-bounce-slow">🎴</div>
                <p className="text-gray-400 mb-6">Click to reveal your character</p>
                <button
                  onClick={handleRevealCard}
                  className="btn-primary"
                >
                  👁️ Reveal Card
                </button>
              </div>
            ) : (
              <div className="animate-slide-in">
                <p className="text-6xl mb-4">{
                  gameData.myCard.character === 'RAM' ? '🙏' :
                  gameData.myCard.character === 'SEETHA' ? '👸' :
                  gameData.myCard.character === 'LAXMAN' ? '⚡' :
                  gameData.myCard.character === 'HANUMAN' ? '🐵' :
                  gameData.myCard.character === 'BHARATH' ? '👑' :
                  '🏹'
                }</p>
                <h3 className="text-3xl font-bold text-gradient mb-2">
                  {gameData.myCard.characterName}
                </h3>
                <div className="text-5xl font-bold text-gold mb-4">
                  +{gameData.myCard.characterPoints}
                </div>
                {isRam && (
                  <div className="bg-saffron bg-opacity-20 border-2 border-saffron rounded p-4">
                    <p className="font-bold text-saffron text-lg">
                      🎯 You are Ram! Guess who has Seetha to get 1000 points!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ram Guess Section */}
        {isRam && showCardReveal && (
          <div className="card p-8 mb-8 border-2 border-saffron">
            <div className="mb-4 text-center">
              <p className="text-lg text-saffron font-semibold">
                Time left: <span className="text-gold">{timeLeft ?? 0}s</span>
              </p>
              {timeLeft === 0 && (
                <p className="text-sm text-red-400">
                  Time expired! Waiting for the round to resolve.
                </p>
              )}
            </div>
            <h2 className="text-2xl font-bold text-saffron mb-6">
              🎯 Make Your Guess
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Select which player you think has the Seetha card:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {room.players
                .filter((p) => p.socketId !== currentPlayerId) // Exclude only self
                .map((player) => (
                  <PlayerCard
                    key={player.socketId}
                    player={player}
                    score={room.gameState?.playerScores?.[player.socketId] ?? 0}
                    isCurrentPlayer={player.socketId === currentPlayerId}
                    isGuessTarget={guessedPlayer === player.socketId}
                    selectable={true}
                    onSelect={() => setGuessedPlayer(player.socketId)}
                  />
                ))}
            </div>

            <button
              onClick={handleGuess}
              disabled={!guessedPlayer || timeLeft === 0}
              className={`w-full py-4 text-lg font-bold rounded-lg transition-all ${
                guessedPlayer && timeLeft !== 0
                  ? 'btn-primary'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✓ Submit Guess
            </button>
          </div>
        )}

        {/* Other Players Display */}
        {!isRam && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gold mb-4">Other Players</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.players
                .filter((p) => p.socketId !== currentPlayerId)
                .map((player) => (
                  <PlayerCard
                    key={player.socketId}
                    player={player}
                    score={room.gameState?.playerScores?.[player.socketId] ?? 0}
                    isCurrentPlayer={player.socketId === currentPlayerId}
                    isRamPlayer={room.gameState?.playerCards?.[player.socketId] === 'ram'}
                    isSeethaPlayer={room.gameState?.playerCards?.[player.socketId] === 'seetha'}
                    selectable={false}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Waiting Message */}
        {!isRam && showCardReveal && (
          <div className="card p-8 text-center">
            <p className="text-xl text-saffron font-bold mb-4">
              ⏳ Waiting for Ram's guess...
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-saffron animate-pulse"></div>
              <div
                className="w-3 h-3 rounded-full bg-saffron animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-3 h-3 rounded-full bg-saffron animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
