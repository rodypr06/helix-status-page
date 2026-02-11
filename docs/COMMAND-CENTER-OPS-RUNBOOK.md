# Helix Command Center - Operations Runbook
**Version:** 1.0  
**Date:** 2026-02-10  
**Production Architecture**

---

## Quick Reference

### Service Status
```bash
# Check status
pm2 status helix-command-center

# Check health
curl http://localhost:5177/health

# Check logs
pm2 logs helix-command-center --lines 50
```

### Start/Stop/Restart
```bash
# Start
pm2 start ecosystem.config.cjs

# Stop
pm2 stop helix-command-center

# Restart (graceful)
pm2 restart helix-command-center

# Reload (zero-downtime, if using cluster mode)
pm2 reload helix-command-center
```

---

## Architecture Overview

**Current Setup (Production):**
```
Express Server (port 5177, PM2-managed)
├─ Static Files (Vite dist/) → /, /assets/*, /icons/*
└─ API Routes → /api/*
```

**Key Files:**
- **Server:** `/api/server.js`
- **PM2 Config:** `ecosystem.config.cjs`
- **Frontend Build:** `dist/` (generated from `pnpm build`)
- **Logs:** `logs/out.log`, `logs/error.log`

**Ports:**
- **5177** - Main HTTP server (static + API)
- **5174** - (Legacy Vite dev, not used in production)

---

## Common Operations

### 1. Deploy Frontend Updates

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Build frontend
pnpm build

# Restart server (picks up new dist/)
pm2 restart helix-command-center

# Verify
curl -I http://localhost:5177/
```

**Note:** Static files are cached, users may need hard refresh (Cmd+Shift+R).

---

### 2. Deploy Backend (API) Updates

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Edit api/server.js or other backend files
# ...

# Restart server
pm2 restart helix-command-center

# Check logs for errors
pm2 logs helix-command-center --lines 20

# Test API
curl http://localhost:5177/api/subagents
```

---

### 3. Full Deployment (Frontend + Backend)

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Pull latest code (if using git)
# git pull origin main

# Install dependencies (if package.json changed)
pnpm install

# Build frontend
pnpm build

# Restart server
pm2 restart helix-command-center

# Verify everything works
curl http://localhost:5177/health
curl http://localhost:5177/api/subagents
open http://192.168.50.19:5177
```

---

### 4. Check System Health

```bash
# Quick health check
curl http://localhost:5177/health

# Expected output:
# {
#   "status": "ok",
#   "uptime": "1234s",
#   "memory": { "rss": "74MB", ... },
#   "nodeVersion": "v25.5.0",
#   "pid": 58100,
#   "timestamp": "2026-02-10T...",
#   "staticServing": true
# }

# Check PM2 status
pm2 status helix-command-center

# Expected: status: online, uptime > 0

# Check resource usage
pm2 monit  # Interactive monitor
```

---

### 5. View Logs

```bash
# Live logs (tail -f)
pm2 logs helix-command-center

# Last 100 lines
pm2 logs helix-command-center --lines 100

# Errors only
pm2 logs helix-command-center --err --lines 50

# Raw log files
tail -100 /Users/rrabelo/.openclaw/workspace/helix-status-page/logs/out.log
tail -100 /Users/rrabelo/.openclaw/workspace/helix-status-page/logs/error.log
```

---

### 6. Monitor Resource Usage

```bash
# PM2 built-in monitoring
pm2 monit

# Check memory usage
curl http://localhost:5177/health | grep memory

# macOS Activity Monitor
open -a "Activity Monitor"
# Search for "node" or "helix-command-center"

# CLI memory check
ps aux | grep "helix-command-center"
```

**Expected Memory Usage:**
- Normal: 70-100MB
- Warning: >200MB (check for memory leaks)
- Critical: >400MB (PM2 will auto-restart at 500MB)

---

### 7. Troubleshooting Crashes

```bash
# Check PM2 status
pm2 status helix-command-center

# If status: errored or stopped
pm2 describe helix-command-center

# Check error logs
pm2 logs helix-command-center --err --lines 100

# Check for port conflicts
lsof -i :5177 || echo "Port 5177 is free"

# Kill any orphaned processes
ps aux | grep "node.*server" | grep -v grep
# If found: kill <PID>

