<script setup>
import { computed } from 'vue'
import { metricsStore, formatNumber } from '../stores/metrics'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(71, 85, 105, 0.3)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      grid: {
        color: 'rgba(71, 85, 105, 0.3)'
      },
      ticks: {
        color: '#94a3b8'
      }
    }
  }
}

const dailyUsageData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Tokens Used',
      data: metricsStore.tokens.dailyUsage,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

const byProjectData = computed(() => ({
  labels: Object.keys(metricsStore.tokens.byProject),
  datasets: [
    {
      data: Object.values(metricsStore.tokens.byProject),
      backgroundColor: [
        '#0ea5e9',
        '#3b82f6',
        '#06b6d4',
        '#8b5cf6',
        '#6366f1'
      ],
      borderWidth: 0
    }
  ]
}))

const byModelData = computed(() => ({
  labels: Object.keys(metricsStore.tokens.byModel),
  datasets: [
    {
      data: Object.values(metricsStore.tokens.byModel),
      backgroundColor: [
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#64748b'
      ],
      borderWidth: 0
    }
  ]
}))

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        padding: 15,
        usePointStyle: true
      }
    }
  }
}
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">📊</span>
      Token Consumption
    </h2>

    <!-- Summary Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 border border-cyan-500/30">
        <p class="text-cyan-300 text-sm mb-1">Total Tokens</p>
        <p class="text-3xl font-bold text-white">{{ formatNumber(metricsStore.tokens.total) }}</p>
      </div>

      <div class="bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl p-4 border border-emerald-500/30">
        <p class="text-emerald-300 text-sm mb-1">Cost Estimate</p>
        <p class="text-3xl font-bold text-white">${{ metricsStore.tokens.costEstimate.toFixed(2) }}</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
        <p class="text-purple-300 text-sm mb-1">Avg Daily</p>
        <p class="text-3xl font-bold text-white">{{ formatNumber(Math.round(metricsStore.tokens.total / 30)) }}</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Daily Usage Line Chart -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-white mb-4">Last 7 Days</h3>
        <div class="h-64">
          <Line :data="dailyUsageData" :options="chartOptions" />
        </div>
      </div>

      <!-- By Project Doughnut -->
      <div class="bg-slate-800/50 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-white mb-4">By Project</h3>
        <div class="h-64">
          <Doughnut :data="byProjectData" :options="donutOptions" />
        </div>
      </div>

      <!-- By Model Doughnut -->
      <div class="bg-slate-800/50 rounded-xl p-4 col-span-2">
        <h3 class="text-lg font-semibold text-white mb-4">By Model</h3>
        <div class="h-64 max-w-md mx-auto">
          <Doughnut :data="byModelData" :options="donutOptions" />
        </div>
      </div>
    </div>

    <!-- Session Breakdown -->
    <div class="mt-6 pt-6 border-t border-slate-700/50">
      <h3 class="text-lg font-semibold text-white mb-4">Session Breakdown</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-800/50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-slate-300">Main Chat</span>
            <span class="text-cyan-400 font-bold">{{ formatNumber(metricsStore.tokens.bySession['Main Chat']) }}</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2">
            <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" :style="{ width: (metricsStore.tokens.bySession['Main Chat'] / metricsStore.tokens.total * 100) + '%' }"></div>
          </div>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-slate-300">Sub-agents</span>
            <span class="text-emerald-400 font-bold">{{ formatNumber(metricsStore.tokens.bySession['Sub-agents']) }}</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2">
            <div class="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" :style="{ width: (metricsStore.tokens.bySession['Sub-agents'] / metricsStore.tokens.total * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
