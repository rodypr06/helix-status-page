<script setup>
import GatewayStatus from '../components/GatewayStatus.vue'
import SystemMetrics from '../components/SystemMetrics.vue'
import TokenUsage from '../components/TokenUsage.vue'
import ProjectsGrid from '../components/ProjectsGrid.vue'
import SubAgentsList from '../components/SubAgentsList.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold gradient-text">Dashboard</h1>
          <p class="text-slate-400 mt-2">Real-time monitoring and control center</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-emerald-400 font-semibold">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Row -->
    <div class="grid grid-cols-2 gap-6">
      <GatewayStatus />
      <SystemMetrics />
    </div>

    <!-- Middle Row -->
    <div class="grid grid-cols-2 gap-6">
      <TokenUsage />
      <SubAgentsList />
    </div>

    <!-- Bottom Row -->
    <ProjectsGrid />
  </div>
</template>
