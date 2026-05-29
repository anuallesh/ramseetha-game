# Socket.IO Events Reference

Quick reference for all Socket.IO events used in RamSeetha game.

## Events Overview

### Client → Server (Emit)
Client sends these events to the server.

### Server → Client (Broadcast)
Server sends these events back to client(s).

---

## 🎮 Game Flow Events

### 1. Room Creation/Joining

#### `create_room` (Client → Server)
**Sent when**: Host clicks "Create Room"
```javascript
socket.emit('create_room', {
  playerName: string  // Host's name
})
```

**Response**: `room_created`
```javascript
socket.on('room_created', {
  roomCode: string,        // 6-character code (e.g., "ABC123")
  room: {
    roomCode: string,
    hostId: string,
    players: [],
    gameState: { ... }
  },
  message: string
})
```

---

#### `join_room` (Client → Server)
**Sent when**: Player clicks "Join Room"
```javascript
socket.emit('join_room', {
  roomCode: string,      // Room code to join (e.g., "ABC123")
  playerName: string     // Joining player's name
})
```

**Response**: `room_joined` or `error`
```javascript
socket.on('room_joined', {
  roomCode: string,
  room: { ... }
})

socket.on('error', {
  message: string  // "Room not found", "Room is full", etc.
})
```

---

#### `player_joined` (Server → All in Room)
**Sent to**: All players in room when someone joins
```javascript
socket.on('player_joined', {
  room: { ... },  // Updated room data
  newPlayer: {
    socketId: string,
    name: string
  }
})
```

---

### 2. Game Start

#### `start_game` (Client → Server)
**Sent when**: Host clicks "Start Game"
```javascript
socket.emit('start_game', {
  roomCode: string,      // Room code
  totalRounds: number    // 5, 10, 15, or 20
})
```

**Response**: `game_started`
```javascript
socket.on('game_started', {
  room: {
    gameState: {
      isStarted: true,
      currentRound: 1,
      totalRounds: number,
      playerCards: {},
      playerScores: {}
    }
  },
  message: string
})
```

---

### 3. Round Flow

#### `start_round` (Client → Server)
**Sent when**: Game starts or next round begins
```javascript
socket.emit('start_round', {
  roomCode: string
})
```

**Response**: `round_started`
```javascript
socket.on('round_started', {
  roundNumber: number,      // Current round (1, 2, 3...)
  totalRounds: number,      // Total rounds in game
  message: string
})
```

---

#### `receive_card` (Server → Each Player)
**Sent to**: Each player individually with their card (hidden from others)
```javascript
socket.on('receive_card', {
  character: string,           // "RAM", "SEETHA", "LAXMAN", etc.
  characterName: string,       // "Ram", "Seetha", etc.
  characterPoints: number      // Points for this character
})
```

---

### 4. Gameplay

#### `ram_guess` (Client → Server)
**Sent when**: Ram player clicks "Submit Guess"
```javascript
socket.emit('ram_guess', {
  roomCode: string,
  targetPlayerId: string  // Socket ID of guessed player
})
```

**Response**: `round_results`
```javascript
socket.on('round_results', {
  ramCorrect: boolean,                    // true if guess was correct
  correctSeethaPlayer: string,            // Socket ID who had Seetha
  ramPlayer: string,                      // Socket ID who had Ram
  roundScores: {
    [socketId]: number  // Points earned this round
  },
  cumulativeScores: {
    [socketId]: number  // Total points so far
  },
  players: []  // List of all players
})
```

---

### 5. Between Rounds

#### `next_round_ready` (Server → All in Room)
**Sent to**: All players after round results
```javascript
socket.on('next_round_ready', {
  nextRound: number,    // Next round number
  message: string       // "Ready for next round?"
})
```

*Automatic transition to next round after 3 seconds*

---

### 6. Game End

#### `game_over` (Server → All in Room)
**Sent to**: All players when all rounds completed
```javascript
socket.on('game_over', {
  finalScores: {
    [socketId]: number  // Final score for each player
  },
  winner: {
    socketId: string,
    score: number
  },
  allPlayers: [
    {
      socketId: string,
      name: string,
      finalScore: number
    }
  ],
  sortedPlayers: [...]  // Ranked by score
})
```

---

## 🚪 Connection Events

#### `player_left` (Server → All in Room)
**Sent to**: Remaining players when someone leaves
```javascript
socket.on('player_left', {
  room: { ... },  // Updated room (without left player)
  message: string
})
```

---

#### `leave_room` (Client → Server)
**Sent when**: Player leaves game
```javascript
socket.emit('leave_room', {
  roomCode: string
})
```

**Response**: `left_room`
```javascript
socket.on('left_room', {
  message: string  // "You have left the room"
})
```

