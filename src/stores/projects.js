import { reactive } from 'vue'

export const projectsStore = reactive({
  projects: [
    {
      id: 'crm-builder',
      name: 'CRM Builder',
      status: 'in-progress',
      progress: 65,
      lastUpdated: new Date('2025-12-18'),
      description: 'Building a comprehensive CRM system for RodyTech'
    },
    {
      id: 'portfolio-website',
      name: 'Portfolio Website',
      status: 'in-progress',
      progress: 85,
      lastUpdated: new Date('2025-12-20'),
      description: 'Personal portfolio showcasing projects and skills'
    },
    {
      id: 'helix-knowledge-base',
      name: 'Helix Knowledge Base',
      status: 'in-progress',
      progress: 45,
      lastUpdated: new Date('2025-12-17'),
      description: 'Centralized knowledge repository for Helix'
    },
    {
      id: 'crypto-watcher',
      name: 'Crypto Watcher',
      status: 'on-hold',
      progress: 30,
      lastUpdated: new Date('2025-12-10'),
      description: 'Cryptocurrency monitoring and alerting system'
    },
    {
      id: 'rodytech-business',
      name: 'RodyTech Business',
      status: 'planning',
      progress: 10,
      lastUpdated: new Date('2025-12-05'),
      description: 'Business operations and management system'
    },
    {
      id: 'local-services-campaign',
      name: 'Local Services Campaign',
      status: 'planning',
      progress: 5,
      lastUpdated: new Date('2025-12-15'),
      description: 'Marketing campaign for local services'
    }
  ]
})

export function getProjectStatusColor(status) {
  const colors = {
    'in-progress': 'text-cyan-400',
    'completed': 'text-emerald-400',
    'on-hold': 'text-yellow-400',
    'planning': 'text-slate-400'
  }
  return colors[status] || 'text-slate-400'
}

export function getProgressColor(progress) {
  if (progress >= 80) return 'from-emerald-500 to-green-600'
  if (progress >= 50) return 'from-cyan-500 to-blue-600'
  if (progress >= 25) return 'from-yellow-500 to-orange-600'
  return 'from-slate-500 to-slate-600'
}
