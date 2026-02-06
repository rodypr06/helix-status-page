import { reactive } from 'vue'

export const metricsStore = reactive({
  tokens: {
    total: 2450000,
    byProject: {
      'CRM Builder': 450000,
      'Portfolio Website': 320000,
      'Helix Knowledge Base': 280000,
      'Crypto Watcher': 150000,
      'Other Projects': 1250000
    },
    bySession: {
      'Main Chat': 1800000,
      'Sub-agents': 650000
    },
    byModel: {
      'zai/glm-4.7': 1500000,
      'zai/glm-4.7-flash': 650000,
      'openrouter/perplexity/sonar-pro': 180000,
      'Other': 120000
    },
    costEstimate: 24.50,
    dailyUsage: [120000, 95000, 140000, 110000, 130000, 85000, 105000]
  },
  system: {
    cpu: 12,
    memory: 45,
    disk: 93,
    network: { in: 2.5, out: 1.8 },
    uptime: '45d 12h'
  },
  github: {
    repos: [
      { name: 'rodytech-portfolio', stars: 12, forks: 3, issues: 2 },
      { name: 'helix-crm', stars: 8, forks: 1, issues: 5 },
      { name: 'crypto-watcher', stars: 5, forks: 2, issues: 0 },
      { name: 'rodytech-business', stars: 3, forks: 0, issues: 1 }
    ],
    recentCommits: [
      { repo: 'rodytech-portfolio', message: 'Add responsive design', time: '2h ago' },
      { repo: 'helix-crm', message: 'Fix API authentication', time: '5h ago' },
      { repo: 'crypto-watcher', message: 'Update price feed', time: '1d ago' },
      { repo: 'rodytech-portfolio', message: 'Add contact form', time: '2d ago' }
    ]
  },
  cronJobs: [
    { id: 1, name: 'Heartbeat Check', schedule: '*/30 * * * *', nextRun: 'In 12 min', status: 'active' },
    { id: 2, name: 'Email Monitor', schedule: '0 */2 * * *', nextRun: 'In 45 min', status: 'active' },
    { id: 3, name: 'Backup Script', schedule: '0 2 * * *', nextRun: 'In 18h 45m', status: 'active' },
    { id: 4, name: 'System Health', schedule: '0 */6 * * *', nextRun: 'In 3h 45m', status: 'paused' }
  ],
  changelog: [
    {
      id: 1,
      type: 'project',
      action: 'Started',
      target: 'Helix Status Page',
      timestamp: new Date('2025-12-20T10:30:00'),
      details: 'Comprehensive dashboard project initiated'
    },
    {
      id: 2,
      type: 'code',
      action: 'Committed',
      target: 'rodytech-portfolio',
      timestamp: new Date('2025-12-20T09:15:00'),
      details: 'Add responsive design improvements'
    },
    {
      id: 3,
      type: 'subagent',
      action: 'Spawned',
      target: 'crm-builder',
      timestamp: new Date('2025-12-18T14:30:00'),
      details: 'Backend API development'
    },
    {
      id: 4,
      type: 'cron',
      action: 'Created',
      target: 'Heartbeat Check',
      timestamp: new Date('2025-12-17T10:00:00'),
      details: 'Automated system monitoring'
    },
    {
      id: 5,
      type: 'skill',
      action: 'Installed',
      target: 'gmail',
      timestamp: new Date('2025-12-15T16:45:00'),
      details: 'Email integration capability'
    }
  ]
})

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export function getSystemHealthColor(metric) {
  if (metric >= 90) return 'bg-red-500'
  if (metric >= 70) return 'bg-yellow-500'
  return 'bg-emerald-500'
}
