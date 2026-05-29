/**
 * Socket.IO event handlers for the RamSeetha game
 * Manages all real-time game communications between clients and server
 */

import roomManager from '../rooms/rooms.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';
import { assignCharacterCards, getCardDetails } from '../utils/shuffleCards.js';
import {
  calculateRoundScores,
  updateCumulativeScores,
  calculateFinalWinner,
} from '../utils/calculateScores.js';
import { createBotPlayer, makeBotGuess, isBot } from '../utils/botLogic.js';

const roundTimers = new Map();

export const initializeGameSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    const clearRoundTimers = (roomCode) => {
      const timers = roundTimers.get(roomCode);
      if (!timers) {
        return;
      }

      if (timers.timeoutId) {
        clearTimeout(timers.timeoutId);
      }

      if (timers.botGuessId) {
        clearTimeout(timers.botGuessId);
      }

      roundTimers.delete(roomCode);
    };

    const completeRound = (roomCode, options = {}) => {
      const room = roomManager.getRoom(roomCode);
      if (!room || room.gameState.roundCompleted) {
        return;
      }

      const currentRound = room.gameState.currentRound;
      const scoreResult = calculateRoundScores(room.gameState);
      const updatedScores = updateCumulativeScores(
        room.gameState.playerScores,
        scoreResult.roundScores
      );

      roomManager.updateGameState(roomCode, {
        playerScores: updatedScores,
        roundCompleted: true,
      });

      clearRoundTimers(roomCode);

      const finalRoom = roomManager.getRoom(roomCode);
      io.to(roomCode).emit('room_data', { room: finalRoom });

      io.to(roomCode).emit('round_results', {
        roundNumber: currentRound,
        ramCorrect: scoreResult.ramCorrect,
        correctSeethaPlayer: scoreResult.correctSeethaPlayer,
        ramPlayer: scoreResult.ramPlayer,
        roundScores: scoreResult.roundScores,
        cumulativeScores: updatedScores,
        players: finalRoom.players,
        autoTimeout: options.autoTimeout || false,
      });

      if (currentRound >= finalRoom.gameState.totalRounds) {
        const finalResult = calculateFinalWinner(updatedScores);

        io.to(roomCode).emit('game_over', {
          finalScores: updatedScores,
          winner: finalResult.winner,
          allPlayers: finalRoom.players.map((p) => ({
            ...p,
            finalScore: updatedScores[p.socketId],
          })),
          sortedPlayers: finalResult.sortedPlayers,
        });

        console.log(`Game over in room: ${roomCode}`);
        return;
      }

      const nextRound = currentRound + 1;
      roomManager.updateGameState(roomCode, {
        currentRound: nextRound,
      });

      io.to(roomCode).emit('next_round_ready', {
        nextRound,
        message: 'Ready for next round?',
      });
    };

    // ============= ROOM EVENTS =============

    /**
     * CREATE ROOM
     * Host creates a new game room
     */
    socket.on('create_room', (data) => {
      const { playerName, withBots } = data;

      console.log(`Create room request - playerName: ${playerName}, withBots: ${withBots}`);

      if (!playerName || playerName.trim().length === 0) {
        socket.emit('error', { message: 'Player name is required' });
        return;
      }

      const roomCode = generateRoomCode();
      const room = roomManager.createRoom(roomCode, socket.id, playerName);

      // Add bots if requested
      if (withBots) {
        console.log(`Adding 3 bots to room ${roomCode}`);
        for (let i = 1; i <= 3; i++) {
          const bot = createBotPlayer(i);
          room.players.push(bot);
          console.log(`Bot added: ${bot.name} (${bot.socketId})`);
        }
      }

      socket.join(roomCode);
      roomManager.initializeScores(roomCode);

      socket.emit('room_created', {
        roomCode,
        room,
        message: 'Room created successfully',
      });

      console.log(`Room created: ${roomCode} ${withBots ? 'with bots' : ''}`);
    });

    /**
     * JOIN ROOM
     * Player joins an existing game room using room code
     */
    socket.on('join_room', (data) => {
      const { roomCode, playerName } = data;

      if (!playerName || playerName.trim().length === 0) {
        socket.emit('error', { message: 'Player name is required' });
        return;
      }

      const result = roomManager.joinRoom(roomCode, socket.id, playerName);

      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      socket.join(roomCode);
      const room = result.room;

      // Notify all players in the room
      io.to(roomCode).emit('player_joined', {
        room,
        newPlayer: {
          socketId: socket.id,
          name: playerName,
        },
      });

      socket.emit('room_joined', { roomCode, room });
      console.log(`${playerName} joined room: ${roomCode}`);
    });

    /**
     * GET ROOM DATA
     * Fetch current room data
     */
    socket.on('get_room', (data) => {
      const { roomCode } = data;
      const room = roomManager.getRoom(roomCode);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      socket.emit('room_data', { room });
    });

    // ============= GAME EVENTS =============

    /**
     * START GAME
     * Host initiates game start with selected number of rounds
     */
    const startRound = (roomCode) => {
      const room = roomManager.getRoom(roomCode);
      if (!room) {
        return;
      }

      const playerCards = assignCharacterCards(room.players);
      roomManager.updateGameState(roomCode, {
        playerCards,
        ramGuess: null,
        roundCompleted: false,
        roundStartedAt: Date.now(),
        roundDuration: 40,
      });

      const updatedRoom = roomManager.getRoom(roomCode);

      updatedRoom.players.forEach((player) => {
        const character = playerCards[player.socketId];
        const cardDetails = getCardDetails(character);

        io.to(player.socketId).emit('receive_card', {
          character: character.toUpperCase(),
          characterName: cardDetails.name,
          characterPoints: cardDetails.points,
        });
      });

      // Broadcast updated room state (includes assigned playerCards)
      io.to(roomCode).emit('room_data', { room: updatedRoom });

      io.to(roomCode).emit('round_started', {
        roundNumber: updatedRoom.gameState.currentRound,
        totalRounds: updatedRoom.gameState.totalRounds,
        roundDuration: updatedRoom.gameState.roundDuration,
        message: `Round ${updatedRoom.gameState.currentRound} started! Check your card.`,
      });

      clearRoundTimers(roomCode);

      const timeoutId = setTimeout(() => {
        const latestRoom = roomManager.getRoom(roomCode);
        if (!latestRoom || latestRoom.gameState.roundCompleted) {
          return;
        }

        if (latestRoom.gameState.ramGuess === null) {
          io.to(roomCode).emit('round_timeout', {
            message: 'Time expired! Ram did not select Seetha in time.',
          });
          completeRound(roomCode, { autoTimeout: true });
        }
      }, updatedRoom.gameState.roundDuration * 1000);

      let botGuessId = null;
      let ramPlayerId = null;

      for (const [socketId, character] of Object.entries(updatedRoom.gameState.playerCards)) {
        if (character === 'ram') {
          ramPlayerId = socketId;
          break;
        }
      }

      const ramPlayer = updatedRoom.players.find((p) => p.socketId === ramPlayerId);
      if (ramPlayer && isBot(ramPlayer)) {
        botGuessId = setTimeout(() => {
          const latestRoom = roomManager.getRoom(roomCode);
          if (!latestRoom || latestRoom.gameState.roundCompleted) {
            return;
          }

          const guessedPlayer = makeBotGuess(latestRoom.players, ramPlayerId);
          if (guessedPlayer) {
            roomManager.updateGameState(roomCode, {
              ramGuess: guessedPlayer.socketId,
            });
            completeRound(roomCode);
          }
        }, 3000);
      }

      roundTimers.set(roomCode, { timeoutId, botGuessId });

      console.log(`Round ${updatedRoom.gameState.currentRound} started in room: ${roomCode}`);
    };

    socket.on('start_game', (data) => {
      const { roomCode, totalRounds } = data;
      const room = roomManager.getRoom(roomCode);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Only host can start game
      if (socket.id !== room.hostId) {
        socket.emit('error', { message: 'Only host can start the game' });
        return;
      }

      // Minimum 4 players required
      if (room.players.length < 4) {
        socket.emit('error', { message: 'Minimum 4 players required to start' });
        return;
      }

      // Update game state
      roomManager.updateGameState(roomCode, {
        isStarted: true,
        totalRounds,
        currentRound: 1,
      });

      // Notify all players
      io.to(roomCode).emit('game_started', {
        room: roomManager.getRoom(roomCode),
        message: `Game started! Total rounds: ${totalRounds}`,
      });

      console.log(`Game started in room: ${roomCode} for ${totalRounds} rounds`);

      // Start first round immediately
      startRound(roomCode);
    });

    /**
     * START ROUND
     * Initialize a new round - assign cards to players
     */
    socket.on('start_round', (data) => {
      const { roomCode } = data || {};
      const room = roomManager.getRoom(roomCode);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Restrict round starting to host only to prevent concurrent socket emissions
      if (socket.id !== room.hostId) {
        socket.emit('error', { message: 'Only the host can start the next round' });
        return;
      }

      startRound(roomCode);
    });

    /**
     * RAM MAKES GUESS
     * Ram player guesses which player has Seetha card
     */
    socket.on('ram_guess', (data) => {
      const { roomCode, targetPlayerId } = data;
      const room = roomManager.getRoom(roomCode);

      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      if (room.gameState.roundCompleted) {
        return;
      }

      // Find who has Ram card
      let ramPlayerId = null;
      for (const [socketId, character] of Object.entries(room.gameState.playerCards)) {
        if (character === 'ram') {
          ramPlayerId = socketId;
          break;
        }
      }

      // Verify it's the Ram player making the guess
      if (socket.id !== ramPlayerId) {
        socket.emit('error', { message: 'Only Ram player can make the guess' });
        return;
      }

      if (room.gameState.ramGuess !== null) {
        return;
      }

      roomManager.updateGameState(roomCode, {
        ramGuess: targetPlayerId,
      });

      clearRoundTimers(roomCode);
      completeRound(roomCode);
    });

    // ============= DISCONNECT EVENTS =============

    /**
     * PLAYER DISCONNECT
     * Handle player leaving the game
     */
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // Find which room this player was in
      const rooms = roomManager.getAllRooms();
      rooms.forEach((room) => {
        const playerExists = room.players.some((p) => p.socketId === socket.id);

        if (playerExists) {
          roomManager.removePlayer(room.roomCode, socket.id);

          if (room.players.length > 0) {
            // Notify remaining players
            io.to(room.roomCode).emit('player_left', {
              room: roomManager.getRoom(room.roomCode),
              message: 'A player has left the game',
            });
          }
        }
      });
    });

    /**
     * MANUAL LEAVE ROOM
     * Player explicitly leaves the room
     */
    socket.on('leave_room', (data) => {
      const { roomCode } = data;
      const room = roomManager.getRoom(roomCode);

      if (room) {
        roomManager.removePlayer(roomCode, socket.id);
        socket.leave(roomCode);

        const updatedRoom = roomManager.getRoom(roomCode);
        if (updatedRoom && updatedRoom.players.length > 0) {
          io.to(roomCode).emit('player_left', {
            room: updatedRoom,
            message: 'A player has left the game',
          });
        }
      }

      socket.emit('left_room', { message: 'You have left the room' });
    });

    // ============= DEBUG EVENTS =============

    /**
     * GET ALL ROOMS (DEBUG)
     * Retrieve all active rooms for monitoring
     */
    socket.on('get_all_rooms', () => {
      const rooms = roomManager.getAllRooms();
      socket.emit('all_rooms', {
        rooms,
        totalRooms: rooms.length,
      });
    });
  });
};
