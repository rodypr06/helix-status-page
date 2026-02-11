# 🚀 Deployment Summary - Helix Command Center

**Target:** Mac mini (192.168.50.19)  
**Strategy:** PM2 Process Manager  
**Date:** February 9, 2026  
**Status:** ✅ READY TO DEPLOY

---

## 📋 Quick Deploy Instructions

### Step 1: Install PM2 (if not already installed)

```bash
npm install -g pm2
```

### Step 2: Deploy

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
./deploy-production.sh
```

### Step 3: Configure Auto-Start

```bash
pm2 startup
# Run the command it outputs (requires sudo)
```

### Step 4: Verify

```bash
./manage.sh status
./manage.sh health
```

**Done!** Access at: http://192.168.50.19:5174

---

## 🎯 What Gets Deployed

### Services

| Service | Port | Purpose | Process Manager |
|---------|------|---------|-----------------|
| **helix-frontend** | 5174 | Vue app (static files) | PM2 |
| **helix-api** | 5177 | Express API server | PM2 |

### Files Created

```
helix-status-page/
├── ecosystem.config.js          # PM2 configuration
├── deploy-production.sh         # Deployment script
├── manage.sh                    # Management script
├── .env.production              # Production env vars
├── DEPLOYMENT_MAC_MINI.md       # Full deployment guide
└── dist/                        # Built frontend (554 KiB)
```

### Logs Location

```
/Users/rrabelo/.openclaw/logs/
├── helix-api-error.log          # API errors
├── helix-api-out.log            # API stdout
├── helix-frontend-error.log     # Frontend errors
└── helix-frontend-out.log       # Frontend stdout
```

---

## 🔧 Configuration

### Frontend (.env.production)

```bash
VITE_API_URL=http://192.168.50.19:5177/api
```

### API Server (ecosystem.config.js)

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 5177,
  OPENCLAW_PATH: '/Users/rrabelo/.openclaw'
}
```

---

## 🎮 Management Commands

### Quick Control

```bash
./manage.sh start      # Start services
./manage.sh stop       # Stop services
./manage.sh restart    # Restart services
./manage.sh status     # Show status
./manage.sh logs       # View logs
./manage.sh health     # Health check
./manage.sh update     # Update and restart
```

### PM2 Direct Commands

```bash
pm2 status             # Service status
pm2 logs               # View logs
pm2 monit              # Real-time monitoring
pm2 restart all        # Restart all services
```

---

## ✅ Post-Deployment Checklist

After running `./deploy-production.sh`:

- [ ] PM2 shows both services online
- [ ] API health check passes: `curl http://localhost:5177/health`
- [ ] Frontend loads: `curl -I http://localhost:5174/`
- [ ] Test spawn subagent from UI
- [ ] Test task creation
- [ ] Test cron controls
- [ ] Configure PM2 startup: `pm2 startup`
- [ ] Save PM2 config: `pm2 save`
- [ ] Update Cloudflare tunnel (optional)

---

## 🌐 Access Points

### Local Network

**Frontend:** http://192.168.50.19:5174  
**API:** http://192.168.50.19:5177/health

### Via Cloudflare Tunnel (optional)

Update tunnel config to point to port 5174:

```bash
# Update Cloudflare tunnel
cloudflared tunnel route dns <tunnel-name> command.rodytech.net
```

Then access via: https://command.rodytech.net

---

## 📊 Resource Usage

**Expected:**
- **Memory:** ~100-150 MB combined
- **CPU:** <5% idle, 10-30% active
- **Disk:** ~2 MB (logs grow over time)

**Monitor:**
```bash
pm2 monit              # Real-time
./manage.sh status     # Current status
```

---

## 🔍 Verification Commands

```bash
# 1. Check services running
pm2 status

# 2. Test API
curl http://localhost:5177/health
# Expected: {"status":"ok","timestamp":"..."}

# 3. Test frontend
curl -I http://localhost:5174/
# Expected: HTTP/1.1 200 OK

# 4. Test from network (different device)
curl http://192.168.50.19:5174/
curl http://192.168.50.19:5177/health

# 5. Test UI actions
# Open browser: http://192.168.50.19:5174
# Try spawning a subagent
# Try creating a task
```

