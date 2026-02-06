<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { metricsStore, getSystemHealthColor } from '../stores/metrics'

const currentTime = ref(new Date())

let timeInterval

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
    // In production, fetch real metrics from API
    updateSystemMetrics()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})

function updateSystemMetrics() {
  // Simulate realistic fluctuations
  metricsStore.system.cpu = Math.floor(Math.random() * 20) + 5
  metricsStore.system.memory = Math.floor(Math.random() * 10) + 40
  metricsStore.system.network.in = (Math.random() * 2 + 1).toFixed(1)
  metricsStore.system.network.out = (Math.random() * 1.5 + 1).toFixed(1)
}
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">💻</span>
      System Metrics
      <span class="text-sm font-normal text-slate-400 ml-auto">Rodericks-Mini</span>
    </h2>

    <!-- Main Metrics Grid -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- CPU -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚡</span>
            <span class="text-white font-semibold">CPU Usage</span>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-bold',
            metricsStore.system.cpu < 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
          ]">
            {{ metricsStore.system.cpu }}%
          </span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            :class="[
              'h-3 rounded-full transition-all duration-500',
              getSystemHealthColor(metricsStore.system.cpu)
            ]"
            :style="{ width: metricsStore.system.cpu + '%' }"
          ></div>
        </div>
      </div>

      <!-- Memory -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🧠</span>
            <span class="text-white font-semibold">Memory</span>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-bold',
            metricsStore.system.memory < 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
          ]">
            {{ metricsStore.system.memory }}%
          </span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            :class="[
              'h-3 rounded-full transition-all duration-500',
              getSystemHealthColor(metricsStore.system.memory)
            ]"
            :style="{ width: metricsStore.system.memory + '%' }"
          ></div>
        </div>
      </div>

      <!-- Disk -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">💾</span>
            <span class="text-white font-semibold">Disk Space</span>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-sm font-bold',
            metricsStore.system.disk < 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          ]">
            {{ metricsStore.system.disk }}% used
          </span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            :class="[
              'h-3 rounded-full transition-all duration-500',
              getSystemHealthColor(metricsStore.system.disk)
            ]"
            :style="{ width: metricsStore.system.disk + '%' }"
          ></div>
        </div>
        <p class="text-sm text-slate-400 mt-2">162GB free of 228GB</p>
      </div>

      <!-- Uptime -->
      <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⏱️</span>
            <span class="text-white font-semibold">System Uptime</span>
          </div>
        </div>
        <p class="text-2xl font-bold text-emerald-400">{{ metricsStore.system.uptime }}</p>
      </div>
    </div>

    <!-- Network Stats -->
    <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span class="text-xl">🌐</span>
        Network Activity
      </h3>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-900/50 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">📥</span>
            <span class="text-slate-400">Download</span>
          </div>
          <p class="text-2xl font-bold text-cyan-400">{{ metricsStore.system.network.in }} MB/s</p>
        </div>

        <div class="bg-slate-900/50 rounded-lg p-4">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">📤</span>
            <span class="text-slate-400">Upload</span>
          </div>
          <p class="text-2xl font-bold text-emerald-400">{{ metricsStore.system.network.out }} MB/s</p>
        </div>
      </div>
    </div>

    <!-- System Info -->
    <div class="mt-6 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span class="text-xl">ℹ️</span>
        System Information
      </h3>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-slate-400">OS</p>
          <p class="text-white font-semibold">macOS 26.2 (Darwin 25.2.0)</p>
        </div>
        <div>
          <p class="text-slate-400">Architecture</p>
          <p class="text-white font-semibold">ARM64 (Apple Silicon)</p>
        </div>
        <div>
          <p class="text-slate-400">Node.js</p>
          <p class="text-white font-semibold">v25.5.0</p>
        </div>
        <div>
          <p class="text-slate-400">Local Time</p>
          <p class="text-white font-semibold">{{ currentTime.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
