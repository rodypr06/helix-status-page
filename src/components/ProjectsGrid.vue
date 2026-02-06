<script setup>
import { projectsStore, getProjectStatusColor, getProgressColor } from '../stores/projects'
</script>

<template>
  <div class="glass-card p-6">
    <h2 class="text-xl font-bold gradient-text mb-6 flex items-center gap-2">
      <span class="text-2xl">🚀</span>
      Active Projects
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="project in projectsStore.projects"
        :key="project.id"
        class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-bold text-white">{{ project.name }}</h3>
            <p class="text-slate-400 text-sm mt-1">{{ project.description }}</p>
          </div>
          <span :class="[
            'px-3 py-1 rounded-full text-xs font-semibold border',
            project.status === 'in-progress' && 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            project.status === 'completed' && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            project.status === 'on-hold' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            project.status === 'planning' && 'bg-slate-500/20 text-slate-400 border-slate-500/30'
          ]">
            {{ project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-slate-400">Progress</span>
            <span class="font-bold text-white">{{ project.progress }}%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :class="[
                'bg-gradient-to-r',
                getProgressColor(project.progress)
              ]"
              :style="{ width: project.progress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span>📅</span>
            <span>{{ project.lastUpdated.toLocaleDateString() }}</span>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              View
            </button>
            <button class="px-3 py-1.5 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Project Button -->
    <div class="mt-6">
      <button class="w-full py-4 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2">
        <span class="text-xl">➕</span>
        <span>Add New Project</span>
      </button>
    </div>
  </div>
</template>
