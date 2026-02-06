<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gatewayStore, updateGatewayStatus } from '../stores/gateway'

let updateInterval

onMounted(() => {
  updateGatewayStatus()
  updateInterval = setInterval(updateGatewayStatus, 5000)
})

onUnmounted(() => {
  clearInterval(updateInterval)
})
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">🖥️</span>
      Gateway Status
    </h2>

    <div class="grid grid-cols-2 gap-4">
      <!-- Uptime -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Uptime</p>
        <p class="text-2xl font-bold text-white">{{ gatewayStore.status.uptime }}</p>
      </div>

      <!-- Status -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Status</p>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <p class="text-2xl font-bold text-emerald-400">Online</p>
        </div>
      </div>

      <!-- Connection -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Connection</p>
        <p class="text-xl font-bold text-white flex items-center gap-2">
          <span class="text-emerald-400">●</span>
          WebSocket
        </p>
        <p class="text-sm text-slate-400">Latency: {{ gatewayStore.status.latency }}ms</p>
      </div>

      <!-- Memory -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Memory Usage</p>
        <p class="text-2xl font-bold text-cyan-400">{{ gatewayStore.status.memoryUsage }} MB</p>
      </div>

      <!-- Node.js -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Runtime</p>
        <p class="text-xl font-bold text-white">Node.js {{ gatewayStore.status.nodeVersion }}</p>
      </div>

      <!-- Model -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <p class="text-slate-400 text-sm mb-1">Active Model</p>
        <p class="text-lg font-bold text-indigo-400 truncate">{{ gatewayStore.status.model }}</p>
      </div>
    </div>

    <!-- Agent Status -->
    <div class="mt-6 pt-6 border-t border-slate-700/50">
      <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span class="text-xl">🤖</span>
        Agent Status (Helix)
      </h3>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-800/50 rounded-xl p-4">
          <p class="text-slate-400 text-sm mb-1">Current Activity</p>
          <p class="text-lg font-semibold text-white">{{ gatewayStore.agent.currentActivity }}</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-4">
          <p class="text-slate-400 text-sm mb-1">Active Session</p>
          <p class="text-lg font-mono text-cyan-400 text-sm">{{ gatewayStore.agent.activeSession }}</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-4">
          <p class="text-slate-400 text-sm mb-1">Response Time</p>
          <p class="text-2xl font-bold text-emerald-400">{{ gatewayStore.agent.responseTime }}ms</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-4">
          <p class="text-slate-400 text-sm mb-1">Last Heartbeat</p>
          <p class="text-lg font-semibold text-white">{{ gatewayStore.agent.lastHeartbeat.toLocaleTimeString() }}</p>
        </div>
      </div>

      <div class="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
        <p class="text-slate-400 text-sm mb-1">Personality</p>
        <p class="text-lg font-semibold text-white">💫 {{ gatewayStore.agent.personality }}</p>
      </div>
    </div>
  </div>
</template>
