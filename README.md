# 🚀 Helix Status Dashboard

A comprehensive, real-time status dashboard for monitoring Helix activities, projects, and infrastructure.

## ✨ Features

- **Gateway Status**: Real-time uptime, connection health, memory usage, and active model
- **Agent Monitoring**: Track Helix's current activity, response times, and heartbeats
- **Token Analytics**: Complete token consumption tracking with cost estimates and charts
- **Project Management**: Visual project cards with progress tracking and status
- **Sub-Agents Dashboard**: Live monitoring of active sub-agents with execution history
- **GitHub Integration**: Repository stats, recent commits, and activity tracking
- **Activity History**: Complete changelog with filtering and search
- **Cron Jobs**: Management of scheduled tasks with status monitoring
- **System Metrics**: CPU, memory, disk, and network monitoring

## 🎨 Design

- **Dark theme** with animated gradient background
- **Glassmorphism** UI with backdrop blur effects
- **RodyTech branding**: Blue gradients (#0ea5e9 → #3b82f6) and cyan accents
- **Real-time updates** every 5 seconds
- **Responsive design** for all screen sizes

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js with vue-chartjs
- **Utilities**: @vueuse/core

## 📦 Installation

```bash
# Navigate to project directory
cd helix-status-page

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🚀 Usage

### Development

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:5173`

### Production Build

```bash
pnpm build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
helix-status-page/
├── src/
│   ├── components/          # Vue components
│   │   ├── GatewayStatus.vue
│   │   ├── TokenUsage.vue
│   │   ├── ProjectsGrid.vue
│   │   ├── SubAgentsList.vue
│   │   ├── GitHubActivity.vue
│   │   ├── ChangeLog.vue
│   │   ├── CronJobs.vue
│   │   └── SystemMetrics.vue
│   ├── views/              # Page views
│   │   ├── Dashboard.vue
│   │   ├── Projects.vue
│   │   ├── Analytics.vue
│   │   └── History.vue
│   ├── stores/             # State management
│   │   ├── gateway.js
│   │   ├── projects.js
│   │   ├── subagents.js
│   │   └── metrics.js
│   ├── App.vue             # Root component
│   ├── main.js             # Entry point
│   └── style.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
└── README.md              # This file
```

## 🔌 Data Sources

Currently using simulated data. To connect to real data sources:

1. **Gateway API**: Update `src/stores/gateway.js` to fetch from Gateway API
2. **Session History**: Parse transcript JSONs from workspace
3. **GitHub API**: Add GitHub token and fetch real repository data
4. **System Metrics**: Use backend API to fetch CPU, RAM, disk metrics
5. **Cron Jobs**: Query OpenClaw cron API

### Example: Connecting to Gateway API

```javascript
// src/stores/gateway.js
export async function updateGatewayStatus() {
  const response = await fetch('http://127.0.0.1:18789/api/status')
  const data = await response.json()
  gatewayStore.status = { ...data }
}
```

## 🎯 Customization

### Colors

Edit `src/style.css` to customize the color scheme:

```css
:root {
  --color-primary: #0ea5e9;
  --color-primary-dark: #3b82f6;
  --color-accent: #06b6d4;
  --color-bg: #0f172a;
}
```

### Polling Interval

Change update frequency in `src/App.vue`:

```javascript
onMounted(() => {
  updateInterval = setInterval(() => {
    lastUpdated.value = new Date()
  }, 5000) // Change 5000 to desired interval (ms)
})
```

## 📊 Dashboard Views

### Dashboard
Main overview with all key metrics and status indicators.

### Projects
Detailed project management with filtering and search.

### Analytics
Deep dive into token usage, costs, and performance metrics.

### History
Complete activity log with filtering by type and date.

## 🔒 Security Notes

- Never expose Gateway API tokens in frontend code
- Use backend proxy for API calls that require authentication
- Implement proper authentication for production deployment
- Sanitize all user inputs

## 🚀 Deployment

### Static Hosting (Vercel, Netlify, GitHub Pages)

```bash
pnpm build
# Upload dist/ folder
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 80
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use and modify as needed.

## 💬 Support

For issues or questions, contact the Helix team.

---

**Built with ❤️ for Helix by RodyTech**
