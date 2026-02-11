<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const lastUpdated = ref(new Date())

const views = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'projects', label: 'Projects', icon: '🚀', path: '/projects' },
  { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
  { id: 'history', label: 'History', icon: '📜', path: '/history' },
  { id: 'docs', label: 'Docs', icon: '📚', path: '/docs' }
]

let updateInterval: NodeJS.Timeout

onMounted(() => {
  updateInterval = setInterval(() => {
    lastUpdated.value = new Date()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})

function isActiveRoute(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 relative overflow-hidden">
    <!-- Animated Background Orbs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/3 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Main Layout -->
    <div class="relative z-10 flex min-h-screen">
      <!-- Sidebar -->
      <aside class="w-64 glass-card m-4 p-6 flex flex-col gap-4">
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold gradient-text">Helix</h1>
          <p class="text-slate-400 text-sm mt-2">Status Dashboard</p>
        </div>

        <nav class="flex-1">
          <button
            v-for="view in views"
            :key="view.id"
            @click="router.push(view.path)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              isActiveRoute(view.path)
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            ]"
          >
            <span class="text-xl">{{ view.icon }}</span>
            <span>{{ view.label }}</span>
          </button>
        </nav>

        <div class="pt-6 border-t border-slate-700/50">
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>Live Updates</span>
          </div>
          <p class="text-xs text-slate-500 mt-2">
            Last updated: {{ lastUpdated.toLocaleTimeString() }}
          </p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(71, 85, 105, 0.5) transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 4px;
}
</style>
