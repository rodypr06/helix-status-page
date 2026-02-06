import { reactive } from 'vue'

export const subagentsStore = reactive({
  active: [
    {
      id: '22dc98be-e99e-4fc3-a4d0-3d3d5fa6885a',
      label: 'helix-status-page',
      status: 'running',
      model: 'zai/glm-4.7',
      runtime: '45m 32s',
      tokens: 12500,
      output: 'Building comprehensive dashboard with Vue 3...'
    }
  ],
  history: [
    {
      id: 'abc123',
      label: 'crm-builder',
      status: 'completed',
      model: 'zai/glm-4.7',
      runtime: '1h 15m',
      tokens: 45200,
      completedAt: new Date('2025-12-18T14:30:00'),
      output: 'CRM backend API successfully implemented'
    },
    {
      id: 'def456',
      label: 'crypto-research',
      status: 'completed',
      model: 'openrouter/perplexity/sonar-pro',
      runtime: '25m',
      tokens: 8900,
      completedAt: new Date('2025-12-17T09:15:00'),
      output: 'Market analysis report generated'
    },
    {
      id: 'ghi789',
      label: 'email-processor',
      status: 'failed',
      model: 'zai/glm-4.7',
      runtime: '3m',
      tokens: 1200,
      completedAt: new Date('2025-12-16T16:45:00'),
      output: 'Connection timeout to Gmail API'
    }
  ]
})

export function getStatusBadge(status) {
  const badges = {
    'running': { class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: '🔄' },
    'completed': { class: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '✅' },
    'failed': { class: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '❌' }
  }
  return badges[status] || { class: 'bg-slate-500/20 text-slate-400', icon: '❓' }
}