# Restart clean
pm2 delete helix-command-center
pm2 start ecosystem.config.cjs
pm2 save
```

---

### 8. Reset to Clean State

**If system is completely broken:**

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Stop everything
pm2 delete helix-command-center || true
pm2 kill

# Kill any orphaned processes
ps aux | grep "node.*server" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Clean PM2 state
rm -rf ~/.pm2/logs/helix-command-center*
rm -rf ~/.pm2/pids/helix-command-center*

# Clean local logs
rm -f logs/*.log

# Rebuild frontend
pnpm build

# Start fresh
pm2 start ecosystem.config.cjs
pm2 save

# Verify
curl http://localhost:5177/health
pm2 status
```

---

### 9. Setup Auto-Start on Mac Restart

```bash
# Generate startup script
pm2 startup

# Follow the command it outputs (run with sudo)
# Example: sudo env PATH=$PATH:... /opt/homebrew/lib/node_modules/pm2/bin/pm2 startup...

# Save current PM2 state
pm2 save

# Test by restarting Mac
sudo reboot

# After reboot, verify:
pm2 status helix-command-center
```

---

### 10. Update PM2 Configuration

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Edit ecosystem.config.cjs
# ... make changes ...

# Apply changes
pm2 delete helix-command-center
pm2 start ecosystem.config.cjs
pm2 save

# Verify
pm2 status helix-command-center
```

---

## Monitoring Setup

### PM2 Log Rotation

Already configured in production setup:

```bash
# Check if installed
pm2 ls | grep pm2-logrotate

# If not installed:
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

**Settings:**
- Max log size: 10MB per file
- Retain: 7 rotated logs
- Compress: Yes (gzip)

---

### Health Check Cron (Optional)

Add to your crontab for automatic health monitoring:

```bash
# Edit crontab
crontab -e

# Add this line (check every 5 minutes, restart if unhealthy)
*/5 * * * * curl -f http://localhost:5177/health > /dev/null 2>&1 || /opt/homebrew/bin/pm2 restart helix-command-center
```

---

## Performance Tuning

### Optimize Memory Usage

If memory usage is high:

```bash
# Lower max memory restart threshold
pm2 stop helix-command-center
# Edit ecosystem.config.cjs → max_memory_restart: '300M'
pm2 start ecosystem.config.cjs
pm2 save
```

### Optimize Response Time

```bash
# Check response time
time curl http://localhost:5177/health
time curl http://localhost:5177/api/subagents

# Should be <100ms for /health
# Should be <500ms for /api/subagents (depends on OpenClaw CLI speed)
```

---

## Disaster Recovery

### Backup Configuration

```bash
# Backup PM2 config
cp ecosystem.config.cjs ecosystem.config.cjs.backup

# Backup PM2 state
pm2 save
cp ~/.pm2/dump.pm2 ~/dump.pm2.backup

# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
```

### Restore from Backup

```bash
# Restore PM2 config
cp ecosystem.config.cjs.backup ecosystem.config.cjs

# Restore PM2 state
cp ~/dump.pm2.backup ~/.pm2/dump.pm2
pm2 resurrect

# Verify
pm2 status
```

---

## Security

### Update Node.js

```bash
# Check current version
node --version

# Update via Homebrew (if installed via brew)
brew upgrade node

# Restart service
pm2 restart helix-command-center
```

### Update Dependencies

```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Check for outdated packages
pnpm outdated

# Update all dependencies
pnpm update

# Rebuild
pnpm build

# Restart
pm2 restart helix-command-center

# Test thoroughly after updates
```

---

## Debugging

### Enable Debug Logging

```bash
# Temporary (one-time run)
NODE_ENV=development DEBUG=* pm2 restart helix-command-center --update-env

# Permanent (edit ecosystem.config.cjs)
# env: {
#   NODE_ENV: 'development',
#   DEBUG: 'express:*'
# }
```

### Inspect Process

```bash
# Get process info
pm2 describe helix-command-center

# Get PID
pm2 pid helix-command-center

# Inspect with Node.js debugger (if needed)
node --inspect=9229 api/server.js
```

### Test API Endpoints

