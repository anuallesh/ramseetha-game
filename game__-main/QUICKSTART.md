# 🚀 Quick Start Guide - RamSeetha Game

Get started with RamSeetha in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm run install-all
```

This installs dependencies for root, client, and server in one command.

### 2. Setup Environment Variables

For **Server** (`server/.env`):
```
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

For **Client** (`client/.env`):
```
VITE_SERVER_URL=http://localhost:3001
```

### 3. Start Development Server
```bash
npm run dev
```

This starts both client and server concurrently.

### 4. Open in Browser
```
http://localhost:5173
```

## 🎮 Play the Game

1. **Create Room**: Click "Create Room" on home page
2. **Share Room Code**: Give the 6-character code to friends
3. **Friends Join**: Click "Join Room" and enter room code
4. **Select Rounds**: Host chooses number of rounds (5, 10, 15, 20)
5. **Start Game**: Host clicks "Start Game"
6. **Play Rounds**: Each round, guess who has the Seetha card
7. **See Results**: View scores after each round
8. **Winner**: After all rounds, see who won!

## 📁 Running Services Separately

If `npm run dev` doesn't work for you:

### Terminal 1 - Client
```bash
cd client
npm run dev
```
Client runs on: http://localhost:5173

### Terminal 2 - Server
```bash
cd server
npm run dev
```
Server runs on: http://localhost:3001

## 🔧 Development Tips

### Build for Production
```bash
npm run build
```
Creates optimized builds in `client/dist/` and `server/`

### Check for Errors
```bash
# Client
cd client
npm run lint

# Server - check Node syntax
node --check server.js
```

### View Server Logs
When running, server logs look like:
```
╔════════════════════════════════════╗
║    🎮 RamSeetha Game Server 🎮    ║
╠════════════════════════════════════╣
║ Server running at: http://localhost:3001
║ Environment: development
╚════════════════════════════════════╝
```

## 🌐 Deploy to Production

When ready to share with the world:

### Deploy Backend (Render)
```bash
git push origin main
# Go to render.com and connect your GitHub repo
```

### Deploy Frontend (Vercel)
```bash
git push origin main
# Go to vercel.com and import your project
# Set VITE_SERVER_URL to your Render backend URL
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Project Structure at a Glance

```
ramseetha-game/
├── client/          ← React frontend (Vite)
│   └── src/components, pages, socket...
├── server/          ← Node.js backend (Express)
│   └── socket, utils, rooms...
├── README.md        ← Full documentation
├── DEPLOYMENT.md    ← Deployment guide
└── DEVELOPMENT.md   ← Developer guide
```

## 🎯 Game Rules Quick Reference

| Scenario | Points |
|----------|--------|
| Ram guesses correctly | Ram: 1000, Seetha: 0 |
| Ram guesses wrong | Ram: 0, Seetha: 1000 |
| Others get character | See character value |

**Characters**: Ram (1000), Seetha (0), Laxman (900), Hanuman (800), Bharath (700), Arjun (600)

## ❓ Troubleshooting

### "Cannot find module" error
```bash
npm run install-all
```

### "Port already in use" error
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Connection refused on game screen
- Check server is running on port 3001
- Check `VITE_SERVER_URL` environment variable
- Check browser console for errors (F12)

### Real-time updates not working
- Make sure WebSocket connection is established
- Check Network tab in browser DevTools
- Try refreshing the page

## 📚 Next Steps

1. **Read Full Docs**: Check [README.md](README.md)
2. **Understand Architecture**: See [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize**: Add your own features!

## 🎉 You're All Set!

```
 ____                    ____            _   _           
|  _ \ __ _ _ __ ___   / ___|  ___  ___| |_| |__   __ _ 
| |_) / _` | '_ ` _ \  \___ \ / _ \/ _ \ __| '_ \ / _` |
|  _ < (_| | | | | | |  ___) |  __/  __/ |_| | | | (_| |
|_| \_\__,_|_| |_| |_| |____/ \___|\___|\__|_| |_|\__,_|
```

Have fun playing RamSeetha! 🎮🎊

---

For issues or questions, check the [README.md](README.md) or [DEVELOPMENT.md](DEVELOPMENT.md)
