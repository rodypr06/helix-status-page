# Production Deployment - Mac mini

Complete guide for deploying Helix Command Center on the Mac mini (192.168.50.19) using PM2.

---

## 📋 Overview

**Deployment Target:** Mac mini (Rodericks-Mini)  
**IP Address:** 192.168.50.19  
**Frontend Port:** 5174  
**API Port:** 5177  
**Process Manager:** PM2

---

## 🚀 Quick Deploy

### One-Command Deployment

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
./deploy-production.sh
```

This script will:
1. ✅ Create logs directory
2. ✅ Build frontend (pnpm build)
3. ✅ Install PM2 (if not present)
4. ✅ Stop existing processes
5. ✅ Start both services
6. ✅ Save PM2 configuration
7. ✅ Show status

---

## 📦 Manual Deployment

If you prefer manual control:

### 1. Install PM2 (one-time)

```bash
npm install -g pm2
```

### 2. Create logs directory

```bash
mkdir -p /Users/rrabelo/.openclaw/logs
```

### 3. Build frontend

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
pnpm build
```

Verify dist/ exists:
```bash
ls -la dist/
```

### 4. Start services

```bash
pm2 start ecosystem.config.js
```

### 5. Save configuration

```bash
pm2 save
```

### 6. Setup auto-start on reboot

```bash
pm2 startup
```

Then run the command it outputs (sudo required).

---

## 🎮 Management Commands

### Quick Control Script

```bash
# Status (default)
./manage.sh status

# Start services
./manage.sh start

# Stop services
./manage.sh stop

# Restart services
./manage.sh restart

# View logs (all)
./manage.sh logs

# View API logs only
./manage.sh logs api

# View frontend logs only
./manage.sh logs frontend

# Real-time monitoring
./manage.sh monit

# Health check
./manage.sh health

# Update and restart
./manage.sh update
```

### Direct PM2 Commands

```bash
# Status
pm2 status

# Logs (all)
pm2 logs

# Logs (specific)
pm2 logs helix-api
pm2 logs helix-frontend

# Restart specific service
pm2 restart helix-api
pm2 restart helix-frontend

# Restart all
pm2 restart all

# Stop all
pm2 stop all

# Real-time monitoring
pm2 monit

# Show detailed info
pm2 show helix-api

# Flush logs
pm2 flush

# Delete process (remove from PM2)
pm2 delete helix-api
```

---

## 🔍 Verification

### Check Services Running

```bash
pm2 status
```

Should show:
```
┌─────┬──────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ mode    │ ↺       │ status  │ cpu      │
├─────┼──────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ helix-api        │ fork    │ 0       │ online  │ 0%       │
│ 1   │ helix-frontend   │ fork    │ 0       │ online  │ 0%       │
└─────┴──────────────────┴─────────┴─────────┴─────────┴──────────┘
```

### Test API Endpoint

```bash
curl http://localhost:5177/health
# {"status":"ok","timestamp":"..."}

curl http://192.168.50.19:5177/health
# Should work from other devices on network
```

### Test Frontend

```bash
# Local
curl -I http://localhost:5174/

# Network
curl -I http://192.168.50.19:5174/
```

### Access from Browser

**Frontend:** http://192.168.50.19:5174  
**API Health:** http://192.168.50.19:5177/health

---

## 📊 Monitoring

### Real-time Monitoring

```bash
pm2 monit
```

Shows:
- CPU usage
- Memory usage
- Logs (real-time)
- Restarts count

### View Logs

```bash
# All logs
pm2 logs

# Last 100 lines
pm2 logs --lines 100

# API logs only
pm2 logs helix-api

# Frontend logs only
pm2 logs helix-frontend

# Follow logs (tail -f style)
pm2 logs --raw
```

### Log Files Location

```
/Users/rrabelo/.openclaw/logs/
├── helix-api-error.log
├── helix-api-out.log
├── helix-frontend-error.log
└── helix-frontend-out.log
```

---

## 🔄 Updates

### Update to Latest Version

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Pull latest code
git pull

# Install dependencies
pnpm install

# Build frontend
pnpm build

# Restart services
pm2 restart helix-api helix-frontend

# Or use the script
./manage.sh update
```

### Zero-Downtime Restart

```bash
pm2 reload helix-api
pm2 reload helix-frontend
```

---

## 🔧 Configuration

### PM2 Ecosystem Config

Located at: `ecosystem.config.js`

**API Service:**
- Port: 5177
- Environment: production
- Auto-restart: Yes
- Max restarts: 10

**Frontend Service:**
- Port: 5174
- Serves: dist/ (static files)
- Auto-restart: Yes

### Environment Variables

**Production (.env.production):**
```bash
VITE_API_URL=http://192.168.50.19:5177/api
```

**API Server (ecosystem.config.js):**
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 5177,
  OPENCLAW_PATH: '/Users/rrabelo/.openclaw'
}
```

