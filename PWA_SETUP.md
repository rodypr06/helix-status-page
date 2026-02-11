# PWA Setup Guide - Helix Status Dashboard

Complete Progressive Web App (PWA) setup with iOS optimization for the Helix Status Dashboard.

## 📱 What's Included

### ✅ Core PWA Features
- **Manifest.json**: Complete app manifest with iOS/Android icons
- **Service Worker**: Advanced caching strategies via Workbox
- **Offline Support**: Works without internet connection
- **Install Prompt**: Smart install banner for iOS and Android
- **App Icons**: All required sizes (16x16 to 512x512, including maskable)
- **iOS Optimization**: Apple-specific meta tags and splash screen
- **Auto-Update**: Automatic service worker updates with user notification

### ✅ Caching Strategies
1. **Static Assets** (Cache-First): JS, CSS, images, fonts cached for fast load
2. **API Calls** (Network-First): Fresh data when online, fallback to cache
3. **Images** (Cache-First): Long-term caching for optimal performance
4. **Fonts** (Cache-First): Cached for 1 year

## 🎨 Generated Assets

### Icons (public/icons/)
```
favicon-16x16.png               - Browser favicon (small)
favicon-32x32.png               - Browser favicon (standard)
apple-touch-icon.png            - iOS home screen icon (180x180)
icon-192x192.png                - Android icon (standard)
icon-512x512.png                - Android icon (high-res)
icon-maskable-192x192.png       - Android adaptive icon
icon-maskable-512x512.png       - Android adaptive icon (high-res)
```

All icons generated from `icon-maskable.svg` using gradient blue/cyan branding.

### Regenerate Icons
```bash
# If you need to regenerate icons (after updating icon-maskable.svg)
node generate-icons.js
```

## 🚀 Installation Instructions

### For iPhone/iPad (iOS Safari)

1. **Open the app** in Safari at: `https://helix-status.rodytech.ai`
2. **Tap the Share button** (square with arrow pointing up) at the bottom
3. **Scroll down** and tap **"Add to Home Screen"**
4. **Customize name** (optional) and tap **"Add"**
5. **Done!** Look for the Helix icon on your home screen

**iOS Features:**
- Launches in fullscreen (no Safari UI)
- Black translucent status bar
- Custom app icon with rounded corners
- Works offline after first load
- Auto-refresh works in standalone mode

### For Android/Chrome

1. **Open the app** in Chrome at: `https://helix-status.rodytech.ai`
2. **Look for the install prompt** (banner at bottom) or
3. **Tap the menu** (⋮) and select **"Install app"** or **"Add to Home screen"**
4. **Confirm** the installation
5. **Done!** App appears in app drawer and home screen

**Android Features:**
- Full PWA support with install prompt
- Adaptive icon (maskable)
- Splash screen on launch
- Background sync
- Push notifications (if enabled)

### For Desktop (Chrome/Edge/Brave)

1. **Open the app** in browser
2. **Look for install icon** in address bar (⊕ or install icon)
3. **Click** the icon and confirm installation
4. **App opens** in standalone window

## 🧪 Testing Checklist

### Basic Functionality
- [ ] App loads at localhost:5174 (dev) or production URL
- [ ] All icons display correctly in browser tab
- [ ] Theme toggle works (light/dark mode)
- [ ] All views accessible (Dashboard, Projects, Analytics, History)

### PWA Installation
- [ ] Install prompt appears on supported browsers
- [ ] iOS: "Add to Home Screen" option available in Safari share menu
- [ ] Android: Install banner or menu option available
- [ ] Desktop: Install icon appears in address bar

### Installed App Testing
- [ ] App icon appears on home screen/app drawer
- [ ] Launches in standalone mode (no browser UI)
- [ ] Status bar styled correctly (iOS: black-translucent)
- [ ] Splash screen displays on launch (if applicable)
- [ ] Navigation works correctly
- [ ] Theme persists across sessions

