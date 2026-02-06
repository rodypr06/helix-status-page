<script setup>
import { subagentsStore, getStatusBadge } from '../stores/subagents'
import { formatNumber } from '../stores/metrics'
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">🤖</span>
      Sub-Agents
    </h2>

    <!-- Active Sub-Agents -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        Currently Running ({{ subagentsStore.active.length }})
      </h3>

      <div v-if="subagentsStore.active.length > 0" class="space-y-3">
        <div
          v-for="agent in subagentsStore.active"
          :key="agent.id"
          class="bg-slate-800/50 rounded-xl p-4 border border-emerald-500/30"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h4 class="font-bold text-white">{{ agent.label }}</h4>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1',
                  getStatusBadge(agent.status).class
                ]">
                  {{ getStatusBadge(agent.status).icon }} {{ agent.status }}
                </span>
              </div>
              <p class="text-slate-400 text-sm font-mono bg-slate-900/50 rounded px-2 py-1 inline-block">
                {{ agent.id.slice(0, 8) }}...
              </p>
            </div>
            <div class="text-right">
              <p class="text-emerald-400 font-semibold">{{ agent.runtime }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-3">
            <div class="bg-slate-900/50 rounded-lg p-2">
              <p class="text-xs text-slate-400">Model</p>
              <p class="text-sm text-cyan-400 truncate">{{ agent.model }}</p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2">
              <p class="text-xs text-slate-400">Tokens</p>
              <p class="text-sm text-white font-semibold">{{ formatNumber(agent.tokens) }}</p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2">
              <p class="text-xs text-slate-400">Status</p>
              <p class="text-sm text-emerald-400 font-semibold">Active</p>
            </div>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3">
            <p class="text-xs text-slate-400 mb-1">Latest Output:</p>
            <p class="text-sm text-white">{{ agent.output }}</p>
          </div>
        </div>
      </div>

      <div v-else class="bg-slate-800/30 rounded-xl p-8 text-center border border-slate-700/50 border-dashed">
        <p class="text-slate-400">No active sub-agents</p>
      </div>
    </div>

    <!-- History -->
    <div>
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span class="text-xl">📜</span>
        Recent History ({{ subagentsStore.history.length }})
      </h3>

      <div class="space-y-3">
        <div
          v-for="agent in subagentsStore.history"
          :key="agent.id"
          class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold text-white">{{ agent.label }}</h4>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium border',
                  getStatusBadge(agent.status).class
                ]">
                  {{ getStatusBadge(agent.status).icon }}
                </span>
              </div>
              <p class="text-xs text-slate-500">{{ agent.completedAt.toLocaleString() }}</p>
            </div>
            <div class="text-right">
              <p class="text-slate-300 text-sm">{{ agent.runtime }}</p>
              <p class="text-slate-400 text-xs">{{ formatNumber(agent.tokens) }} tokens</p>
            </div>
          </div>

          <div class="text-sm">
            <span class="text-slate-400">Model:</span>
            <span class="text-cyan-400 ml-1">{{ agent.model }}</span>
          </div>

          <div class="mt-2 bg-slate-900/30 rounded p-2">
            <p class="text-sm text-slate-300">{{ agent.output }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
