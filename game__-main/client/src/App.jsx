import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { socket } from './socket/socket';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Result from './pages/Result';
import Winner from './pages/Winner';

/**
 * Main App component
 * Manages game state and routing based on current screen
 */
function App() {
  // Game state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [roomCode, setRoomCode] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [room, setRoom] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [roundResults, setRoundResults] = useState(null);
  const [finalWinner, setFinalWinner] = useState(null);
  const [roundTimeLeft, setRoundTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nextRoundTimerRef = useRef(null);

  // Compute isHost dynamically based on room state and socket connection
  const isHost = room ? socket.id === room.hostId : false;

  // Initialize socket listeners
  useEffect(() => {
    // Room created by host
    socket.on('room_created', (data) => {
      console.log('Room created:', data);
      setRoomCode(data.roomCode);
      setRoom(data.room);
      setCurrentScreen('lobby');
      setError(null);
    });

    // Room joined by player
    socket.on('room_joined', (data) => {
      console.log('Room joined:', data);
      setRoomCode(data.roomCode);
      setRoom(data.room);
      setCurrentScreen('lobby');
      setError(null);
    });

    // Player joined room
    socket.on('player_joined', (data) => {
      console.log('Player joined:', data);
      setRoom(data.room);
    });

    // Game started
    socket.on('game_started', (data) => {
      console.log('Game started:', data);
      setRoom(data.room);
      setGameData({
        currentRound: data.room.gameState.currentRound,
        totalRounds: data.room.gameState.totalRounds,
      });
      setIsLoading(false);
      setCurrentScreen('game');
    });

    // Round started
    socket.on('round_started', (data) => {
      console.log('Round started:', data);
      setGameData((prev) => ({
        ...prev,
        currentRound: data.roundNumber,
        cardReceived: true,
      }));
      setRoundTimeLeft(data.roundDuration ?? 10);
      setCurrentScreen('game'); // Sync all players to game screen
      setRoundResults(null); // Reset results state for the new round
    });

    // Receive card
    socket.on('receive_card', (data) => {
      console.log('Card received:', data);
      setGameData((prev) => ({
        ...prev,
        myCard: {
          character: data.character,
          characterName: data.characterName,
          characterPoints: data.characterPoints,
        },
        cardRevealed: false,
      }));
    });

    // Round results
    socket.on('round_results', (data) => {
      console.log('Round results:', data);
      setRoundTimeLeft(null);
      setRoom((prev) => ({
        ...prev,
        gameState: {
          ...prev?.gameState,
          playerScores: data.cumulativeScores,
        },
      }));
      setRoundResults({
        roundNumber: data.roundNumber ?? gameData?.currentRound,
        ramCorrect: data.ramCorrect,
        correctSeethaPlayer: data.correctSeethaPlayer,
        ramPlayer: data.ramPlayer, // Fix: Store ramPlayer so Result.jsx can safely display who was Ram
        cumulativeScores: data.cumulativeScores,
        roundScores: data.roundScores,
        players: data.players,
      });
      setCurrentScreen('result');
    });

    // Next round ready
    socket.on('next_round_ready', (data) => {
      console.log('Next round ready:', data);
      setRoundTimeLeft(null);
      setGameData((prev) => ({
        ...prev,
        currentRound: data.nextRound,
        myCard: null,
        cardReceived: false,
      }));

      if (nextRoundTimerRef.current) {
        clearTimeout(nextRoundTimerRef.current);
        nextRoundTimerRef.current = null;
      }
    });

    // Game over
    socket.on('game_over', (data) => {
      console.log('Game over:', data);
      setRoundTimeLeft(null);
      setFinalWinner({
        winner: data.winner,
        allPlayers: data.allPlayers,
        finalScores: data.finalScores,
      });
      setCurrentScreen('winner');
    });

    // Room data received
    socket.on('room_data', (data) => {
      console.log('Room data:', data);
      setRoom(data.room);
    });

    // Player left room
    socket.on('player_left', (data) => {
      console.log('Player left:', data);
      setRoom(data.room);
    });

    socket.on('round_timeout', (data) => {
      console.log('Round timeout:', data);
    });

    // Error handler
    socket.on('error', (data) => {
      console.error('Socket error:', data);
      setIsLoading(false);
      setError(data.message || 'An error occurred');
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('game_started');
      socket.off('round_started');
      socket.off('receive_card');
      socket.off('round_results');
      socket.off('next_round_ready');
      socket.off('game_over');
      socket.off('room_data');
      socket.off('player_left');
      socket.off('round_timeout');
      socket.off('error');
      if (nextRoundTimerRef.current) {
        clearTimeout(nextRoundTimerRef.current);
      }
    };
  }, [roomCode]);

  // Render screens based on current state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            onCreateRoom={(name) => {
              setPlayerName(name);
              setCurrentScreen('loading');
              socket.emit('create_room', { playerName: name, withBots: false });
            }}
            onCreateRoomWithBots={(name) => {
              setPlayerName(name);
              setCurrentScreen('loading');
              socket.emit('create_room', { playerName: name, withBots: true });
            }}
            onJoinRoom={(name, code) => {
              setPlayerName(name);
              setCurrentScreen('loading');
              socket.emit('join_room', { playerName: name, roomCode: code });
            }}
          />
        );

      case 'lobby':
        return (
          <Lobby
            room={room}
            isHost={isHost}
            onStartGame={(totalRounds) => {
              setIsLoading(true);
              socket.emit('start_game', { roomCode, totalRounds });
            }}
            onLeave={() => {
              socket.emit('leave_room', { roomCode });
              setCurrentScreen('home');
              setRoom(null);
              setRoomCode(null);
            }}
          />
        );

      case 'game':
        return (
          <Game
            gameData={gameData}
            room={room}
            roomCode={roomCode}
            roundTimeLeft={roundTimeLeft}
            onGuess={(targetPlayerId) => {
              socket.emit('ram_guess', { roomCode, targetPlayerId });
            }}
            onRevealCard={() => {
              setGameData((prev) => ({
                ...prev,
                cardRevealed: true,
              }));
            }}
          />
        );

      case 'result':
        return (
          <Result
            results={roundResults}
            room={room}
            isHost={isHost}
            onContinue={() => {
              socket.emit('start_round', { roomCode });
            }}
          />
        );

      case 'winner':
        return (
          <Winner
            winner={finalWinner}
            onPlayAgain={() => {
              socket.emit('leave_room', { roomCode });
              setCurrentScreen('home');
              setRoom(null);
              setRoomCode(null);
              setGameData(null);
              setFinalWinner(null);
              setRoundResults(null);
            }}
          />
        );

      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {error && (
          <div className="fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 font-bold hover:opacity-80"
            >
              ✕
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="full-screen center-content">
            <div className="text-center">
              <div className="spinner text-4xl mb-4">⚙️</div>
              <p className="text-xl text-saffron font-bold">Loading...</p>
            </div>
          </div>
        ) : (
          renderScreen()
        )}
      </main>
      <Analytics />
    </div>
  );
}

export default App;
