<script setup>
import { ref, computed } from 'vue'
import { metricsStore } from '../stores/metrics'

const filterType = ref('all')
const searchQuery = ref('')

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

const filteredLog = computed(() => {
  return metricsStore.changelog.filter(item => {
    const matchesType = filterType.value === 'all' || item.type === filterType.value
    const matchesSearch = item.target.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.details.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesType && matchesSearch
  })
})

const typeCounts = computed(() => {
  return {
    all: metricsStore.changelog.length,
    project: metricsStore.changelog.filter(i => i.type === 'project').length,
    code: metricsStore.changelog.filter(i => i.type === 'code').length,
    subagent: metricsStore.changelog.filter(i => i.type === 'subagent').length,
    cron: metricsStore.changelog.filter(i => i.type === 'cron').length,
    skill: metricsStore.changelog.filter(i => i.type === 'skill').length
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold gradient-text">Activity History</h1>
          <p class="text-slate-400 mt-2">Complete log of all activities and changes</p>
        </div>
        <button class="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
          📥 Export CSV
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-card p-6">
      <div class="flex gap-4 flex-wrap items-center">
        <!-- Search -->
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search activities..."
            class="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <!-- Type Filters -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="(count, type) in typeCounts"
            :key="type"
            @click="filterType = type"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterType === type
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-700/50'
            ]"
          >
            {{ type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) }}
            <span :class="filterType === type ? 'text-cyan-300' : 'text-slate-500'">({{ count }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-5 gap-4">
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-white">{{ typeCounts.all }}</p>
        <p class="text-slate-400 text-sm">Total</p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-purple-400">{{ typeCounts.project }}</p>
        <p class="text-slate-400 text-sm">Projects</p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-cyan-400">{{ typeCounts.code }}</p>
        <p class="text-slate-400 text-sm">Code</p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-emerald-400">{{ typeCounts.subagent }}</p>
        <p class="text-slate-400 text-sm">Sub-agents</p>
      </div>
      <div class="glass-card p-4 text-center">
        <p class="text-2xl font-bold text-yellow-400">{{ typeCounts.cron }}</p>
        <p class="text-slate-400 text-sm">Cron Jobs</p>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="glass-card p-6">
      <div class="space-y-6">
        <div
          v-for="item in filteredLog"
          :key="item.id"
          class="flex gap-4 group"
        >
          <!-- Timeline Line -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 rounded-xl bg-slate-800 border-2 border-slate-600 group-hover:border-cyan-500/50 transition-all flex items-center justify-center flex-shrink-0 shadow-lg">
              <span class="text-2xl">{{ typeIcons[item.type] }}</span>
            </div>
            <div v-if="item.id !== filteredLog[filteredLog.length - 1].id" class="w-0.5 flex-1 bg-gradient-to-b from-cyan-500/30 to-transparent mt-4"></div>
          </div>

          <!-- Content Card -->
          <div class="flex-1 pb-6">
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
              <!-- Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3 flex-wrap">
                  <span
                    :class="[
                      'px-3 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wide',
                      typeColors[item.type]
                    ]"
                  >
                    {{ typeIcons[item.type] }} {{ item.type }}
                  </span>
                  <span class="text-white font-bold text-lg">{{ item.action }}</span>
                  <span class="text-cyan-400 font-semibold">{{ item.target }}</span>
                </div>
                <span class="text-sm text-slate-400">{{ item.timestamp.toLocaleString() }}</span>
              </div>

              <!-- Description -->
              <p class="text-slate-300 text-lg">{{ item.details }}</p>

              <!-- Quick Actions -->
              <div class="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                <button class="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                  🔍 Details
                </button>
                <button class="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                  📎 Related
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLog.length === 0" class="py-16 text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-white mb-2">No activities found</h3>
        <p class="text-slate-400">Try adjusting your search or filter criteria</p>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="filteredLog.length > 0" class="text-center">
      <button class="px-8 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium">
        Load More Activities
      </button>
    </div>
  </div>
</template>
