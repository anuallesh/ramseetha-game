# RamSeetha Development Guide

## Project Overview

RamSeetha is a real-time multiplayer game built with modern web technologies. This guide explains the architecture and helps developers understand and extend the codebase.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Browser Clients (React)                   │
│  - Lobby, Game, Results, Winner screens                     │
│  - Real-time UI updates via Socket.IO                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                    Socket.IO
                    WebSocket
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Backend Server (Node.js + Express)             │
│  - Room management                                          │
│  - Game state logic                                         │
│  - Score calculation                                        │
│  - Event broadcasting                                       │
└─────────────────────────────────────────────────────────────┘
```

### Game State Management

The game state is managed entirely on the server in memory:

```javascript
Room {
  roomCode: "ABC123",
  hostId: "socket-id-123",
  players: [
    { socketId, name, isHost, joinedAt }
  ],
  gameState: {
    isStarted: boolean,
    currentRound: number,
    totalRounds: number,
    playerCards: { socketId: "character" },
    ramGuess: "socket-id-of-guessed-player",
    playerScores: { socketId: totalScore }
  }
}
```

## Frontend Development

### Component Hierarchy

```
App (Main Container)
├── Navbar (Top Navigation)
├── Home (Landing Page)
│   ├── Create Room Form
│   └── Join Room Form
├── Lobby (Waiting Area)
│   ├── LobbyPlayers (Player List)
│   └── Round Selection (Host Only)
├── Game (Main Gameplay)
│   ├── RoundInfo (Round Progress)
│   ├── PlayerCard (Hidden Card)
│   └── Other Players (For Guessing)
├── Result (Round Results)
│   └── ScoreTable (Score Display)
└── Winner (Final Results)
    └── ScoreTable (Final Scores)
```

### React Hooks Usage

```javascript
// State Management
const [currentScreen, setCurrentScreen] = useState('home');
const [gameData, setGameData] = useState(null);

// Side Effects
useEffect(() => {
  socket.on('game_started', (data) => {
    setCurrentScreen('game');
  });
  
  return () => {
    socket.off('game_started');
  };
}, []);
```

### Socket.IO Client Events

**Emitted (Client → Server):**
```javascript
socket.emit('create_room', { playerName });
socket.emit('join_room', { roomCode, playerName });
socket.emit('start_game', { roomCode, totalRounds });
socket.emit('start_round', { roomCode });
socket.emit('ram_guess', { roomCode, targetPlayerId });
socket.emit('leave_room', { roomCode });
```

**Received (Server → Client):**
```javascript
socket.on('room_created', (data) => {});
socket.on('player_joined', (data) => {});
socket.on('game_started', (data) => {});
socket.on('round_started', (data) => {});
socket.on('receive_card', (data) => {});
socket.on('round_results', (data) => {});
socket.on('next_round_ready', (data) => {});
socket.on('game_over', (data) => {});
```

### Styling with Tailwind

Custom Tailwind utilities defined in `global.css`:

```css
.btn-primary { /* Gold gradient button */ }
.card { /* Styled card container */ }
.badge { /* Status badges */ }
.text-gradient { /* Gradient text effect */ }
```

### Adding a New Feature

Example: Adding player profile pictures

1. **Component Update** (`PlayerCard.jsx`)
   ```javascript
   export default function PlayerCard({ player, avatar, ... }) {
     return (
       <img src={avatar} className="w-12 h-12 rounded-full" />
     );
   }
   ```

2. **State Management** (`App.jsx`)
   ```javascript
   const [playerAvatar, setPlayerAvatar] = useState(null);
   ```

3. **Socket Event** (`gameSocket.js`)
   ```javascript
   socket.on('player_joined', (data) => {
     // Include avatar in player data
   });
   ```

## Backend Development

### Room Manager (Singleton Pattern)

```javascript
class RoomManager {
  createRoom(roomCode, hostId, hostName) {}
  joinRoom(roomCode, playerId, playerName) {}
  removePlayer(roomCode, playerId) {}
  getRoom(roomCode) {}
  updateGameState(roomCode, updates) {}
}

export default new RoomManager(); // Singleton instance
```

### Socket Event Flow

```
Client: create_room
  ↓
Server: socket.on('create_room')
  ↓
