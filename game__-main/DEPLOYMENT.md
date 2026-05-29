# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- GitHub account and repository
- Vercel account (for frontend)
- Render account (for backend)
- Node.js and npm installed locally

## Environment Setup

### Local Development Environment Files

Create `.env` file in `server/`:
```
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MAX_PLAYERS=6
MIN_PLAYERS=2
```

Create `.env` file in `client/`:
```
VITE_SERVER_URL=http://localhost:3001
```

## Production Deployment

### Step 1: Push to GitHub

1. Initialize git repository (if not already)
```bash
git init
git add .
git commit -m "Initial commit: RamSeetha game"
git branch -M main
git remote add origin https://github.com/yourusername/ramseetha-game.git
git push -u origin main
```

2. Create `.gitignore` at root:
```
node_modules/
client/dist/
client/node_modules/
server/node_modules/
.env
.env.local
*.log
.DS_Store
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `ramseetha-server`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

6. Add Environment Variables:
   - `PORT`: `3001`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-vercel-app.vercel.app` (add after frontend deployment)

7. Click "Create Web Service"

**Note**: Render URL will be something like `https://ramseetha-server.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: `https://ramseetha-server.onrender.com` (your Render backend URL)

7. Click "Deploy"

### Step 4: Update Backend Client URL (Optional)

After frontend is deployed:
1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `CLIENT_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
5. Click "Save Changes" - service will auto-redeploy

## Verification Checklist

- [ ] Backend server is running on Render
- [ ] Frontend is deployed on Vercel
- [ ] Can create a room from home page
- [ ] Can join a room with room code
- [ ] Real-time updates work across browser tabs
- [ ] Game logic works correctly
- [ ] Scores calculate properly
- [ ] Mobile responsive design works

## Monitoring & Maintenance

### Render Dashboard
- View logs: Dashboard → Your Service → Logs
- Monitor performance: Dashboard → Metrics
- Restart service if needed: Dashboard → Manual Deploy

### Vercel Dashboard
- View deployment logs: Deployments → Click deployment
- Monitor analytics: Analytics tab
- Rollback to previous version if needed

## Common Deployment Issues

### Issue: "Cannot GET /" on Vercel
**Solution**: Ensure root directory is set to `client` and build output is `dist`

### Issue: Backend connection refused
**Solution**: Verify `VITE_SERVER_URL` environment variable is correctly set to Render URL

### Issue: CORS errors
**Solution**: Update `CLIENT_URL` in server `.env` to match Vercel deployment URL

### Issue: Real-time updates not working
**Solution**: Check that WebSocket is enabled in both Render and Vercel settings

## Performance Optimization

### Frontend (Vercel)
- Build output is minified and optimized by Vite
- Static assets are cached and served via CDN
- Consider enabling "Edge Middleware" for advanced features

### Backend (Render)
- In-memory storage is efficient for game state
- Consider adding Redis if persistent storage needed
- Monitor CPU and memory usage

## Scaling Considerations

For production with many concurrent games:

1. **Game State Persistence**
   ```bash
   npm install redis
   # Use Redis for distributed game state
   ```

2. **Load Balancing**
   - Render handles this automatically with multiple dynos
   - Enable "Enable Suspend on Inactive" for cost savings

3. **Database** (Optional)
   ```bash
   npm install mongoose
   # Store player stats, leaderboards, game history
   ```

## Backup & Recovery

1. **Code Backup**
   - GitHub repository serves as backup
   - All code is version controlled

2. **Game Data**
   - Currently stored in memory (lost on restart)
   - Implement database for persistence if needed

3. **Deployment Rollback**
   - Vercel: Go to Deployments tab, select previous version
   - Render: Use "Manual Deploy" to redeploy previous commit

## Cost Estimation

- **Vercel**: Free tier (generous for this project)
- **Render**: Free tier available, upgrades starting at $7/month
- **Total**: Can run completely free or ~$7-15/month depending on usage

## Advanced Configuration

### Custom Domain (Optional)

**For Vercel:**
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Render:**
1. Go to Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

### SSL/HTTPS
- Both Vercel and Render provide free SSL certificates
- Automatically configured and renewed

## Maintenance

- Monitor logs weekly
- Update dependencies monthly
- Test game regularly
- Track any errors or issues
- Plan feature upgrades

---

**Deployment Complete!** 🚀

Your RamSeetha game is now live and accessible to the world!