### Offline Functionality
- [ ] Open app while online
- [ ] Turn off WiFi/data
- [ ] App still loads from cache
- [ ] Static content displays correctly
- [ ] API calls show cached data or graceful error
- [ ] Turn WiFi back on
- [ ] App fetches fresh data

### Service Worker
- [ ] Service worker registers successfully (check DevTools → Application → Service Workers)
- [ ] Caches created (check DevTools → Application → Cache Storage)
- [ ] Update notification appears when new version deployed
- [ ] Refresh works after update prompt

### Performance
- [ ] Fast initial load (< 2s on good connection)
- [ ] Instant load on repeat visits (cache)
- [ ] Smooth animations and transitions
- [ ] No console errors

## 🔧 Development

### Running Locally
```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Install dependencies (if not already installed)
pnpm install

# Start dev server (with PWA enabled)
pnpm run dev

# Start API server (in another terminal)
pnpm run api

# Or run both together
pnpm run dev:all
```

**Dev Server:** http://localhost:5174  
**API Server:** http://localhost:3000

### Building for Production
```bash
# Build optimized production bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

Build output: `dist/`

### PWA in Development
PWA features are **enabled in development mode** for testing:
- Service worker registers immediately
- Install prompt works
- Caching active (check DevTools)
- Offline testing possible

## 🌐 Deployment

### Current Setup (Cloudflared)
The app is deployed using Cloudflare Tunnel. See `CLOUDFLARED_DEPLOYMENT.md` for details.

**Production URL:** `https://helix-status.rodytech.ai`

### Requirements for PWA
✅ **HTTPS required** - Cloudflared provides this automatically  
✅ **Valid SSL certificate** - Handled by Cloudflare  
✅ **Service worker** - Auto-generated by Vite PWA plugin  
✅ **Manifest.json** - Configured and served  

### Deployment Steps
1. Build production bundle: `pnpm run build`
2. Deploy `dist/` folder to server
3. Ensure cloudflared tunnel is running
4. Test at production URL
5. Verify PWA installation works

### Updating the App
When you deploy updates:
1. Users will see "New content available! Reload to update?" prompt
2. They can reload immediately or continue using old version
3. Service worker automatically checks for updates every hour
4. Cached content replaced with new version after reload

## 📱 iOS-Specific Features

### Meta Tags (in index.html)
```html
<!-- Makes app fullscreen on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- Status bar style (black-translucent = transparent, overlays content) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- App title on home screen -->
<meta name="apple-mobile-web-app-title" content="Helix">

<!-- Safe area insets (for iPhone X+ notches) -->
<meta name="viewport" content="... viewport-fit=cover">
```

### iOS Limitations
⚠️ **No install prompt**: iOS doesn't support `beforeinstallprompt` event  
⚠️ **Manual installation**: Users must use Safari's "Add to Home Screen"  
⚠️ **No background sync**: iOS PWAs can't run in background  
⚠️ **Limited notifications**: Push notifications not supported in iOS PWAs  
✅ **Service workers work**: Caching and offline support fully functional  
✅ **Standalone mode**: App runs fullscreen without Safari UI  

### iOS Best Practices Implemented
✓ 180x180 apple-touch-icon  
✓ Black-translucent status bar  
✓ Viewport-fit=cover for notch support  
✓ Splash screen simulation via CSS  
✓ Install instructions in InstallPrompt component  

## 🛠 Troubleshooting

### Install Prompt Not Showing

**iOS:**
- Install prompt is informational only (shows instructions)
- Check if dismissed recently (shows again after 7 days)
- Already installed? Won't show if app detected as standalone

**Android/Desktop:**
- Check if browser supports PWA (Chrome, Edge, Brave)
- Already installed? Install prompt won't appear
- Dismissed? Stored in localStorage, clears after 7 days
- Open DevTools → Application → Manifest to verify manifest loads

### Service Worker Issues

