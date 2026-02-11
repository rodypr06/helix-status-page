# Cloudflared Deployment Guide

**Purpose:** Document the successful cloudflared deployment process used for helix-status.rodytech.ai

**Reference Deployment:** helix-status.rodytech.ai (deployed Feb 2026)

---

## Overview

This guide documents the **exact process** used to deploy helix-status.rodytech.ai via cloudflared. This was our most successful deployment to date - zero issues, instant DNS propagation, perfect routing.

### Architecture

```
Local Build (Mac Mini) → Local Server → Cloudflared Tunnel → Cloudflare CDN → Public URL
192.168.50.19:5174   → devserver    → 192.168.50.229   → HTTPS          → https://helix-status.rodytech.ai
```

### Key Benefits

- **No server needed:** Serve from your local machine
- **Automatic HTTPS:** Cloudflare SSL/TLS handling
- **Instant DNS:** Cloudflare auto-creates DNS records
- **No port forwarding:** Works behind NAT/firewall
- **Real-time updates:** Build changes reflect instantly

---

## Prerequisites

### Access Required

1. **SSH access to devserver:**
   ```bash
   ssh macboypr@192.168.50.229
   ```
   - Password stored in password manager

2. **Cloudflare account** with rodytech.ai domain configured
   - Access to Cloudflare dashboard
   - API key (optional, for advanced setup)

### Tools Needed

- `pnpm` (package manager)
- `cloudflared` (installed on devserver)
- SSH client
- Basic terminal knowledge

---

## Step-by-Step Deployment

### Step 1: Build Your App

On your local machine (Mac Mini):

```bash
cd /Users/rrabelo/.openclaw/workspace/your-app
pnpm build
```

This creates the `dist/` directory with production-ready assets.

**Verify:**
```bash
ls -la dist/
# Should see index.html, assets/, etc.
```

---

### Step 2: Start Local Server

Serve the `dist/` directory on a specific port.

**Option A: Using Python (simplest)**
```bash
cd dist
python3 -m http.server 5174
```

**Option B: Using Vite Preview (if using Vite)**
```bash
pnpm preview --port 5174
```

**Option C: Using serve npm package**
```bash
npm install -g serve
serve dist -p 5174
```

**Verify locally:**
```bash
curl http://localhost:5174
# Should return HTML
```

**Important:** Keep this server running! It needs to be accessible from devserver.

---

### Step 3: Choose a Port

Pick a port that's not already in use.

**Current ports in use:**
- 5174: helix-status.rodytech.ai
- 5173: Available (was helix-status, moved to 5174)
- 3000: Common dev server port
- 8080: Common alternative

**Check if port is in use:**
```bash
lsof -i :5174
# If nothing returns, port is available
```

**Recommended approach:**
- Start from 5170 and go up
- Document which port is used for each app
- Update this file with new port assignments

---

### Step 4: Update Cloudflared Config

SSH into devserver:

```bash
ssh macboypr@192.168.50.229
```

Edit the cloudflared configuration:

```bash
sudo nano /etc/cloudflared/config.yml
```

Add your new tunnel entry:

```yaml
ingress:
  - hostname: yourapp.rodytech.ai
    service: http://192.168.50.19:YOUR_PORT
  - hostname: helix-status.rodytech.ai
    service: http://192.168.50.19:5174
  # ... other entries
```

**Key details:**
- `hostname`: Your subdomain (must be unique)
- `service`: `http://` + local IP + port
- Order matters - first match wins

**Save and exit:** `Ctrl+X`, `Y`, `Enter`

---

### Step 5: Restart Cloudflared Daemon

On devserver:

```bash
sudo systemctl restart cloudflared
```

**Check status:**
```bash
sudo systemctl status cloudflared
```

**Expected output:**
```
● cloudflared.service - cloudflared
     Loaded: loaded (/etc/systemd/system/cloudflared.service; enabled; vendor preset: enabled)
     Active: active (running) since ...
```

**If failed, check logs:**
```bash
sudo journalctl -u cloudflared -n 50
```

---

### Step 6: Verify Route Works

**Test from devserver:**
```bash
curl http://192.168.50.19:YOUR_PORT
```

**Test public URL from any device:**
```bash
curl https://yourapp.rodytech.ai
```

Or open in browser:
```
https://yourapp.rodytech.ai
```

**Expected:** Your app loads over HTTPS with valid SSL certificate.

---

### Step 7: Verify DNS

1. Log into Cloudflare dashboard
2. Go to DNS → rodytech.ai
3. Look for your subdomain record

**Should see:**
- Type: CNAME
- Name: yourapp
- Target: your-app-name.cloudflareaccess.com
- Status: Active (orange cloud icon = proxied)

**Note:** If DNS record not created automatically:
- Wait 2-3 minutes (Cloudflare auto-propagation)
- If still missing, create manually:
  - Type: CNAME
  - Name: yourapp
  - Target: (from cloudflared tunnel URL)
  - Proxy: On (orange cloud)

---

## Troubleshooting

### Issue: Daemon Won't Start

**Symptom:** `sudo systemctl status cloudflared` shows "failed"