```bash
# Health
curl http://localhost:5177/health

# Subagents
curl http://localhost:5177/api/subagents | jq .

# Projects
curl http://localhost:5177/api/projects | jq .

# Queue
curl http://localhost:5177/api/queue | jq .

# Knowledge
curl http://localhost:5177/api/knowledge | jq .

# History
curl http://localhost:5177/api/history | jq .
```

---

## Common Issues & Solutions

### Issue: PM2 shows "errored"

**Symptoms:**
```bash
pm2 status
# status: errored
```

**Solution:**
```bash
# Check logs for the error
pm2 logs helix-command-center --err --lines 50

# Common causes:
# 1. Port already in use → kill orphaned processes
# 2. Missing dependencies → pnpm install
# 3. Syntax error in code → check logs, fix code
# 4. Missing dist/ folder → pnpm build

# After fixing:
pm2 restart helix-command-center
```

---

### Issue: High restart count

**Symptoms:**
```bash
pm2 status
# ↺ column shows 10+
```

**Solution:**
```bash
# Check what's causing crashes
pm2 logs helix-command-center --err --lines 100

# Reset restart counter
pm2 reset helix-command-center

# If crashes continue:
# 1. Check for unhandled promise rejections in logs
# 2. Check memory usage (may be hitting 500MB limit)
# 3. Check for infinite loops or memory leaks
```

---

### Issue: Frontend not updating

**Symptoms:**
- Code changes not visible in browser

**Solution:**
```bash
# Rebuild frontend
pnpm build

# Restart server
pm2 restart helix-command-center

# Clear browser cache
# Chrome: Cmd+Shift+R (hard refresh)

# Verify new build
ls -lh dist/assets/
# Check timestamps
```

---

### Issue: API slow

**Symptoms:**
- API requests taking >1 second

**Solution:**
```bash
# Check resource usage
pm2 monit

# Check OpenClaw CLI responsiveness
time openclaw sessions list

# If OpenClaw is slow, that's the bottleneck (not the API)

# Check logs for errors
pm2 logs helix-command-center --lines 50
```

---

### Issue: Can't access from mobile

**Symptoms:**
- `http://192.168.50.19:5177` not loading on iPhone/Android

**Solution:**
```bash
# Verify server is listening on all interfaces
pm2 logs helix-command-center | grep "Network:"
# Should show: 🌐 Network: http://192.168.50.19:5177

# Check firewall (Mac)
# System Settings → Network → Firewall
# Make sure Node.js / PM2 is allowed

# Test from Mac
curl http://192.168.50.19:5177/health

# If that works, issue is likely mobile network/firewall
```

---

## Escalation

**If none of the above solves the issue:**

1. **Collect diagnostics:**
   ```bash
   pm2 describe helix-command-center > diagnostics.txt
   pm2 logs helix-command-center --lines 200 >> diagnostics.txt
   curl http://localhost:5177/health >> diagnostics.txt 2>&1
   ps aux | grep node >> diagnostics.txt
   ```

2. **Contact main agent (Helix) with:**
   - Description of the problem
   - What you tried
   - Diagnostics output
   - Timestamps of when issue started

---

## Maintenance Schedule

### Daily
- ✅ Check PM2 status: `pm2 status`
- ✅ Verify health endpoint: `curl http://localhost:5177/health`

### Weekly
- ✅ Check logs for errors: `pm2 logs --err --lines 100`
- ✅ Check restart count: `pm2 status` (should be 0-1)
- ✅ Check memory usage: `pm2 monit`

### Monthly
- ✅ Review logs: `ls -lh logs/`
- ✅ Clean old logs if needed: `rm logs/out.log.1.gz` (keep recent 7)
- ✅ Update dependencies: `pnpm outdated`, `pnpm update`
- ✅ Backup configuration: See "Disaster Recovery"

---

## Useful Links

- PM2 Documentation: https://pm2.keymetrics.io/docs/usage/quick-start/
- Vite Build Guide: https://vitejs.dev/guide/build.html
- Express Documentation: https://expressjs.com/
- OpenClaw CLI: `openclaw help`

---

**End of Operations Runbook**

*For production architecture details, see `COMMAND-CENTER-PRODUCTION-ARCHITECTURE.md`*  
*For root cause analysis, see `COMMAND-CENTER-ROOT-CAUSE-ANALYSIS.md`*
