<script setup>
import { computed } from 'vue'
import { metricsStore } from '../stores/metrics'

const typeIcons = {
  project: '🚀',
  code: '💻',
  subagent: '🤖',
  cron: '⏰',
  skill: '🔧'
}

const typeColors = {
  project: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  code: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  subagent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cron: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  skill: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
}
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold gradient-text flex items-center gap-2">
        <span class="text-2xl">📜</span>
        Activity History
      </h2>

      <!-- Search -->
      <div class="relative">
        <input
          type="text"
          placeholder="Search activity..."
          class="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-64"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button class="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-medium">
        All
      </button>
      <button class="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50 text-sm font-medium transition-colors">
        🚀 Projects
      </button>
      <button class="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50 text-sm font-medium transition-colors">
        💻 Code
      </button>
      <button class="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50 text-sm font-medium transition-colors">
        🤖 Sub-agents
      </button>
      <button class="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50 text-sm font-medium transition-colors">
        ⏰ Cron Jobs
      </button>
    </div>

    <!-- Activity Feed -->
    <div class="space-y-4">
      <div
        v-for="item in metricsStore.changelog"
        :key="item.id"
        class="flex gap-4 group"
      >
        <!-- Timeline -->
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-cyan-500/50 transition-colors flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ typeIcons[item.type] }}</span>
          </div>
          <div class="w-0.5 h-full bg-slate-700/50 mt-2"></div>
        </div>

        <!-- Content -->
        <div class="flex-1 pb-6">
          <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium border',
                    typeColors[item.type]
                  ]"
                >
                  {{ item.type }}
                </span>
                <span class="text-white font-semibold">{{ item.action }}</span>
                <span class="text-cyan-400 font-semibold">{{ item.target }}</span>
              </div>
              <span class="text-sm text-slate-400">{{ item.timestamp.toLocaleString() }}</span>
            </div>

            <p class="text-slate-300">{{ item.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