---

## 📊 Utility Events

#### `get_room` (Client → Server)
**Sent when**: Need current room data
```javascript
socket.emit('get_room', {
  roomCode: string
})
```

**Response**: `room_data`
```javascript
socket.on('room_data', {
  room: { ... }  // Current room state
})
```

---

#### `get_all_rooms` (Client → Server - DEBUG)
**Sent when**: Admin/debug - get all active rooms
```javascript
socket.emit('get_all_rooms')
```

**Response**: `all_rooms`
```javascript
socket.on('all_rooms', {
  rooms: [],        // All active room objects
  totalRooms: number
})
```

---

## 🔗 Connection Events (Built-in Socket.IO)

#### `connect`
**When**: Client successfully connects to server
```javascript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
})
```

---

#### `disconnect`
**When**: Client disconnects (browser close, network loss, etc.)
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected');
})
```

---

#### `connect_error`
**When**: Connection fails or error occurs
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
})
```

---

## 🎯 Event Flow Diagram

```
CLIENT                          SERVER
  │                              │
  ├─── create_room ────────────>│
  │                         roomManager.createRoom()
  │<──── room_created ──────────┤
  │                              │
  │                         (Player 2)
  ├─── join_room ────────────────>│
  │                         roomManager.joinRoom()
  │<──── room_joined ────────────┤
  │<──── player_joined ──────────┤ (broadcast)
  │                              │
  │    (Host clicks Start)        │
  ├─── start_game ───────────────>│
  │                         validatePlayers()
  │<──── game_started ───────────┤
  │                              │
  ├─── start_round ──────────────>│
  │                    assignCharacterCards()
  │<──── round_started ──────────┤
  │<──── receive_card ───────────┤ (individual)
  │                              │
  │    (Ram player guesses)       │
  ├─── ram_guess ────────────────>│
  │                    calculateScores()
  │<──── round_results ──────────┤
  │                              │
  │    (After 3 seconds)          │
  │<──── next_round_ready ───────┤
  │                              │
  │   (Repeat for each round)     │
  │                              │
  │    (After last round)         │
  │<──── game_over ──────────────┤
  │                              │
  ├─── leave_room ───────────────>│
  │<──── left_room ──────────────┤
```

---

## 💡 Usage Examples

### Creating a Room (Frontend)
```javascript
socket.emit('create_room', { playerName: 'Alice' });

socket.on('room_created', (data) => {
  console.log('Room code:', data.roomCode);
  setCurrentScreen('lobby');
});
```

### Joining a Room (Frontend)
```javascript
socket.emit('join_room', {
  roomCode: 'ABC123',
  playerName: 'Bob'
});

socket.on('room_joined', (data) => {
  console.log('Joined:', data.roomCode);
  setCurrentScreen('lobby');
});
```

### Making a Guess (Frontend)
```javascript
const guess = (targetPlayerId) => {
  socket.emit('ram_guess', {
    roomCode: 'ABC123',
    targetPlayerId: targetPlayerId
  });
};

socket.on('round_results', (data) => {
  console.log('Correct:', data.ramCorrect);
  console.log('New scores:', data.cumulativeScores);
});
```

---

## 🔒 Error Handling

All error responses follow this format:
```javascript
socket.on('error', {
  message: string  // Human-readable error message
})
```

**Common Errors**:
- "Room not found"
- "Room is full"
- "Game already started"
- "Only host can start the game"
- "Minimum 2 players required to start"
- "Only Ram player can make the guess"
- "Player already in room"
- "Player name is required"

---

## 🧪 Testing Socket Events

### Test with Console
```javascript
// In browser console
socket.emit('create_room', { playerName: 'TestPlayer' });

// Listen for response
socket.on('room_created', (data) => {
  console.log('Success:', data);
});
```

### Test with Node.js (Manual)
```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  socket.emit('create_room', { playerName: 'TestBot' });
});

socket.on('room_created', (data) => {
  console.log('Room created:', data.roomCode);
});
```

---

## 📝 Event Naming Convention

- **Event names**: camelCase, descriptive
- **Data objects**: CamelCase properties, descriptive
- **Errors**: Return error event with message
- **Broadcasts**: Auto-update all clients in room

---

## ⚡ Performance Notes

- Events are triggered immediately
- Room broadcasts optimized with Socket.IO rooms
- Game state is shared efficiently
- No polling or unnecessary requests

---

## 🔗 Related Files

- **Frontend**: `src/App.jsx` - Event listeners
- **Frontend**: `src/socket/socket.js` - Connection setup
- **Backend**: `server/socket/gameSocket.js` - All event handlers
- **Backend**: `server/rooms/rooms.js` - Room management

---

**Last Updated**: 2024
**Version**: 1.0
