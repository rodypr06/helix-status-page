# Helix Command Center - Production Architecture
**Date:** 2026-02-10  
**Engineer:** Production Engineering Subagent  
**Status:** DESIGN APPROVED - READY FOR IMPLEMENTATION

---

## Executive Summary

**Recommendation:** **Option A - Production Build Architecture**

Replace dev server setup with industry-standard production architecture:
- Single PM2-managed Node.js process
- Vite production build served as static assets
- API and static on same server (no proxy)
- Graceful shutdown, health checks, and monitoring
- Production-grade stability and performance

---

## Architecture Options Evaluated

### Option A: Production Build (RECOMMENDED) ⭐

**Architecture:**
```
Browser (http://192.168.50.19:5177 or :5174)
    ↓
Express Server (single process, PM2-managed)
    ├─ Static Files (Vite dist/) → /, /assets/*, /icons/*
    └─ API Routes → /api/*
```

**Implementation:**
1. Build Vite: `pnpm build` → `dist/`
2. Serve static from Express: `app.use(express.static('dist'))`
3. Single PM2 process for both static + API
4. No proxy needed
5. Add graceful shutdown, health checks, monitoring

**Benefits:**
- ✅ **Single process** - One PM2 process to manage
- ✅ **No port conflicts** - One port (5177)
- ✅ **Fast** - Static assets served directly
- ✅ **Stable** - Production-grade Express serving
- ✅ **Industry standard** - How Vercel, Netlify, etc. work
- ✅ **Mobile-friendly** - Static assets cached effectively
- ✅ **Easy deployment** - Build once, deploy anywhere

**Tradeoffs:**
- ❌ No hot module replacement (rebuild required for frontend changes)
- ⚠️ Requires build step before deployment

**Verdict:** **BEST for production stability**

---

### Option B: Dual-Process Dev Setup

**Architecture:**
```
Browser
    ↓
Vite Dev Server (5174) ← Managed outside PM2
    ↓ proxy /api →
Express API (5177) ← PM2-managed
```

**Implementation:**
1. Remove Vite from PM2
2. Run Vite manually: `pnpm dev`
3. PM2 only manages API server
4. Proxy remains in Vite config

**Benefits:**
- ✅ Hot module replacement for dev
- ✅ Proper separation of concerns
- ✅ Easy debugging

**Tradeoffs:**
- ❌ Two processes to manage
- ❌ Two ports
- ❌ Not production-grade
- ❌ Still have proxy overhead

**Verdict:** **GOOD for development, NOT for production**

---

### Option C: Full Containerization

**Architecture:**
```
Docker Compose
    ├─ Frontend Container (Nginx + Vite dist/)
    └─ Backend Container (Express API)
```

**Benefits:**
- ✅ Complete isolation
- ✅ Reproducible environments
- ✅ Easy scaling
- ✅ Industry best practice

**Tradeoffs:**
- ❌ Overkill for single-user system
- ❌ Docker overhead on Mac (slower)
- ❌ More complex setup
- ❌ Longer implementation time

**Verdict:** **OVERKILL for current needs, revisit if scaling needed**

---