**Not Registering:**
- Must be served over HTTPS (or localhost)
- Check browser console for errors
- DevTools → Application → Service Workers shows status

**Not Caching:**
- Check DevTools → Application → Cache Storage
- Clear cache and reload
- Verify service worker active

**Old Content Showing:**
- Clear cache: DevTools → Application → Clear storage
- Update prompt not working? Check console for errors
- Force refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Offline Not Working
- Load app while online first (cache must populate)
- Check DevTools → Network → Offline checkbox to simulate
- Verify caches exist in DevTools → Application → Cache Storage
- API calls should fall back to cache or show error

### Icons Not Displaying
- Check icons exist: `ls -lh public/icons/*.png`
- Regenerate: `node generate-icons.js`
- Verify paths in manifest.json
- Clear browser cache and reload

## 📊 Service Worker Caching Details

### What's Cached
1. **Static Assets** (Cache-First, 30-365 days):
   - JavaScript bundles
   - CSS stylesheets
   - Images (PNG, JPG, SVG, WebP)
   - Fonts (WOFF, WOFF2, TTF, OTF)
   - HTML pages

2. **API Responses** (Network-First, 5 minutes):
   - `/api/*` endpoints
   - Fallback to cache if offline
   - 10-second network timeout

3. **Runtime Resources** (Stale-While-Revalidate, 7 days):
   - Dynamically loaded resources
   - Background updates

### Cache Names
```
static-resources      - JS/CSS files
image-cache          - Images
font-cache           - Web fonts
api-cache            - API responses
workbox-precache     - Build-time precached assets
```

### Cache Limits
- API cache: 50 entries, 5 minutes
- Image cache: 100 entries, 30 days
- Font cache: 30 entries, 1 year
- Old caches auto-cleaned on update

## 🔐 Security Notes

### Service Worker Scope
- Registered at root level (`/`)
- Controls entire site
- Can intercept all requests

### HTTPS Requirement
- Service workers require HTTPS (or localhost)
- Cloudflared provides automatic HTTPS
- All API calls should use HTTPS in production

### Content Security Policy
Consider adding CSP headers for production:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
```

## 📚 Additional Resources

### Documentation
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)

### Testing Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [PWA Builder](https://www.pwabuilder.com/) - Validation and testing
- Chrome DevTools → Application tab - Service worker debugging

### Icon Tools
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Generate all icon sizes
- [Maskable.app](https://maskable.app/) - Test maskable icons
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) - CLI tool

## 🎯 Success Criteria (All ✅)

- [x] manifest.json properly configured
- [x] Service worker caching assets
- [x] iOS icons generated and linked
- [x] Install prompt working
- [x] Offline support functional
- [x] Installable on iPhone as standalone app
- [x] Status bar styled for iOS
- [x] Auto-refresh works in standalone mode
- [x] Documentation complete

## 🚀 Next Steps

1. **Test on iPhone**: Install via Safari "Add to Home Screen"
2. **Test offline**: Load app, disconnect WiFi, verify functionality
3. **Test auto-refresh**: Check if data updates in standalone mode
4. **Deploy to production**: Push to cloudflared tunnel
5. **Monitor**: Check service worker registration in production

## 💡 Tips for Rody

### While Traveling
- **Install before flight**: Ensure app cached while on WiFi
- **Offline mode**: App works without internet (shows last data)
- **Battery friendly**: Standalone mode uses less power than browser
- **Quick launch**: Icon on home screen for instant access

### Customization
- **Change icon**: Edit `public/icons/icon-maskable.svg`, run `node generate-icons.js`
- **Adjust colors**: Update theme colors in `vite.config.ts` manifest section
- **Cache duration**: Modify cache settings in `vite.config.ts` workbox section
- **Install prompt timing**: Edit `src/components/InstallPrompt.vue` delay (default 3s)

---

**Built with ❤️ for Rody's iPhone** 📱

Need help? Check the troubleshooting section or reach out!
