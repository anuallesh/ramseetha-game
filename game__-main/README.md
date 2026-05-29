# 🎮 RamSeetha - Multiplayer Mythology Game

A full-stack multiplayer web game inspired by Indian mythology. Play with up to 6 friends in real-time using WebSocket connections.

## 📋 Table of Contents

- [Features](#features)
- [Game Rules](#game-rules)
- [Characters](#characters)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)

## ✨ Features

### Core Features
- ✅ Create and join rooms with unique 6-digit codes
- ✅ Real-time multiplayer gameplay with Socket.IO
- ✅ Support for 2-6 players per game
- ✅ Customizable rounds (5, 10, 15, 20)
- ✅ Hidden role cards with real-time reveal mechanics
- ✅ Live score tracking and updates
- ✅ Final winner determination with rankings

### UI/UX Features
- 📱 Fully responsive mobile-first design
- 🎨 Dark theme with Indian mythology-inspired colors
- ✨ Smooth animations and transitions
- 🎴 Interactive card reveal mechanics
- 📊 Real-time scoreboard updates
- ♿ Accessible design principles

### Backend Features
- 🔄 Real-time event-driven architecture
- 💾 In-memory game state management
- 🛡️ Player disconnect handling
- 🔑 Unique room code generation
- 📈 Score calculation and validation

## 🎯 Game Rules

### How to Play
1. **Create or Join**: Host creates a room, others join with the room code
2. **Select Rounds**: Host chooses number of rounds (5, 10, 15, or 20)
3. **Start Game**: Game begins when host clicks start (minimum 2 players)
4. **Card Assignment**: Each round, one character is randomly assigned to each player
5. **Ram's Guess**: Player with Ram card must guess who has the Seetha card
6. **Scoring**: 
   - If Ram guesses correctly: Ram gets 1000, Seetha gets 0
   - If Ram guesses wrong: Ram gets 0, Seetha gets 1000
   - Other players always get their character's points
7. **Rounds Continue**: Repeat until all rounds are completed
8. **Winner**: Player with highest total score wins

### Character Cards & Points
| Character | Points | Notes |
|-----------|--------|-------|
| 🙏 Ram | 1000 | Must make a guess |
| 👸 Seetha | 0 | Target of Ram's guess |
| ⚡ Laxman | 900 | Constant points |
| 🐵 Hanuman | 800 | Constant points |
| 👑 Bharath | 700 | Constant points |
| 🏹 Arjun | 600 | Constant points |

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **CSS3** - Animations and transitions

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket library
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)

## 📁 Project Structure

```
ramseetha-game/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PlayerCard.jsx
│   │   │   ├── ScoreTable.jsx
│   │   │   ├── LobbyPlayers.jsx
│   │   │   ├── RoundInfo.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Lobby.jsx
│   │   │   ├── Game.jsx
│   │   │   ├── Result.jsx
│   │   │   └── Winner.jsx
│   │   ├── socket/
│   │   │   └── socket.js       # Socket.IO configuration
│   │   ├── styles/
│   │   │   └── global.css      # Global styles & animations
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── .env.example            # Environment template
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── socket/
│   │   └── gameSocket.js       # Socket event handlers
│   ├── utils/
│   │   ├── generateRoomCode.js # Room code generation
│   │   ├── shuffleCards.js     # Card assignment logic
│   │   └── calculateScores.js  # Score calculation
│   ├── rooms/
│   │   └── rooms.js            # Room management
│   ├── server.js               # Express server setup
│   ├── .env.example            # Environment template
│   └── package.json
│
├── package.json                # Root package for concurrent dev
└── README.md                   # This file
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- Git (optional)

### Steps

1. **Clone the repository** (or download the files)
   ```bash
   git clone https://github.com/yourusername/ramseetha-game.git
   cd ramseetha-game
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   # Root dependencies
   npm install
   
   # Client dependencies
   cd client
   npm install
   cd ..
   
   # Server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Setup environment variables**
   
   Create `.env` in the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Create `.env` in the `client/` directory:
   ```bash
   cp client/.env.example client/.env
   ```

## 🎮 Running Locally

### Option 1: Run Both Client & Server Concurrently
```bash
npm run dev
```
This runs both the client (http://localhost:5173) and server (http://localhost:3001) simultaneously.

### Option 2: Run Separately in Different Terminals

**Terminal 1 - Client:**
```bash
npm run dev:client
```
Runs on http://localhost:5173

**Terminal 2 - Server:**
```bash
npm run dev:server
```
Runs on http://localhost:3001

### Access the Application
Open your browser and go to: **http://localhost:5173**

## 📦 Building for Production

### Build Both Client and Server
```bash
npm run build
```

### Build Only Client
```bash
npm run build:client
```

Output will be in `client/dist/`

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd client
   vercel
   ```

3. **Configure Environment Variable**
   - In Vercel dashboard, add environment variable:
     - Name: `VITE_SERVER_URL`
     - Value: `https://your-backend-url.com` (your Render backend URL)

### Deploy Backend to Render

1. **Create GitHub Repository**
   - Push your code to GitHub
   - Create a `.gitignore` file

2. **Create New Web Service on Render**
   - Go to render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory as root

3. **Configure Environment Variables**
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `CLIENT_URL`: https://your-vercel-url.vercel.app

4. **Deploy**
   - Click "Deploy"
   - Render will automatically build and deploy

### Post-Deployment
- Update the client's `VITE_SERVER_URL` to the Render backend URL
- Test all game functionality
- Monitor logs on both platforms

## 🏗️ Architecture

### Client-Server Communication

```
Client (React)
    ↓ Socket.IO Events
    ├─ create_room
    ├─ join_room
    ├─ start_game
    ├─ start_round
    ├─ ram_guess
    └─ leave_room
    ↑ Socket.IO Events
Server (Node.js + Express)
    ├─ Room Management (In-Memory)
    ├─ Game State Management
    ├─ Score Calculation
    └─ Event Broadcasting
```

### Game Flow

1. **Lobby Phase**
   - Players join room
   - Host selects rounds
   - Host starts game

2. **Game Round Phase**
   - Cards assigned to players
   - Players see their card
   - Ram makes guess
   - Scores calculated

3. **Results Phase**
   - Show round results
   - Update cumulative scores
   - Proceed to next round or end game

4. **Winner Phase**
   - Calculate final rankings
   - Display winner and scores

## 🔑 Key Components

### Frontend Components

**Navbar.jsx**
- Top navigation with game info
- Displays max players and min players

**Home.jsx**
- Landing page
- Create or join room forms
- Game rules and characters display

**Lobby.jsx**
- Player list display
- Room code sharing
- Round selection (host only)
- Start game button (host only)

**Game.jsx**
- Display current round info
- Player's hidden card
- Ram's guess interface
- Live player list

**Result.jsx**
- Show round results
- Display score updates
- Continue button

**Winner.jsx**
- Final standings
- Top 3 players highlight
- Play again option

### Backend Logic

**generateRoomCode.js**
- Creates 6-character alphanumeric codes
- Validates room code format

**shuffleCards.js**
- Fisher-Yates shuffle algorithm
- Assigns unique characters to players
- Maps character to point values

**calculateScores.js**
- Evaluates Ram's guess
- Updates scores based on results
- Calculates final winner

**rooms.js**
- Singleton room manager
- Manages room lifecycle
- Tracks game state
- Handles player connections/disconnections

## 💡 Best Practices Implemented

- ✅ **Separation of Concerns**: Components, pages, utilities clearly separated
- ✅ **DRY Principle**: Reusable components and utility functions
- ✅ **Error Handling**: Try-catch blocks and error messages
- ✅ **Real-time Sync**: Socket events keep all clients synchronized
- ✅ **Responsive Design**: Mobile-first approach with Tailwind
- ✅ **Code Comments**: Documented functions and important sections
- ✅ **Performance**: Optimized re-renders with React hooks
- ✅ **Security**: Input validation and sanitization

## 🐛 Troubleshooting

### Connection Issues
- Ensure both client and server are running
- Check if `VITE_SERVER_URL` matches your backend URL
- Verify firewall settings allow WebSocket connections

### Game Not Starting
- Minimum 2 players required
- Host must click "Start Game"
- Check browser console for errors

### Scores Not Updating
- Refresh browser
- Check if player is still connected
- Verify server is running

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

### Areas for Improvement
- [ ] User authentication and persistence
- [ ] Leaderboard and statistics
- [ ] Customizable game rules
- [ ] Sound effects and background music
- [ ] More characters and variations
- [ ] Mobile app version
- [ ] Game tutorials
- [ ] Replay functionality

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the developer.

---

**Happy Gaming! 🎮🏛️**

Made with ❤️ for mythology lovers and game enthusiasts.
