/**
 * Room management system
 * Stores and manages all active game rooms
 */

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  /**
   * Create a new room
   * @param {string} roomCode - Unique room code
   * @param {string} hostId - Socket ID of the host
   * @param {string} hostName - Host player name
   * @returns {object} Created room object
   */
  createRoom(roomCode, hostId, hostName) {
    const room = {
      roomCode,
      hostId,
      players: [
        {
          socketId: hostId,
          name: hostName,
          joinedAt: Date.now(),
          isHost: true,
        },
      ],
      gameState: {
        isStarted: false,
        currentRound: 0,
        totalRounds: 0,
        playerCards: {}, // Maps socketId to character
        ramGuess: null,
        playerScores: {}, // Maps socketId to total score
      },
      createdAt: Date.now(),
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  /**
   * Join a player to an existing room
   * @param {string} roomCode - Room code to join
   * @param {string} playerId - Socket ID of joining player
   * @param {string} playerName - Joining player's name
   * @returns {object} Updated room or error
   */
  joinRoom(roomCode, playerId, playerName) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.gameState.isStarted) {
      return { success: false, error: 'Game already started' };
    }

    if (room.players.length >= 6) {
      return { success: false, error: 'Room is full' };
    }

    // Check if player already exists
    const playerExists = room.players.some((p) => p.socketId === playerId);
    if (playerExists) {
      return { success: false, error: 'Player already in room' };
    }

    room.players.push({
      socketId: playerId,
      name: playerName,
      joinedAt: Date.now(),
      isHost: false,
    });

    return { success: true, room };
  }

  /**
   * Remove player from room
   * @param {string} roomCode - Room code
   * @param {string} playerId - Socket ID of player to remove
   * @returns {boolean} True if removed, false if not found
   */
  removePlayer(roomCode, playerId) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return false;
    }

    const playerIndex = room.players.findIndex((p) => p.socketId === playerId);
    if (playerIndex === -1) {
      return false;
    }

    room.players.splice(playerIndex, 1);

    // If host left, assign new host or delete room
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
    } else if (playerId === room.hostId) {
      room.hostId = room.players[0].socketId;
      room.players[0].isHost = true;
    }

    return true;
  }

  /**
   * Get room by code
   * @param {string} roomCode - Room code
   * @returns {object} Room object or null
   */
  getRoom(roomCode) {
    return this.rooms.get(roomCode) || null;
  }

  /**
   * Update game state
   * @param {string} roomCode - Room code
   * @param {object} updates - State updates
   * @returns {object} Updated room or null
   */
  updateGameState(roomCode, updates) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return null;
    }

    room.gameState = {
      ...room.gameState,
      ...updates,
    };

    return room;
  }

  /**
   * Initialize player scores at game start
   * @param {string} roomCode - Room code
   */
  initializeScores(roomCode) {
    const room = this.rooms.get(roomCode);

    if (room) {
      room.gameState.playerScores = {};
      room.players.forEach((player) => {
        room.gameState.playerScores[player.socketId] = 0;
      });
    }
  }

  /**
   * Get all rooms (for debugging/monitoring)
   * @returns {array} Array of all rooms
   */
  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  /**
   * Delete room
   * @param {string} roomCode - Room code to delete
   * @returns {boolean} True if deleted, false if not found
   */
  deleteRoom(roomCode) {
    return this.rooms.delete(roomCode);
  }
}

// Export singleton instance
export default new RoomManager();