## Chosen Architecture: Option A (Production Build)

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Helix Command Center                     │
│                   (Single Node.js Process)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐        ┌─────────────────────────┐   │
│  │  Express Server  │        │   Static Files (dist/)   │   │
│  │   Port: 5177     │────────│   - index.html           │   │
│  │                  │        │   - assets/              │   │
│  │  Routes:         │        │   - icons/               │   │
│  │  • /             │        │                          │   │
│  │  • /api/*        │        │   Served via:            │   │
│  │  • /health       │        │   app.use(express.static)│   │
│  │  • /*            │        │                          │   │
│  │    (SPA fallback)│        └─────────────────────────┘   │
│  └──────────────────┘                                       │
│         ↓                                                    │
│  ┌──────────────────┐                                       │
│  │  API Handlers    │                                       │
│  │  • /api/subagents│                                       │
│  │  • /api/projects │                                       │
│  │  • /api/queue    │                                       │
│  │  • /api/knowledge│                                       │
│  └──────────────────┘                                       │
│         ↓                                                    │
│  ┌──────────────────┐                                       │
│  │  OpenClaw CLI    │                                       │
│  │  • File System   │                                       │
│  │  • Sessions      │                                       │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                         ↑
                         │ Managed by PM2
                         ↓
              ┌──────────────────────┐
              │    PM2 Process       │
              │    Manager           │
              │  • Auto-restart      │
              │  • Health monitoring │
              │  • Log rotation      │
              └──────────────────────┘
```

---

## Implementation Plan

### Phase 1: Build & Serve Static (30 minutes)

#### Step 1.1: Update server.js to serve static unconditionally
```javascript
// Current (conditional):
if (process.env.NODE_ENV === 'production' && existsSync(distPath)) {
  app.use(express.static(distPath))
}

// New (always serve if exists):
const distPath = join(__dirname, '../dist')
if (existsSync(distPath)) {
  console.log('📁 Serving static files from:', distPath)
  app.use(express.static(distPath))
}

// SPA fallback (MUST be last)
if (existsSync(distPath)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'))
    }
  })
}
```

#### Step 1.2: Build Vite
```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
pnpm build
```

**Expected Output:**
```
dist/
  index.html
  assets/
    index-abc123.js
    index-def456.css
  icons/
    *.png
```

#### Step 1.3: Update API port to 5177 (consolidate)
```javascript
// server.js
const PORT = process.env.PORT || 5177  // Changed from 5178
```

---

### Phase 2: Graceful Shutdown & Error Handling (30 minutes)

#### Step 2.1: Add signal handlers
```javascript
// server.js - Add before app.listen()

let server

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`)
  
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed')
      process.exit(0)
    })
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown after timeout')
      process.exit(1)
    }, 10000)
  } else {
    process.exit(0)
  }
}

// Register signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

// Start server
server = app.listen(PORT, () => {
  console.log(`✅ Helix Command Center API running on port ${PORT}`)
  console.log(`📡 Local: http://localhost:${PORT}`)
  console.log(`🌐 Network: http://192.168.50.19:${PORT}`)
})
```

#### Step 2.2: Wrap async routes
```javascript
// Add error wrapper utility
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Apply to all async routes
app.get('/api/subagents', asyncHandler(async (req, res) => {
  // ... existing code
}))

// Global error handler (MUST be last middleware)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err)
  res.status(500).json({
    error: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
})
```

---

### Phase 3: PM2 Configuration (15 minutes)

#### Step 3.1: Update ecosystem.config.cjs
```javascript
module.exports = {
  apps: [{
    name: 'helix-command-center',
    script: './api/server.js',
    cwd: '/Users/rrabelo/.openclaw/workspace/helix-status-page',
    instances: 1,
    exec_mode: 'fork',
    
    // Auto-restart with limits
    autorestart: true,
    max_restarts: 10,           // ✅ Limit restart attempts
    min_uptime: '10s',          // ✅ Must run 10s to count as successful
    restart_delay: 4000,        // ✅ 4s delay between restarts
    
    // Memory management
    max_memory_restart: '500M', // ✅ Restart if memory exceeds 500MB
    
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 5177
    },
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Process management
    kill_timeout: 10000,        // ✅ 10s for graceful shutdown
    listen_timeout: 10000,      // ✅ 10s to start listening
    wait_ready: false,
    
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'dist'],
    
    // Advanced
    exp_backoff_restart_delay: 100  // ✅ Exponential backoff
  }]
}
```

#### Step 3.2: Create logs directory
```bash
mkdir -p /Users/rrabelo/.openclaw/workspace/helix-status-page/logs
```

---

### Phase 4: Health Checks & Monitoring (15 minutes)

#### Step 4.1: Enhance /health endpoint
```javascript
// server.js
app.get('/health', (req, res) => {
  const uptime = process.uptime()
  const memory = process.memoryUsage()
  
  // Check if critical endpoints are working
  const checks = {
    server: 'ok',
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`
    },
    nodeVersion: process.version,
    pid: process.pid,
    timestamp: new Date().toISOString()
  }
  
  // Check if OpenClaw is reachable
  try {
    execSync('openclaw --version', { timeout: 1000 })
    checks.openclaw = 'ok'
  } catch (e) {
    checks.openclaw = 'error'
  }
  
  res.json(checks)
})
```

#### Step 4.2: Add PM2 monitoring
```bash
# Install PM2 log rotation module
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

---

### Phase 5: Deployment & Testing (30 minutes)

#### Step 5.1: Deploy
```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Build frontend
pnpm build

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 state
pm2 save

# Setup PM2 startup script (Mac)
pm2 startup
# (follow instructions to run the command it outputs)
```

#### Step 5.2: Validation Tests
```bash
# 1. Health check
curl http://localhost:5177/health

# 2. Frontend loads
curl -I http://localhost:5177/

# 3. API works
curl http://localhost:5177/api/subagents

# 4. PM2 status
pm2 status

# 5. Check logs
pm2 logs helix-command-center --lines 20
```

#### Step 5.3: Restart Test
```bash
# Test graceful restart
pm2 restart helix-command-center

# Check it comes back online
sleep 5
curl http://localhost:5177/health

# Check PM2 status
pm2 status
```

#### Step 5.4: Failure Test
```bash
# Kill process directly
pm2 delete helix-command-center
kill -9 $(pm2 pid helix-command-center)

# Should auto-restart
sleep 5
pm2 status

# Verify still works
curl http://localhost:5177/health
```

---

## Monitoring Setup

### PM2 Dashboard
```bash
# Web-based monitoring
pm2 web

# CLI monitoring
pm2 monit
```

### Health Check Cron (Optional)
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:5177/health || pm2 restart helix-command-center
```

---

## Rollback Plan

If production architecture fails:

1. **Stop PM2:**
   ```bash
   pm2 delete helix-command-center
   ```

2. **Revert to dev setup:**
   ```bash
   cd /Users/rrabelo/.openclaw/workspace/helix-status-page
   pnpm dev:all  # Runs both Vite + API
   ```

3. **Debug:**
   ```bash
   pm2 logs helix-command-center --lines 100
   tail -100 logs/error.log
   ```

---

## Success Criteria

**✅ Production-Ready When:**

- [ ] PM2 shows `status: online` consistently
- [ ] Uptime > 24 hours without manual restart
- [ ] Memory usage stable <200MB
- [ ] Response time /health < 100ms
- [ ] No crashes under 100 concurrent requests
- [ ] All API endpoints functional
- [ ] Frontend loads on desktop & mobile
- [ ] Survives PM2 restart
- [ ] Survives process kill (auto-recovers)
- [ ] Survives Mac restart (auto-starts)
- [ ] Logs clean (no errors)

---

## Migration Checklist

### Pre-Deployment
- [x] Kill all orphaned processes
- [x] Stop PM2
- [x] Verify ports free
- [ ] Backup current state
- [ ] Test build process

### Deployment
- [ ] Build Vite (`pnpm build`)
- [ ] Update server.js (graceful shutdown, error handling)
- [ ] Update ecosystem.config.cjs (restart limits)
- [ ] Create logs directory
- [ ] Start with PM2
- [ ] Save PM2 state
- [ ] Setup startup script

### Post-Deployment
- [ ] Run validation tests
- [ ] Run restart test
- [ ] Run failure test
- [ ] Monitor for 1 hour
- [ ] Check logs
- [ ] Test mobile access

### 24-Hour Stability Test
- [ ] No crashes
- [ ] Memory stable
- [ ] CPU usage normal
- [ ] Logs clean
- [ ] All features working

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Uptime | 99.9% (24h) | 0% | 🔴 Failed |
| Memory | <200MB | 0MB (crashed) | 🔴 Failed |
| Response Time | <100ms | N/A | 🔴 Failed |
| Restart Count | 0 | 45+ | 🔴 Failed |
| Port Conflicts | 0 | Multiple | 🔴 Failed |

**Post-Implementation Targets:**
- Uptime: 99.9% → 24+ hours
- Memory: <200MB stable
- Response: <100ms average
- Restarts: 0 in 24h
- Errors: 0 in logs

---

## Next Steps

1. ✅ Root cause analysis complete
2. ✅ Production architecture designed
3. **NOW:** Implement production build approach
4. Test thoroughly
5. Monitor for 24 hours
6. Document operations

---

**Architecture Approved. Ready for Implementation.**
