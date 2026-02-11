# Deployment Quick Start - Helix Command Center

Fast-track guide to deploying the Helix Command Center in production.

---

## 🚀 Quick Deploy (3 Options)

### Option 1: All-in-One Node Server (Recommended)

**Best for:** Simple production deployments, single-server setups

```bash
# 1. Build frontend
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
pnpm build

# 2. Start production server (serves both API + static files)
cd api
NODE_ENV=production PORT=8080 node server.js

# Or use PM2 for auto-restart
pm2 start server.js --name helix-command-center --env production
pm2 save
```

**Access:** `http://your-server:8080`

**Features:**
- ✅ Single process
- ✅ Static files + API from one server
- ✅ Easy to manage
- ✅ Built-in health checks

---

### Option 2: Docker (Single Container)

**Best for:** Containerized deployments, Coolify, cloud platforms

```bash
# Build image
docker build -f Dockerfile.fullstack -t helix-command-center .

# Run container
docker run -d \
  --name helix-command-center \
  -p 8080:8080 \
  -v ~/.openclaw:/root/.openclaw:ro \
  -v ~/.openclaw/workspace:/app/workspace:rw \
  -e NODE_ENV=production \
  -e PORT=8080 \
  helix-command-center

# Or use docker-compose
docker-compose up -d
```

**Access:** `http://your-server:8080`

---

### Option 3: Separate Frontend + Backend

**Best for:** High-traffic deployments, CDN distribution, microservices

**Frontend (Static):**
```bash
# Build
pnpm build

# Serve with nginx/caddy/serve
npx serve dist -p 80

# Or deploy dist/ to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - AWS S3 + CloudFront
```

**Backend (API):**
```bash
# Run API separately
cd api
PORT=5175 node server.js

# Or use PM2
pm2 start server.js --name helix-api
```

**Configure frontend to point to API:**
```bash
# .env.production
VITE_API_URL=https://api.your-domain.com
```

---

## 🔧 Environment Variables

### Required

```bash
NODE_ENV=production        # Enables production mode
PORT=8080                  # Server port (default: 5175)
```

### Optional

```bash
OPENCLAW_PATH=/path/to/.openclaw    # OpenClaw config location
VITE_API_URL=http://api.url        # Frontend: API endpoint
```

---

## 🔒 Production Checklist

Before going live:

### Security
- [ ] Add authentication (API keys or JWT)
- [ ] Enable rate limiting (express-rate-limit)
- [ ] Configure CORS whitelist
- [ ] Use HTTPS/TLS certificates
- [ ] Set secure environment variables
- [ ] Disable debug logging

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor memory usage
- [ ] Set up health checks

### Reliability
- [ ] Use process manager (PM2, systemd)
- [ ] Configure auto-restart
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure backup strategy
- [ ] Test failover scenarios

### Code Changes Needed

**1. Add Authentication (api/server.js):**
```javascript
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Protect routes
app.use('/api/', authenticate)
```

**2. Add Rate Limiting:**
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
})

app.use('/api/', limiter)
```

**3. Configure CORS:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-domain.com')
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')
  next()
})
```

---

## 🐳 Docker Production Tips

**Health Checks:**
Already configured in Dockerfile.fullstack:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:8080/health', ...)"
```

**Volume Mounts:**
```bash
# Read-only OpenClaw config
-v ~/.openclaw:/root/.openclaw:ro

# Read-write workspace (for PENDING_TASKS.md)
-v ~/.openclaw/workspace:/app/workspace:rw
```

**Logs:**
```bash
docker logs -f helix-command-center
```

**Updates:**
```bash
# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🌐 Reverse Proxy (nginx)

**nginx.conf example:**
```nginx
server {
    listen 80;
    server_name command.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name command.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Monitoring

**PM2 Monitoring:**
```bash
pm2 monit                    # Real-time monitoring
pm2 logs helix-command-center  # View logs
pm2 restart helix-command-center  # Restart
```

**Health Check Endpoint:**
```bash
curl http://localhost:8080/health
# {"status":"ok","timestamp":"..."}
```

**System Metrics:**
```bash
# Memory
ps aux | grep node

# CPU
top -p $(pgrep -f "node server.js")

# Disk
df -h
```

---

## 🔄 Updates

**Rolling Updates:**
```bash
# 1. Pull latest changes
git pull

# 2. Install dependencies
pnpm install

# 3. Build frontend
pnpm build

# 4. Restart backend
pm2 restart helix-command-center
```

**Zero-Downtime (with PM2):**
```bash
pm2 reload helix-command-center
```

---

## 🆘 Troubleshooting

### Server Won't Start

**Check ports:**
```bash
lsof -i :8080
# Kill existing process if needed
```

**Check logs:**
```bash
pm2 logs helix-command-center --lines 50
# Or
tail -f /tmp/helix-api.log
```

### Static Files Not Serving

**Verify dist/ exists:**
```bash
ls -la dist/
```

**Check NODE_ENV:**
```bash
echo $NODE_ENV  # Should be "production"
```

### API Endpoints 404

**Check server logs:**
```bash
curl http://localhost:8080/health
```

**Verify API routes registered:**
Look for "API Endpoints:" in server logs

### High Memory Usage

**Restart server:**
```bash
pm2 restart helix-command-center
```

**Increase Node memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" node server.js
```

---

## 📱 Mobile Access

**Install as PWA:**
1. Visit `https://your-domain.com` on mobile
2. Look for install prompt
3. Add to home screen

**iOS:** Safari > Share > Add to Home Screen  
**Android:** Chrome > Menu > Install app

---

## 🎯 Quick Reference

**Development:**
```bash
./start-dev.sh
# Frontend: http://localhost:5173
# API: http://localhost:5175
```

**Production (All-in-One):**
```bash
pnpm build
NODE_ENV=production PORT=8080 node api/server.js
# Access: http://localhost:8080
```

**Production (PM2):**
```bash
pm2 start api/server.js --name helix-command-center --env production
pm2 save
pm2 startup
```

**Docker:**
```bash
docker-compose up -d
# Access: http://localhost:8080
```

---

## 📚 Full Documentation

- **USER_GUIDE.md** - How to use all features
- **API_REFERENCE.md** - Complete API documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **COMMAND-CENTER-COMPLETE.md** - Implementation summary

---

**Questions?** Check the full documentation or ask in main session!

**Last Updated:** 2026-02-09  
**Version:** 1.0.0
