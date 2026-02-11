# PWA Testing Guide - Quick Start

Quick guide for testing PWA functionality on different devices.

## 🧪 Quick Test Checklist

### 1. Development Testing (5 minutes)

```bash
# Start the app
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
pnpm run dev:all
```

**In Chrome DevTools:**
1. Open http://localhost:5174
2. F12 → **Application** tab
3. Check **Manifest** - Should show "Helix Status Dashboard"
4. Check **Service Workers** - Should show registered SW
5. Check **Cache Storage** - Should show caches after page load
6. **Network** tab → Check **Offline** → Reload → Should still work

### 2. Install Prompt Testing

**Desktop (Chrome/Edge):**
- Look for install icon (⊕) in address bar
- Or wait for install prompt banner (bottom of page)
- Click to install

**Android:**
- Open in Chrome
- Look for "Add to Home Screen" or "Install" prompt
- Or: Menu (⋮) → "Install app"

**iOS:**
- Open in Safari
- Wait 3 seconds for instructions popup
- Follow the popup: Share → Add to Home Screen

### 3. Offline Testing (Critical!)

```
1. Open app while online
2. Navigate through all views (Dashboard, Projects, Analytics, History)
3. Open DevTools → Network → Check "Offline"
4. Reload page → Should load from cache ✓
5. Navigate between views → Should work ✓
6. Check "Online" → Should show "Back online" indicator
```

### 4. Installed App Testing

**After installing:**
- Launch from home screen/app drawer
- Should open fullscreen (no browser UI) ✓
- Status bar should be visible (iOS: translucent) ✓
- All functionality works ✓
- Auto-refresh works ✓
- Theme toggle persists ✓

### 5. Update Testing

```bash
# Make a visible change
echo "/* test update */" >> src/style.css

# Rebuild
pnpm run build

# Reload production app
# Should show: "New content available! Reload to update?"
```

## 📱 iOS-Specific Testing

### Required: Real iPhone/iPad
PWA features differ in iOS simulator. Test on **real device**.

### Steps:
1. Deploy to production (or use ngrok/cloudflared for local testing)
2. Open in **Safari** (only browser that supports PWA on iOS)
3. Share → Add to Home Screen
4. Launch installed app
5. Verify:
   - [ ] Launches fullscreen
   - [ ] Status bar shows (black translucent)
   - [ ] No Safari UI visible
   - [ ] Icon displays correctly
   - [ ] Auto-refresh works
   - [ ] Theme persists
   - [ ] Offline mode works

### iOS Gotchas:
- ⚠️ No install prompt API (manual only)
- ⚠️ Service worker may be evicted after ~1 week unused
- ⚠️ Cache limit ~50MB
- ✅ Caching works great
- ✅ Offline works reliably

## 🚀 Production Testing

### Before Deploying:
```bash
# Verify icons exist
ls -lh public/icons/*.png

# Build production bundle
pnpm run build

# Check build output
ls -lh dist/

# Test production build locally
pnpm run preview
# Open http://localhost:4173
```

### After Deploying:
1. **Lighthouse Audit** (Chrome DevTools)
   - Open production URL
   - F12 → Lighthouse tab
   - Check "Progressive Web App"
   - Run audit
   - **Target: Score > 90** ✓

2. **Mobile Testing**
   - Test on real iPhone
   - Test on real Android device
   - Verify installation works
   - Check offline functionality

3. **Update Flow**
   - Deploy new version
   - Open existing installed app
   - Should prompt for update
   - Reload → New version loads

## 🐛 Common Issues & Fixes

### Service Worker Not Registering
```
Problem: SW not showing in DevTools
Fix: Must be HTTPS or localhost
Check: Console for registration errors
```

### Install Prompt Not Showing
```
Problem: No install button/prompt
Reasons:
  - Already installed (check Chrome apps)
  - Recently dismissed (clears after 7 days)
  - Not HTTPS (localhost is ok)
  - Manifest invalid (check DevTools → Application → Manifest)
Fix: Check DevTools → Console for errors
```

### Offline Not Working
```
Problem: Blank page when offline
Fix: 
  1. Load app while online first (populate cache)
  2. Check Cache Storage in DevTools (should have entries)
  3. Clear cache and try again
```

### Icons Not Displaying
```
Problem: Default icon showing instead of custom
Fix:
  1. Regenerate icons: pnpm run generate-icons
  2. Clear browser cache
  3. Uninstall/reinstall app
  4. Check manifest.json paths are correct
```

### iOS Not Installing
```
Problem: "Add to Home Screen" not working
Check:
  - Using Safari (not Chrome/Firefox)
  - Not in Private Browsing mode
  - iOS 11.3+ required for PWA support
```

## 📊 Performance Benchmarks

### Target Metrics (Production):
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Speed Index: < 2.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms

### After Caching:
- Load time: < 500ms (instant)
- All assets from cache
- API calls network-first (fallback to cache)

## 🎯 Success Criteria

All items should be ✅:

**Installation:**
- [ ] Install prompt shows (or iOS instructions)
- [ ] Icon displays correctly on home screen
- [ ] Launches in standalone mode
- [ ] Status bar styled properly

**Offline:**
- [ ] Works without internet
- [ ] Cached UI loads instantly
- [ ] API calls fall back to cache
- [ ] Offline indicator appears

**Performance:**
- [ ] Lighthouse PWA score > 90
- [ ] First load < 2s
- [ ] Cached load < 500ms
- [ ] Smooth animations

**Updates:**
- [ ] Update prompt appears on new version
- [ ] Reload installs new version
- [ ] Old caches cleaned up

**iOS Specific:**
- [ ] Installs on iPhone/iPad
- [ ] Fullscreen mode works
- [ ] Black translucent status bar
- [ ] Auto-refresh works in standalone
- [ ] Offline support functional

## 💡 Quick Debug Commands

```bash
# Check service worker status
console: navigator.serviceWorker.controller

# Check if standalone
console: window.matchMedia('(display-mode: standalone)').matches

# Check cache names
console: caches.keys()

# Check online status
console: navigator.onLine

# Force service worker update
console: navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })

# Clear all caches
console: caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
```

## 📚 Resources

- **Local Dev**: http://localhost:5174
- **Production**: https://helix-status.rodytech.ai
- **Full Docs**: [PWA_SETUP.md](PWA_SETUP.md)
- **Chrome DevTools**: F12 → Application tab
- **Lighthouse**: F12 → Lighthouse tab

---

**Quick test before Rody's trip:** Install on iPhone, go offline, verify it works! ✈️