RoomManager: createRoom()
  ↓
Emit: socket.emit('room_created')
  ↓
Client: socket.on('room_created')
  ↓
Update: setCurrentScreen('lobby')
```

### Score Calculation Logic

```javascript
// inputs
playerCards = { 'socket-1': 'ram', 'socket-2': 'seetha', ... }
ramGuess = 'socket-2' // Ram guessed this player has Seetha

// calculation
const ramCorrect = ramGuess === seethaPlayer
const ramScore = ramCorrect ? 1000 : 0
const seethaScore = ramCorrect ? 0 : 1000

// outputs
roundScores = {
  'socket-1': ramScore,      // Ram player
  'socket-2': seethaScore,   // Seetha player
  'socket-3': 900,           // Laxman (always gets points)
  ...
}
```

### Adding Game Rules Validation

Example: Prevent multiple guesses

```javascript
// In gameSocket.js - ram_guess handler
socket.on('ram_guess', (data) => {
  const room = roomManager.getRoom(roomCode);
  
  // Validation
  if (room.gameState.ramGuess !== null) {
    socket.emit('error', { message: 'Guess already made' });
    return;
  }
  
  // Process guess...
});
```

## Database Integration (Future)

If you want to add persistence:

### Install MongoDB
```bash
npm install mongoose
```

### Add Schema Example
```javascript
// models/Game.js
const gameSchema = new Schema({
  roomCode: String,
  players: [{ name, score }],
  rounds: Number,
  timestamp: Date
});
```

### Store Game Results
```javascript
// In gameSocket.js after game_over
const game = new Game({
  roomCode,
  players: room.players,
  rounds: room.gameState.totalRounds,
  timestamp: new Date()
});
await game.save();
```

## Testing

### Unit Testing Example

```javascript
// test/shuffleCards.test.js
import { assignCharacterCards } from '../utils/shuffleCards';

describe('assignCharacterCards', () => {
  it('should assign unique cards to players', () => {
    const players = [
      { socketId: '1' },
      { socketId: '2' },
      { socketId: '3' }
    ];
    
    const cards = assignCharacterCards(players);
    
    expect(Object.values(cards)).toHaveLength(3);
    expect(new Set(Object.values(cards)).size).toBe(3);
  });
});
```

### Integration Testing

```javascript
// test/gameFlow.test.js
describe('Game Flow', () => {
  it('should complete a full game', async () => {
    // 1. Create room
    // 2. Join players
    // 3. Start game
    // 4. Play rounds
    // 5. Calculate winner
  });
});
```

## Performance Optimization

### Frontend
- Memoize components to avoid unnecessary re-renders
  ```javascript
  const PlayerCard = React.memo(function PlayerCard(props) {
    return <div>{props.name}</div>;
  });
  ```

- Use lazy loading for components
  ```javascript
  const Winner = lazy(() => import('./pages/Winner'));
  ```

### Backend
- Use room code indexing for fast lookups
- Implement connection pooling for database (future)
- Cache room data if needed

## Security Considerations

### Current Implementation
- Input validation on player names
- Room code validation
- CORS configuration

### Future Enhancements
- Add authentication (JWT tokens)
- Implement rate limiting
- Add data sanitization
- Use HTTPS/WSS only
- Implement player ban system

## Debugging

### Client Debugging
```javascript
// In App.jsx or any component
socket.on('debug', (data) => {
  console.group('Game Event');
  console.table(data);
  console.groupEnd();
});
```

### Server Debugging
```javascript
// In server.js
io.use((socket, next) => {
  console.log(`[${new Date().toISOString()}] Socket: ${socket.id}`);
  next();
});
```

### Common Issues

**Problem**: Players disconnecting randomly
**Solution**: Check network logs, increase reconnection timeout

**Problem**: Scores not calculating correctly
**Solution**: Check `calculateScores.js` logic against game rules

**Problem**: Cards not hidden properly
**Solution**: Verify socket event only sends card to intended player

## Deployment Checklist

- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Rate limiting added
- [ ] Database connected (if applicable)
- [ ] Tests passing
- [ ] Performance tested
- [ ] Security audit passed
- [ ] README updated

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request with description

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns
- Format with Prettier (if available)

## Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Happy Developing!** 🚀
