<script setup>
import { metricsStore } from '../stores/metrics'
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">🐙</span>
      GitHub Activity
    </h2>

    <!-- Repositories -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-white mb-4">Repositories</h3>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="repo in metricsStore.github.repos"
          :key="repo.name"
          class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">{{ repo.name[0].toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-white truncate">{{ repo.name }}</h4>
              <p class="text-sm text-slate-400">{{ repo.name }}</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex items-center gap-1.5">
              <span class="text-yellow-400">⭐</span>
              <span class="text-slate-300 font-semibold">{{ repo.stars }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-blue-400">🍴</span>
              <span class="text-slate-300 font-semibold">{{ repo.forks }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-red-400">🐛</span>
              <span class="text-slate-300 font-semibold">{{ repo.issues }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Commits -->
    <div>
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span class="text-emerald-400">●</span>
        Recent Commits
      </h3>

      <div class="space-y-3">
        <div
          v-for="(commit, index) in metricsStore.github.recentCommits"
          :key="index"
          class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all"
        >
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-400 text-sm">{{ commit.repo[0].toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-cyan-400 font-semibold text-sm">{{ commit.repo }}</span>
                <span class="text-slate-500">·</span>
                <span class="text-slate-400 text-sm">{{ commit.time }}</span>
              </div>
              <p class="text-white">{{ commit.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
