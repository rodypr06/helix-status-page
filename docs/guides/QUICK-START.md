# 🚀 Quick Start Guide - Helix Status Dashboard

## ⚡ 5-Minute Setup

### 1. Install & Run
```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
pnpm install
pnpm dev
```

That's it! Dashboard is now at **http://localhost:5173**

---

## 📋 Common Tasks

### View Dashboard
Open **http://localhost:5173** - Shows all key metrics

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Update Data
Dashboard auto-refreshes every 5 seconds. No manual action needed.

---

## 🎨 Customization

### Change Update Interval
Edit `src/App.vue`, line 28:
```javascript
updateInterval = setInterval(() => {
  lastUpdated.value = new Date()
}, 5000) // Change this number (milliseconds)
```

### Change Colors
Edit `src/style.css`:
```css
:root {
  --color-primary: #0ea5e9;    /* Primary blue */
  --color-primary-dark: #3b82f6;  /* Darker blue */
  --color-accent: #06b6d4;       /* Cyan accent */
  --color-bg: #0f172a;           /* Background */
}
```

### Add New Project
Edit `src/stores/projects.js`:
```javascript
{
  id: 'new-project',
  name: 'New Project',
  status: 'in-progress',
  progress: 0,
  lastUpdated: new Date(),
  description: 'Project description'
}
```

---

## 🔌 Connect Real Data

### Gateway API
Edit `src/stores/gateway.js`:
```javascript
export async function updateGatewayStatus() {
  const response = await fetch('http://127.0.0.1:18789/api/status')
  const data = await response.json()
  gatewayStore.status = data
}
```

### Backend API
```bash
cd backend
pnpm install  # Install express, cors
pnpm start    # Runs on http://localhost:3000
```

---

## 🐳 Docker

### Build & Run
```bash
docker build -t helix-status .
docker run -p 80:80 helix-status
```

### Docker Compose
```bash
docker-compose up -d
```

---

## 📱 Deploy to Cloud

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 📊 View All Features

| View | URL Path | Description |
|------|----------|-------------|
| Dashboard | `/` | Main overview with all metrics |
| Projects | Click "🚀 Projects" in sidebar | Project management |
| Analytics | Click "📈 Analytics" in sidebar | Token usage & costs |
| History | Click "📜 History" in sidebar | Activity timeline |

---

## 🎯 Key Metrics

### Gateway Status
- Uptime: How long Gateway has been running
- Connection: WebSocket status
- Memory: RAM usage in MB
- Model: Current AI model

### System Metrics
- CPU: Processor usage %
- Memory: RAM usage %
- Disk: Storage availability
- Network: Upload/Download speeds

### Token Usage
- Total: Lifetime tokens consumed
- Cost: Estimated cost ($)
- By Project: Tokens per project
- By Model: Tokens per AI model

---

## 🆘 Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Charts Not Showing
Make sure dependencies are installed:
```bash
pnpm install chart.js vue-chartjs
```

---

## 📚 Documentation

- **[README.md](README.md)** - Complete guide
- **[FEATURES.md](FEATURES.md)** - All features
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment options
- **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - Project overview

---

## 🎨 Shortcuts

| Action | Method |
|--------|--------|
| Navigate | Click sidebar icons |
| Filter | Use filter buttons |
| Search | Type in search box |
| Refresh | Waits 5 seconds auto |
| View Details | Click "View" button |
| Edit Item | Click "Edit" button |

---

## ✅ Pre-Flight Checklist

Before deploying:
- [ ] Run `pnpm build` - should succeed
- [ ] Test `pnpm preview` - should work
- [ ] Check all views load correctly
- [ ] Verify charts display properly
- [ ] Test responsive design (resize browser)
- [ ] Review environment variables
- [ ] Set up GitHub token (for GitHub integration)

---

## 📞 Support

For issues or questions:
1. Check console for errors (F12)
2. Review documentation files
3. Check GitHub token is set
4. Verify Gateway is running
5. Check backend API is running (if used)

---

## 🎉 You're Ready!

Dashboard is now running at **http://localhost:5173**

Enjoy monitoring Helix in style! 🚀