---

## 🌐 Cloudflare Tunnel

Update tunnel configuration to point to port 5174:

```yaml
# Cloudflare config
ingress:
  - hostname: command.rodytech.net
    service: http://localhost:5174
```

Or via CLI:
```bash
cloudflared tunnel route dns helix-tunnel command.rodytech.net
```

---

## 🆘 Troubleshooting

### Services Won't Start

**Check if ports are in use:**
```bash
lsof -i :5174
lsof -i :5177
```

**Kill existing processes:**
```bash
pm2 delete all
pkill -f "serve"
pkill -f "node server.js"
```

**Then restart:**
```bash
pm2 start ecosystem.config.js
```

### Frontend 404 Errors

**Verify dist/ exists:**
```bash
ls -la dist/
```

**Rebuild:**
```bash
pnpm build
pm2 restart helix-frontend
```

### API Not Responding

**Check logs:**
```bash
pm2 logs helix-api --lines 50
```

**Restart API:**
```bash
pm2 restart helix-api
```

**Check OpenClaw is running:**
```bash
openclaw gateway status
```

### High Memory Usage

**Check memory:**
```bash
pm2 status
```

**Restart services:**
```bash
pm2 restart all
```

**Clear logs:**
```bash
pm2 flush
```

### Auto-start Not Working

**Reconfigure startup:**
```bash
pm2 unstartup
pm2 startup
# Run the command it outputs
pm2 save
```

**Verify startup script:**
```bash
launchctl list | grep PM2
```

---

## 🔐 Security Notes

### Current State (Development)
- ⚠️ No authentication
- ⚠️ No rate limiting
- ⚠️ Accessible on local network only

### Production Hardening (TODO)

1. **Add authentication to API**
2. **Enable rate limiting**
3. **Configure firewall rules**
4. **Set up HTTPS via Cloudflare**
5. **Restrict CORS origins**

---

## 📈 Performance

### Expected Resource Usage

**API Server:**
- Memory: ~50-80 MB
- CPU: <5% (idle), 10-30% (active)

**Frontend (serve):**
- Memory: ~30-50 MB
- CPU: <1%

**Total:**
- Memory: ~100-150 MB combined
- CPU: Minimal impact

### Optimization

If performance issues:
```bash
# Increase Node memory limit
pm2 delete helix-api
pm2 start api/server.js --name helix-api --node-args="--max-old-space-size=512"
```

---

## 🎯 Health Checks

### Automated Health Check

PM2 built-in health checks:
- Auto-restart on crash
- Min uptime: 10 seconds
- Max restarts: 10
- Restart delay: 4 seconds

### Manual Health Check

```bash
./manage.sh health
```

Or:
```bash
# API
curl http://localhost:5177/health

# Frontend
curl -I http://localhost:5174/
```

---

## 📱 Access Points

### Local Network
- **Frontend:** http://192.168.50.19:5174
- **API:** http://192.168.50.19:5177

### Via Cloudflare Tunnel (once configured)
- **Frontend:** https://command.rodytech.net

### Mobile PWA
1. Visit frontend URL on mobile
2. Install to home screen
3. Works offline (cached data)

---

## 🔄 Backup & Restore

### Backup PM2 Config

```bash
pm2 save
cp ~/.pm2/dump.pm2 ~/helix-backup-$(date +%Y%m%d).pm2
```

### Restore PM2 Config

```bash
pm2 resurrect
```

### Backup Application Files

```bash
cd /Users/rrabelo/.openclaw/workspace
tar -czf helix-status-page-backup-$(date +%Y%m%d).tar.gz helix-status-page/
```

---

## 📚 Additional Resources

**PM2 Documentation:** https://pm2.keymetrics.io/docs/usage/quick-start/  
**PM2 Ecosystem File:** https://pm2.keymetrics.io/docs/usage/application-declaration/

**Project Documentation:**
- USER_GUIDE.md - How to use features
- API_REFERENCE.md - API endpoints
- COMMAND-CENTER-COMPLETE.md - Implementation details

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] PM2 status shows both services online
- [ ] API health endpoint responds
- [ ] Frontend loads in browser
- [ ] Can spawn subagent from UI
- [ ] Task board loads/saves correctly
- [ ] Cron controls work
- [ ] PM2 startup configured (auto-start on reboot)
- [ ] Logs are being written
- [ ] Memory usage is reasonable
- [ ] Cloudflare tunnel updated (if applicable)

---

## 🎉 You're Live!

Once deployed:

1. **Access:** http://192.168.50.19:5174
2. **Monitor:** `pm2 monit`
3. **Manage:** `./manage.sh [command]`

**The Helix Command Center is now running 24/7 on your Mac mini!**

---

**Questions?** Check logs: `pm2 logs` or `./manage.sh logs`

**Last Updated:** 2026-02-09  
**Version:** 1.0.0 (Mac mini PM2 Deployment)