---

## 🆘 Troubleshooting

### Services Won't Start

```bash
# Check ports
lsof -i :5174
lsof -i :5177

# Kill conflicts
pm2 delete all
pkill -f serve
pkill -f "node server.js"

# Restart
pm2 start ecosystem.config.js
```

### API Not Responding

```bash
# Check logs
pm2 logs helix-api --lines 50

# Verify OpenClaw running
openclaw gateway status

# Restart
pm2 restart helix-api
```

### Frontend 404s

```bash
# Verify build exists
ls -la dist/

# Rebuild
pnpm build
pm2 restart helix-frontend
```

### Auto-start Not Working

```bash
# Reconfigure
pm2 unstartup
pm2 startup
# Run the command it outputs
pm2 save

# Verify
launchctl list | grep PM2
```

---

## 🔄 Updates

### Update to Latest Code

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
git pull
pnpm install
pnpm build
pm2 restart all

# Or use the shortcut
./manage.sh update
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **DEPLOYMENT_MAC_MINI.md** | Complete Mac mini deployment guide |
| **DEPLOYMENT_QUICKSTART.md** | Fast deployment options |
| **USER_GUIDE.md** | How to use features |
| **API_REFERENCE.md** | API endpoints |
| **COMMAND-CENTER-COMPLETE.md** | Build summary |

---

## 🎉 Success Indicators

You'll know deployment succeeded when:

1. ✅ `pm2 status` shows both services online
2. ✅ Frontend loads in browser (port 5174)
3. ✅ API health check passes (port 5177)
4. ✅ Can spawn subagent from UI
5. ✅ Task board loads and saves
6. ✅ Logs are being written
7. ✅ Services auto-restart on crash
8. ✅ Services auto-start on reboot

---

## 🚀 Next Steps After Deployment

### Immediate

1. **Test all features** - Spawn subagent, create task, control cron
2. **Monitor logs** - `pm2 logs` for first 30 minutes
3. **Check resources** - `pm2 monit` to verify usage

### Short-term

4. **Configure auto-start** - `pm2 startup` + `pm2 save`
5. **Update Cloudflare tunnel** - Point to port 5174
6. **Test from mobile** - Install PWA on phone

### Long-term

7. **Add authentication** - Secure the API
8. **Enable rate limiting** - Prevent abuse
9. **Set up monitoring** - Error tracking (Sentry)
10. **Configure backups** - Weekly PM2 config + code backups

---

## 🔐 Security Considerations

### Current State
- ⚠️ No authentication (local network only)
- ⚠️ No rate limiting
- ⚠️ HTTP only (not HTTPS)

### Recommended Hardening
1. Add API key authentication
2. Enable rate limiting (express-rate-limit)
3. Use Cloudflare tunnel for HTTPS
4. Restrict CORS origins
5. Configure firewall rules

---

## 📞 Support

**Check logs:** `pm2 logs` or `./manage.sh logs`  
**Health check:** `./manage.sh health`  
**Full guide:** See DEPLOYMENT_MAC_MINI.md

---

## 🎯 Deployment Readiness Score

### ✅ Ready to Deploy

- ✅ Frontend built (dist/ exists)
- ✅ API server configured
- ✅ PM2 ecosystem config created
- ✅ Deployment script ready
- ✅ Management script ready
- ✅ Logs directory structure defined
- ✅ Environment variables configured
- ✅ Documentation complete
- ✅ Auto-restart configured
- ✅ Health checks implemented

**Score: 10/10** - Ready for production!

---

## 🚀 Deploy Now

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
./deploy-production.sh
```

**Then access:** http://192.168.50.19:5174

---

**Last Updated:** 2026-02-09  
**Version:** 1.0.0  
**Deployment Target:** Mac mini (192.168.50.19)  
**Process Manager:** PM2  
**Status:** ✅ PRODUCTION READY
