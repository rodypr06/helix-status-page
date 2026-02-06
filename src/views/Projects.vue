<script setup>
import { ref } from 'vue'
import ProjectsGrid from '../components/ProjectsGrid.vue'
import { projectsStore } from '../stores/projects'

const filterStatus = ref('all')
const searchQuery = ref('')

const filteredProjects = ref(projectsStore.projects)

function filterProjects() {
  filteredProjects.value = projectsStore.projects.filter(project => {
    const matchesStatus = filterStatus.value === 'all' || project.status === filterStatus.value
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
}

// Watch for changes and filter
import { watch } from 'vue'

watch([filterStatus, searchQuery], filterProjects)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold gradient-text">Projects</h1>
          <p class="text-slate-400 mt-2">Manage and track all your projects</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
          + New Project
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-card p-6">
      <div class="flex gap-4 flex-wrap">
        <!-- Search -->
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <!-- Status Filter -->
        <select
          v-model="filterStatus"
          class="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
          <option value="planning">Planning</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="glass-card p-5 text-center">
        <p class="text-4xl font-bold gradient-text">{{ projectsStore.projects.length }}</p>
        <p class="text-slate-400 mt-2">Total Projects</p>
      </div>
      <div class="glass-card p-5 text-center">
        <p class="text-4xl font-bold text-cyan-400">{{ projectsStore.projects.filter(p => p.status === 'in-progress').length }}</p>
        <p class="text-slate-400 mt-2">In Progress</p>
      </div>
      <div class="glass-card p-5 text-center">
        <p class="text-4xl font-bold text-emerald-400">{{ projectsStore.projects.filter(p => p.status === 'completed').length }}</p>
        <p class="text-slate-400 mt-2">Completed</p>
      </div>
      <div class="glass-card p-5 text-center">
        <p class="text-4xl font-bold text-yellow-400">{{ projectsStore.projects.filter(p => p.status === 'on-hold').length }}</p>
        <p class="text-slate-400 mt-2">On Hold</p>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="glass-card p-6 hover:border-cyan-500/50 transition-all"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-2">{{ project.name }}</h3>
            <p class="text-slate-400">{{ project.description }}</p>
          </div>
          <span :class="[
            'px-3 py-1.5 rounded-full text-sm font-semibold border',
            project.status === 'in-progress' && 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            project.status === 'completed' && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            project.status === 'on-hold' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            project.status === 'planning' && 'bg-slate-500/20 text-slate-400 border-slate-500/30'
          ]">
            {{ project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
          </span>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-slate-400">Progress</span>
            <span class="font-bold text-white">{{ project.progress }}%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-blue-600"
              :style="{ width: project.progress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="bg-slate-800/50 rounded-lg p-3">
            <p class="text-xs text-slate-400 mb-1">Last Updated</p>
            <p class="text-white font-semibold">{{ project.lastUpdated.toLocaleDateString() }}</p>
          </div>
          <div class="bg-slate-800/50 rounded-lg p-3">
            <p class="text-xs text-slate-400 mb-1">Status</p>
            <p class="text-white font-semibold capitalize">{{ project.status }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-slate-700/50">
          <button class="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">
            📋 View Details
          </button>
          <button class="flex-1 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors font-medium">
            ✏️ Edit
          </button>
          <button class="flex-1 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">
            📊 Analytics
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
