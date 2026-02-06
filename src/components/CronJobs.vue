<script setup>
import { metricsStore } from '../stores/metrics'
</script>

<template>
  <div class="glass-card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold gradient-text flex items-center gap-2">
        <span class="text-2xl">⏰</span>
        Cron Jobs
      </h2>

      <button class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
        + New Job
      </button>
    </div>

    <!-- Active Jobs -->
    <div class="space-y-3">
      <div
        v-for="job in metricsStore.cronJobs"
        :key="job.id"
        class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h4 class="font-bold text-white">{{ job.name }}</h4>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium border',
                  job.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                ]"
              >
                {{ job.status === 'active' ? '● Active' : '⏸ Paused' }}
              </span>
            </div>
            <p class="text-slate-400 text-sm font-mono bg-slate-900/50 rounded px-3 py-1.5 inline-block">
              {{ job.schedule }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-slate-400 text-sm mb-1">Next Run</p>
            <p class="text-cyan-400 font-semibold">{{ job.nextRun }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-3 border-t border-slate-700/50">
          <button class="flex-1 py-2 px-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            📝 Edit
          </button>
          <button
            :class="[
              'flex-1 py-2 px-3 rounded-lg text-sm transition-colors',
              job.status === 'active'
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
            ]"
          >
            {{ job.status === 'active' ? '⏸ Pause' : '▶ Resume' }}
          </button>
          <button class="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-6 grid grid-cols-3 gap-4">
      <div class="bg-slate-800/50 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-emerald-400">{{ metricsStore.cronJobs.filter(j => j.status === 'active').length }}</p>
        <p class="text-slate-400 text-sm mt-1">Active Jobs</p>
      </div>
      <div class="bg-slate-800/50 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-yellow-400">{{ metricsStore.cronJobs.filter(j => j.status === 'paused').length }}</p>
        <p class="text-slate-400 text-sm mt-1">Paused Jobs</p>
      </div>
      <div class="bg-slate-800/50 rounded-xl p-4 text-center">
        <p class="text-3xl font-bold text-cyan-400">{{ metricsStore.cronJobs.length }}</p>
        <p class="text-slate-400 text-sm mt-1">Total Jobs</p>
      </div>
    </div>
  </div>
</template>
