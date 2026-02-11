# 🚀 Deployment Guide

This guide covers different deployment options for the Helix Status Dashboard.

## Table of Contents

1. [Local Development](#local-development)
2. [Production Build](#production-build)
3. [Static Hosting (Vercel/Netlify)](#static-hosting)
4. [Docker Deployment](#docker-deployment)
5. [PM2 Process Manager](#pm2-process-manager)
6. [Nginx Reverse Proxy](#nginx-reverse-proxy)
7. [Environment Configuration](#environment-configuration)

---

## Local Development

### Prerequisites

- Node.js 18+ and pnpm
- Git

### Setup

```bash
# Clone or navigate to project
cd /Users/rrabelo/.openclaw/workspace/helix-status-page

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dashboard will be available at `http://localhost:5173`

### Backend API (Optional)

If you want to use the backend API:

```bash
cd backend
pnpm install
pnpm start
```

API will be available at `http://localhost:3000`

---

## Production Build

### Build the Application

```bash
pnpm build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

This serves the production build locally for testing.

---

## Static Hosting

### Vercel Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
cd helix-status-page
vercel
```

3. **Configure** (if needed)

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify Deployment

1. **Install Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **Deploy**

```bash
cd helix-status-page
netlify deploy --prod
```

3. **Create `netlify.toml`**

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

1. **Update `vite.config.js`**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/helix-status-page/' // Your repo name
})
```

2. **Build and Deploy**

```bash
pnpm build

# Or use gh-pages
npm install -D gh-pages
npx gh-pages -d dist
```

---

## Docker Deployment

### Dockerfile

```dockerfile
# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Production Stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - OPENCLAW_WORKSPACE=/app/workspace
    volumes:
      - /Users/rrabelo/.openclaw/workspace:/app/workspace:ro
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t helix-status .

# Run container
docker run -p 80:80 helix-status

# Or with docker-compose
docker-compose up -d
```

---

## PM2 Process Manager

### Install PM2

```bash
npm install -g pm2
```

### Start Application

```bash
# Serve with a simple HTTP server
cd dist
pm2 serve . 80 --name "helix-status"

# Or use a dedicated server
pm2 start ecosystem.config.js
```

### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'helix-status-frontend',
    script: 'serve',
    args: '-s dist -l 3000',
    cwd: '/Users/rrabelo/.openclaw/workspace/helix-status-page',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  },
  {
    name: 'helix-status-backend',
    script: 'backend/example-server.js',
    cwd: '/Users/rrabelo/.openclaw/workspace/helix-status-page',
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      GITHUB_TOKEN: 'your-token-here'
    }
  }]
}
```

### PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# List
pm2 list

# Logs
pm2 logs

# Restart
pm2 restart helix-status-frontend

# Stop
pm2 stop all

# Monitor
pm2 monit
```

---

## Nginx Reverse Proxy

### Configuration

```nginx
server {
    listen 80;
    server_name helix-status.rodytech.net;

    # Frontend
    location / {
        root /var/www/helix-status/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket (Gateway)
    location /ws {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### Deploy

```bash
# Copy built files
sudo cp -r dist/* /var/www/helix-status/

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## Environment Configuration

### Frontend (.env)

Create `.env` in project root:

```env
VITE_API_URL=https://your-domain.com/api
VITE_GATEWAY_URL=wss://your-domain.com/ws
VITE_UPDATE_INTERVAL=5000
```

### Backend (.env)

Create `.env` in backend directory:

```env
NODE_ENV=production
PORT=3001
GITHUB_TOKEN=ghp_your-token
GITHUB_USERNAME=your-username
OPENCLAW_WORKSPACE=/path/to/workspace
```

### Security Notes

⚠️ **Never commit `.env` files to version control!**

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
```

---

## SSL/HTTPS Setup

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d helix-status.rodytech.net

# Auto-renewal is automatic
```

### Manual Certificate (Self-Signed)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/helix-selfsigned.key \
  -out /etc/ssl/certs/helix-selfsigned.crt
```

Update Nginx config:

```nginx
server {
    listen 443 ssl;
    server_name helix-status.rodytech.net;

    ssl_certificate /etc/ssl/certs/helix-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/helix-selfsigned.key;

    # Rest of configuration...
}
```

---

## Monitoring & Logging

### PM2 Logging

```bash
# Install PM2 Logrotate
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Nginx Logging

Logs are in `/var/log/nginx/`:
- `access.log`
- `error.log`

### Application Monitoring

Consider using:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Uptime Kuma** for uptime monitoring

---

## Troubleshooting

### Build Issues

```bash
# Clear cache
rm -rf node_modules dist .vite
pnpm install
pnpm build
```

### Permission Issues

```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/helix-status
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## Performance Optimization

### Enable Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
```

### Browser Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Integration

Consider using Cloudflare CDN for:
- DDoS protection
- Global CDN
- SSL termination
- Caching

---

## Backup & Recovery

### Backup Procedure

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/helix-status"
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/helix-status-$DATE.tar.gz /var/www/helix-status

# Backup database (if any)
# mysqldump -u user -p database > $BACKUP_DIR/db-$DATE.sql

# Keep last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Restore Procedure

```bash
# Restore from backup
tar -xzf /backups/helix-status/helix-status-YYYYMMDD_HHMMSS.tar.gz -C /
```

---

## Support

For issues or questions:
- Check logs: `pm2 logs` or `/var/log/nginx/error.log`
- Review configuration files
- Check firewall rules

---

**Last Updated**: 2026-02-20
**Version**: 1.0.0
