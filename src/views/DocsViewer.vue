<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()

interface DocCategory {
  id: string
  label: string
  icon: string
  files: Array<{ name: string; path: string }>
}

const categories = ref<DocCategory[]>([
  {
    id: 'command-center',
    label: 'Command Center',
    icon: '🎯',
    files: [
      { name: 'Complete Guide', path: 'command-center/COMMAND-CENTER-COMPLETE.md' },
      { name: 'Operations Runbook', path: 'command-center/COMMAND-CENTER-OPS-RUNBOOK.md' },
      { name: 'Production Architecture', path: 'command-center/COMMAND-CENTER-PRODUCTION-ARCHITECTURE.md' },
      { name: 'Root Cause Analysis', path: 'command-center/COMMAND-CENTER-ROOT-CAUSE-ANALYSIS.md' },
      { name: 'Stability Report', path: 'command-center/COMMAND-CENTER-STABILITY-REPORT.md' }
    ]
  },
  {
    id: 'guides',
    label: 'Guides',
    icon: '📖',
    files: [
      { name: 'Quick Start', path: 'guides/QUICK-START.md' },
      { name: 'User Guide', path: 'guides/USER_GUIDE.md' },
      { name: 'API Reference', path: 'guides/API_REFERENCE.md' }
    ]
  },
  {
    id: 'deployment',
    label: 'Deployment',
    icon: '🚀',
    files: [
      { name: 'Quick Start', path: 'deployment/DEPLOYMENT_QUICKSTART.md' },
      { name: 'Deployment Guide', path: 'deployment/DEPLOYMENT.md' },
      { name: 'Mac Mini Setup', path: 'deployment/DEPLOYMENT_MAC_MINI.md' },
      { name: 'Cloudflared Setup', path: 'deployment/CLOUDFLARED_DEPLOYMENT.md' },
      { name: 'Summary', path: 'deployment/DEPLOYMENT_SUMMARY.md' }
    ]
  },
  {
    id: 'pwa',
    label: 'PWA',
    icon: '📱',
    files: [
      { name: 'Quick Start', path: 'pwa/PWA_QUICK_START.md' },
      { name: 'Setup Guide', path: 'pwa/PWA_SETUP.md' },
      { name: 'Testing Guide', path: 'pwa/PWA_TESTING_GUIDE.md' },
      { name: 'Implementation Summary', path: 'pwa/PWA_IMPLEMENTATION_SUMMARY.md' },
      { name: 'Deployment Checklist', path: 'pwa/PWA_DEPLOYMENT_CHECKLIST.md' }
    ]
  },
  {
    id: 'features',
    label: 'Features',
    icon: '✨',
    files: [
      { name: 'Features Overview', path: 'features/FEATURES.md' },
      { name: 'MagicUI Enhancement', path: 'features/MAGICUI_ENHANCEMENT_PLAN.md' }
    ]
  },
  {
    id: 'fixes',
    label: 'Fixes & Updates',
    icon: '🔧',
    files: [
      { name: 'Fixes Applied', path: 'fixes/FIXES-APPLIED.md' },
      { name: 'API Fix Summary', path: 'fixes/API-FIX-SUMMARY.md' },
      { name: 'API Implementation', path: 'fixes/API_IMPLEMENTATION_SUMMARY.md' },
      { name: 'Realtime Fix', path: 'fixes/REALTIME-FIX-SUMMARY.md' },
      { name: 'Styling Fix', path: 'fixes/STYLING-FIX-SUMMARY.md' },
      { name: 'Diagnostic Report', path: 'fixes/DIAGNOSTIC-REPORT.md' }
    ]
  },
  {
    id: 'production',
    label: 'Production',
    icon: '🏭',
    files: [
      { name: 'Production Status', path: 'production/PRODUCTION-STATUS.md' },
      { name: 'Project Summary', path: 'production/PROJECT-SUMMARY.md' }
    ]
  },
  {
    id: 'upgrades',
    label: 'Upgrades',
    icon: '⬆️',
    files: [
      { name: 'Upgrade Complete', path: 'upgrades/UPGRADE-COMPLETE.md' },
      { name: 'Upgrade Summary', path: 'upgrades/UPGRADE-SUMMARY.md' },
      { name: 'Completion Report', path: 'upgrades/UPGRADE_COMPLETION_REPORT.md' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📊',
    files: [
      { name: 'Deliverables', path: 'reports/DELIVERABLES.md' },
      { name: 'Mission Complete', path: 'reports/MISSION-COMPLETE.md' }
    ]
  }
])

const selectedCategory = ref<string>('')
const selectedFile = ref<string>('')
const markdownContent = ref<string>('')
const renderedHtml = ref<string>('')
const loading = ref(false)
const error = ref<string>('')

// Computed: Get current category object
const currentCategory = computed(() => {
  return categories.value.find(cat => cat.id === selectedCategory.value)
})

// Watch route params
watch(
  () => [route.params.category, route.params.file],
  ([category, file]) => {
    if (category) {
      selectedCategory.value = category as string
      if (file) {
        selectedFile.value = file as string
        loadDocument(`${category}/${file}`)
      } else {
        // Load first file in category
        const cat = categories.value.find(c => c.id === category)
        if (cat && cat.files.length > 0) {
          selectedFile.value = cat.files[0].path.split('/')[1]
          loadDocument(cat.files[0].path)
        }
      }
    } else if (categories.value.length > 0) {
      // Default to first category
      selectedCategory.value = categories.value[0].id
      selectedFile.value = categories.value[0].files[0].path.split('/')[1]
      router.push(`/docs/${selectedCategory.value}/${selectedFile.value}`)
    }
  },
  { immediate: true }
)

async function loadDocument(path: string) {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`/docs/${path}`)
    if (!response.ok) {
      throw new Error(`Failed to load document: ${response.statusText}`)
    }
    
    markdownContent.value = await response.text()
    
    // Configure marked for better rendering
    marked.setOptions({
      breaks: true,
      gfm: true
    })
    
    renderedHtml.value = marked.parse(markdownContent.value) as string
  } catch (err) {
    error.value = `Error loading document: ${err instanceof Error ? err.message : 'Unknown error'}`
    console.error('Failed to load document:', err)
  } finally {
    loading.value = false
  }
}