**Check logs:**
```bash
sudo journalctl -u cloudflared -n 100
```

**Common causes:**

1. **YAML syntax error**
   - Check indentation (2 spaces, no tabs)
   - Verify quotes around hostnames
   - Check for missing colons

2. **Port conflict**
   - Ensure local server is actually running
   - Verify port is accessible from devserver:
     ```bash
     curl http://192.168.50.19:YOUR_PORT
     ```

3. **Duplicate hostname**
   - Each hostname must be unique
   - Check for duplicate entries in config.yml

---

### Issue: 502 Bad Gateway

**Symptom:** Cloudflare shows error page

**Causes:**

1. **Local server not running**
   - Start your local server
   - Verify it's accessible from localhost

2. **Wrong port**
   - Double-check port number in config.yml
   - Verify port isn't blocked by firewall

3. **Firewall blocking**
   - Ensure Mac Mini allows connections on the port
   - Check firewall settings:
     ```bash
     sudo pfctl -s rules | grep YOUR_PORT
     ```

---

### Issue: DNS Not Propagating

**Symptom:** DNS record missing or not updating

**Solutions:**

1. **Wait longer** (up to 5 minutes for auto-creation)
2. **Create DNS record manually** in Cloudflare dashboard
3. **Check cloudflared logs** for errors:
   ```bash
   sudo journalctl -u cloudflared -f
   ```

---

### Issue: Mixed Content Errors

**Symptom:** Some resources load over HTTP, causing browser warnings

**Solution:** Ensure all URLs in your app are:
- Relative paths: `/assets/style.css` ✅
- HTTPS only: `https://api.example.com` ✅
- NOT HTTP: `http://api.example.com` ❌

---

## Best Practices

### Port Management

1. **Document port assignments:**
   - Update this file when deploying new apps
   - Keep a record of which port maps to which app

2. **Use consistent port ranges:**
   - Development: 5170-5179
   - Staging: 5180-5189
   - Production: 5190-5199

3. **Check availability before deploying:**
   ```bash
   lsof -i :PORT_NUMBER
   ```

### Config Management

1. **Backup config before editing:**
   ```bash
   sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup
   ```

2. **Use YAML linter** if available:
   ```bash
   python3 -c "import yaml; yaml.safe_load(open('/etc/cloudflared/config.yml'))"
   ```

3. **Test syntax before applying:**
   - Use `cloudflared tunnel ingress validate` if available

### Deployment Workflow

1. **Build locally** (`pnpm build`)
2. **Test locally** (`pnpm preview`)
3. **Start local server** (keep it running!)
4. **SSH to devserver** and update config
5. **Restart cloudflared**
6. **Verify in browser**
7. **Document** (add to this file)

---

## Port Registry

Keep this updated with every deployment:

| Port | App | URL | Status |
|------|-----|-----|--------|
| 5175 | rodytech-crm | https://crm.rodytech.ai | Active |
| 5174 | helix-status | https://helix-status.rodytech.ai | Active |
| 5173 | crm-test | https://crm-test.rodytech.ai | Active |
| 5172 | Available | - | Free |
| 5171 | Available | - | Free |
| 5170 | Available | - | Free |

---

## Quick Reference

**SSH to devserver:**
```bash
ssh macboypr@192.168.50.229
```

**Edit cloudflared config:**
```bash
sudo nano /etc/cloudflared/config.yml
```

**Restart cloudflared:**
```bash
sudo systemctl restart cloudflared
```

**Check cloudflared status:**
```bash
sudo systemctl status cloudflared
```

**View cloudflared logs:**
```bash
sudo journalctl -u cloudflared -f
```

**Build command:**
```bash
pnpm build
```

**Serve dist (example):**
```bash
cd dist && python3 -m http.server 5174
```

---

## Success Criteria

Your deployment is successful if:

- ✅ Public URL loads in browser (HTTPS)
- ✅ No mixed content warnings
- ✅ All assets load correctly
- ✅ DNS record exists in Cloudflare dashboard
- ✅ cloudflared daemon is running (active state)
- ✅ No errors in cloudflared logs

---

## Examples

### Example: Deploying a New App

Let's say you want to deploy `portfolio.rodytech.ai`:

```bash
# 1. Build locally
cd /Users/rrabelo/.openclaw/workspace/portfolio
pnpm build

# 2. Start local server
cd dist
python3 -m http.server 5175

# 3. SSH to devserver
ssh macboypr@192.168.50.229

# 4. Update config
sudo nano /etc/cloudflared/config.yml
# Add: - hostname: portfolio.rodytech.ai
#       service: http://192.168.50.19:5175

# 5. Restart cloudflared
sudo systemctl restart cloudflared

# 6. Verify
sudo systemctl status cloudflared
curl https://portfolio.rodytech.ai
```

---

## Support

**If you encounter issues not covered here:**

1. Check cloudflared logs: `sudo journalctl -u cloudflared -n 100`
2. Verify local server is running and accessible
3. Check Cloudflare dashboard for DNS issues
4. Review this guide for common pitfalls

**Last Updated:** February 7, 2026
**Reference Deployment:** helix-status.rodytech.ai
