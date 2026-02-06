<script setup>
import { computed } from 'vue'
import { metricsStore } from '../stores/metrics'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

const tokenTrendData = computed(() => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Tokens Used',
      data: [520000, 610000, 580000, 740000],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Cost ($)',
      data: [5.20, 6.10, 5.80, 7.40],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
}))

const modelPerformanceData = computed(() => ({
  labels: ['GLM-4.7', 'GLM-4.7 Flash', 'Sonar Pro', 'Other'],
  datasets: [
    {
      label: 'Tokens',
      data: [1500000, 650000, 180000, 120000],
      backgroundColor: [
        '#0ea5e9',
        '#06b6d4',
        '#8b5cf6',
        '#64748b'
      ],
      borderWidth: 0
    }
  ]
}))

const projectTokensData = computed(() => ({
  labels: Object.keys(metricsStore.tokens.byProject),
  datasets: [
    {
      label: 'Tokens',
      data: Object.values(metricsStore.tokens.byProject),
      backgroundColor: 'rgba(14, 165, 233, 0.8)',
      borderColor: '#0ea5e9',
      borderWidth: 1
    }
  ]
}))
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold gradient-text">Analytics</h1>
          <p class="text-slate-400 mt-2">Detailed insights and performance metrics</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            📥 Export Report
          </button>
          <button class="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="glass-card p-5">
        <p class="text-slate-400 text-sm mb-2">Total Tokens</p>
        <p class="text-3xl font-bold text-white">2.45M</p>
        <p class="text-emerald-400 text-sm mt-2">↑ 12% from last month</p>
      </div>
      <div class="glass-card p-5">
        <p class="text-slate-400 text-sm mb-2">Total Cost</p>
        <p class="text-3xl font-bold text-white">$24.50</p>
        <p class="text-yellow-400 text-sm mt-2">↑ 8% from last month</p>
      </div>
      <div class="glass-card p-5">
        <p class="text-slate-400 text-sm mb-2">Avg Daily</p>
        <p class="text-3xl font-bold text-white">81.7K</p>
        <p class="text-emerald-400 text-sm mt-2">↓ 5% from last week</p>
      </div>
      <div class="glass-card p-5">
        <p class="text-slate-400 text-sm mb-2">Active Projects</p>
        <p class="text-3xl font-bold text-white">3</p>
        <p class="text-cyan-400 text-sm mt-2">Currently in progress</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-2 gap-6">
      <div class="glass-card p-6">
        <h3 class="text-xl font-bold text-white mb-4">Monthly Token Trend</h3>
        <div class="h-80">
          <Line :data="tokenTrendData" :options="chartOptions" />
        </div>
      </div>

      <div class="glass-card p-6">
        <h3 class="text-xl font-bold text-white mb-4">Model Distribution</h3>
        <div class="h-80">
          <Bar :data="modelPerformanceData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="glass-card p-6">
      <h3 class="text-xl font-bold text-white mb-4">Tokens by Project</h3>
      <div class="h-80">
        <Bar :data="projectTokensData" :options="chartOptions" />
      </div>
    </div>

    <!-- Cost Breakdown -->
    <div class="grid grid-cols-2 gap-6">
      <div class="glass-card p-6">
        <h3 class="text-xl font-bold text-white mb-4">Cost Breakdown by Model</h3>
        <div class="space-y-4">
          <div v-for="(tokens, model) in metricsStore.tokens.byModel" :key="model" class="bg-slate-800/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white font-semibold">{{ model }}</span>
              <span class="text-cyan-400 font-bold">{{ ((tokens / metricsStore.tokens.total) * metricsStore.tokens.costEstimate).toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-400">{{ (tokens / 1000).toFixed(0) }}K tokens</span>
              <span class="text-slate-400">{{ ((tokens / metricsStore.tokens.total) * 100).toFixed(1) }}%</span>
            </div>
            <div class="mt-2 w-full bg-slate-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" :style="{ width: ((tokens / metricsStore.tokens.total) * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card p-6">
        <h3 class="text-xl font-bold text-white mb-4">Budget & Forecast</h3>
        <div class="space-y-4">
          <div class="bg-slate-800/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white font-semibold">Monthly Budget</span>
              <span class="text-emerald-400 font-bold">$50.00</span>
            </div>
            <div class="mt-2 w-full bg-slate-700 rounded-full h-3">
              <div class="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full" style="width: 49%"></div>
            </div>
            <p class="text-sm text-slate-400 mt-2">Used $24.50 of $50.00 (49%)</p>
          </div>

          <div class="bg-slate-800/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white font-semibold">Forecast (End of Month)</span>
              <span class="text-yellow-400 font-bold">$38.50</span>
            </div>
            <p class="text-sm text-slate-400">Based on current usage pattern</p>
          </div>

          <div class="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
            <div class="flex items-center gap-2 text-emerald-400 mb-2">
              <span class="text-xl">✅</span>
              <span class="font-semibold">On Track</span>
            </div>
            <p class="text-sm text-emerald-300">You're within budget. Continue current usage patterns to stay within limit.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