function selectCategory(categoryId: string) {
  const category = categories.value.find(c => c.id === categoryId)
  if (category && category.files.length > 0) {
    const firstFile = category.files[0].path.split('/')[1]
    router.push(`/docs/${categoryId}/${firstFile}`)
  }
}

function selectFile(file: { name: string; path: string }) {
  const fileName = file.path.split('/')[1]
  router.push(`/docs/${selectedCategory.value}/${fileName}`)
}

onMounted(() => {
  // If no route params, load default
  if (!route.params.category && categories.value.length > 0) {
    selectCategory(categories.value[0].id)
  }
})
</script>

<template>
  <div class="flex h-full gap-4">
    <!-- Categories Sidebar -->
    <div class="w-72 glass-card p-6 overflow-y-auto">
      <h2 class="text-xl font-bold text-white mb-6">📚 Documentation</h2>
      
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          ]"
        >
          <span class="text-xl">{{ category.icon }}</span>
          <span class="font-medium">{{ category.label }}</span>
        </button>
      </div>

      <!-- Files in Selected Category -->
      <div v-if="currentCategory" class="mt-6 pt-6 border-t border-slate-700/50">
        <h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
          {{ currentCategory.label }}
        </h3>
        <div class="space-y-1">
          <button
            v-for="file in currentCategory.files"
            :key="file.path"
            @click="selectFile(file)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
              selectedFile === file.path.split('/')[1]
                ? 'bg-blue-500/10 text-cyan-400 font-medium'
                : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
            ]"
          >
            {{ file.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Document Viewer -->
    <div class="flex-1 glass-card p-8 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          <p class="text-slate-400 mt-4">Loading documentation...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert-error">
        <span class="text-2xl">⚠️</span>
        <div>
          <h3 class="font-semibold">Error Loading Document</h3>
          <p class="text-sm mt-1">{{ error }}</p>
        </div>
      </div>

      <!-- Document Content -->
      <div v-else class="prose prose-invert prose-slate max-w-none">
        <div v-html="renderedHtml" class="markdown-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: rgb(226, 232, 240);
}

:deep(.markdown-content) {
  line-height: 1.7;
}

:deep(.markdown-content h1) {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(71, 85, 105, 0.5);
}

:deep(.markdown-content h2) {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

:deep(.markdown-content h3) {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(226, 232, 240);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

:deep(.markdown-content h4) {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(203, 213, 225);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.markdown-content p) {
  color: rgb(203, 213, 225);
  margin-bottom: 1rem;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  color: rgb(203, 213, 225);
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

:deep(.markdown-content li) {
  margin-bottom: 0.5rem;
}

:deep(.markdown-content code) {
  background-color: rgba(30, 41, 59, 0.5);
  color: rgb(34, 211, 238);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

:deep(.markdown-content pre) {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

:deep(.markdown-content pre code) {
  background-color: transparent;
  color: rgb(203, 213, 225);
  padding: 0;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid rgba(34, 211, 238, 0.5);
  padding-left: 1rem;
  font-style: italic;
  color: rgb(148, 163, 184);
  margin: 1rem 0;
}

:deep(.markdown-content a) {
  color: rgb(34, 211, 238);
  text-decoration: underline;
  transition: color 0.2s;
}

:deep(.markdown-content a:hover) {
  color: rgb(103, 232, 249);
}

:deep(.markdown-content table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

:deep(.markdown-content th) {
  background-color: rgba(30, 41, 59, 0.5);
  color: rgb(226, 232, 240);
  font-weight: 600;
  padding: 0.5rem 1rem;
  text-align: left;
  border: 1px solid rgba(71, 85, 105, 0.5);
}

:deep(.markdown-content td) {
  color: rgb(203, 213, 225);
  padding: 0.5rem 1rem;
  border: 1px solid rgba(71, 85, 105, 0.5);
}

:deep(.markdown-content img) {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

:deep(.markdown-content hr) {
  border-color: rgba(71, 85, 105, 0.5);
  margin: 2rem 0;
}

:deep(.markdown-content strong) {
  color: white;
  font-weight: 600;
}

:deep(.markdown-content em) {
  color: rgb(203, 213, 225);
  font-style: italic;
}
</style>
