# CLAUDE.md - Helix Status Page

## Project Overview

Helix Status Page is a real-time monitoring and status dashboard built with Vue 3 and Vite. It provides a unified view of Helix activities, projects, infrastructure metrics, token consumption, sub-agents, GitHub repositories, system metrics, and cron jobs. The UI uses a dark glassmorphism design with Tailwind CSS.

**Current state:** All dashboard data is hardcoded/simulated in stores. Production API integration has not been implemented yet — store files contain comments indicating where real API calls should go.

## Tech Stack

- **Frontend:** Vue 3 (v3.5.27) with Composition API (`<script setup>`)
- **Build:** Vite 7 with TypeScript (~5.9.3)
- **Styling:** Tailwind CSS v4, PostCSS, Autoprefixer
- **Charts:** Chart.js v4 + vue-chartjs v5
- **Utilities:** @vueuse/core v14
- **Backend (example):** Node.js + Express (in `backend/`)
- **Deployment:** Docker (multi-stage with nginx:alpine), also supports Vercel/Netlify/PM2
- **Package manager:** pnpm

## Project Structure

```
helix-status-page/
├── src/
│   ├── components/        # Reusable Vue components
│   │   ├── ChangeLog.vue
│   │   ├── CronJobs.vue
│   │   ├── GatewayStatus.vue
│   │   ├── GitHubActivity.vue
│   │   ├── ProjectsGrid.vue
│   │   ├── SubAgentsList.vue
│   │   ├── SystemMetrics.vue
│   │   └── TokenUsage.vue
│   ├── views/             # Page-level views
│   │   ├── Dashboard.vue
│   │   ├── Projects.vue
│   │   ├── Analytics.vue
│   │   └── History.vue
│   ├── stores/            # Reactive state (Vue reactive(), not Pinia)
│   │   ├── gateway.js     # Gateway connection & agent status
│   │   ├── projects.js    # Project list & status helpers
│   │   ├── subagents.js   # Sub-agent tracking
│   │   └── metrics.js     # System metrics & token usage
│   ├── App.vue            # Root component (sidebar nav + view switching)
│   ├── main.ts            # Vite entry point
│   └── style.css          # Tailwind imports + custom CSS utilities
├── backend/
│   ├── package.json
│   └── example-server.js  # Express API example (not used in production yet)
├── public/                # Static assets
├── dist/                  # Build output (generated)
├── index.html             # HTML entry template
├── vite.config.ts         # Vite config (Vue plugin)
├── tsconfig.json          # TypeScript strict config
├── nginx.conf             # Production nginx config
├── Dockerfile             # Multi-stage Docker build
├── .env.example           # Environment variable template
└── .env.production        # Production API URL
```

## Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Vite HMR)
pnpm build            # TypeScript check + Vite production build
pnpm preview          # Preview production build locally
```

### Backend (example server)

```bash
cd backend
npm install
npm run dev           # Start with nodemon (hot reload)
npm start             # Start production server
```

### Docker

```bash
docker build -t helix-status-page .
docker run -p 80:80 helix-status-page
```

## Environment Variables

Frontend variables must be prefixed with `VITE_` to be exposed to client code.

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000` |
| `VITE_GATEWAY_URL` | WebSocket gateway URL | `ws://127.0.0.1:18789` |
| `VITE_UPDATE_INTERVAL` | Polling interval (ms) | `5000` |
| `VITE_APP_TITLE` | Application title | `Helix Status Dashboard` |
| `VITE_APP_BRAND` | Branding name | `RodyTech` |
| `GITHUB_TOKEN` | GitHub API auth (backend) | - |
| `GITHUB_USERNAME` | GitHub user (backend) | - |

## Code Conventions

### Component patterns
- All components use Vue 3 `<script setup>` with Composition API — no Options API
- Single File Components (`.vue`) with template, script, and optional scoped styles
- Components import store objects directly from `src/stores/`

### State management
- Stores use Vue's `reactive()` directly (not Pinia)
- Pattern: `export const xStore = reactive({ ... })`
- Stores also export utility functions (e.g., `getProjectStatusColor()`, `formatNumber()`)
- Data updates use `setInterval` polling in component `onMounted`/`onUnmounted` hooks

### Routing
- Manual view switching in `App.vue` using a `currentView` ref — Vue Router is not installed
- Views are registered in a `views` array and rendered via `<component :is="currentComponent" />`

### Styling
- Tailwind CSS utility classes for all layout and styling
- Custom CSS classes defined in `src/style.css`:
  - `.glass-card` — glassmorphism effect (backdrop-blur, semi-transparent bg, subtle border)
  - `.gradient-text` — cyan-to-blue-to-indigo gradient text
  - `.status-online`, `.status-warning`, `.status-offline` — status indicator colors
- Dark theme throughout (slate-900 backgrounds, slate-400 text)
- Chart colors use slate-400 (`#94a3b8`) labels for dark theme compatibility

### TypeScript
- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Target: ES2022, Module: ESNext with bundler resolution
- Note: Store files are `.js` (not `.ts`), and some template-generated files remain (e.g., `counter.ts`)

### File naming
- Vue components: PascalCase (e.g., `GatewayStatus.vue`, `TokenUsage.vue`)
- Store files: lowercase (e.g., `gateway.js`, `metrics.js`)
- Config files: lowercase with dots (e.g., `vite.config.ts`, `tsconfig.json`)

## Architecture Notes

- **No testing framework** is configured — no test runner, no test files, no test dependencies
- **No linter/formatter** is configured — no ESLint or Prettier
- **No CI/CD pipeline** exists — no GitHub Actions or similar workflows
- **All dashboard data is simulated** — stores contain hardcoded mock data with comments indicating where API calls should be added
- The backend in `backend/` is an example Express server and is not currently wired into the frontend build or deployment
- The Dockerfile builds only the frontend (Vite → nginx), not the backend

## Common Tasks

### Adding a new dashboard component
1. Create a new `.vue` file in `src/components/` using `<script setup>`
2. Import any needed stores from `src/stores/`
3. Use Tailwind classes and the `glass-card` utility for consistent styling
4. Import and place the component in the appropriate view (`src/views/`)

### Adding a new view/page
1. Create a new `.vue` file in `src/views/`
2. Register it in the `views` array in `App.vue` with an id, label, icon, and component reference
3. The sidebar navigation and view switching will handle it automatically

### Adding a new store
1. Create a new `.js` file in `src/stores/`
2. Export a `reactive()` object with the store data
3. Export any helper/utility functions alongside the store
4. Import and use in components as needed

### Modifying environment config
1. Add new `VITE_`-prefixed variables to `.env.example`
2. Access in code via `import.meta.env.VITE_VARIABLE_NAME`
3. Update `.env.production` for production-specific values
