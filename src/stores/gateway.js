import { reactive } from 'vue'

export const gatewayStore = reactive({
  status: {
    uptime: '0d 0h 0m',
    connection: 'connected',
    latency: 14,
    memoryUsage: 345,
    nodeVersion: 'v25.5.0',
    model: 'zai/glm-4.7',
    status: 'online'
  },
  agent: {
    currentActivity: 'Building Helix Status Page',
    activeSession: 'agent:main',
    responseTime: 1250,
    lastHeartbeat: new Date(),
    personality: 'Rodybot - Energetic & Fun'
  }
})

export async function updateGatewayStatus() {
  // In production, this would fetch from the Gateway API
  // For now, we'll simulate with realistic data
  gatewayStore.status.uptime = formatUptime(calculateUptime())
  gatewayStore.status.latency = Math.floor(Math.random() * 10) + 10
  gatewayStore.status.memoryUsage = Math.floor(Math.random() * 50) + 320
  gatewayStore.agent.lastHeartbeat = new Date()
}

function calculateUptime() {
  // Simulated uptime - in production, fetch from Gateway
  const startDate = new Date('2025-12-01T00:00:00')
  const now = new Date()
  const diff = now - startDate
  return Math.floor(diff / 1000)
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}
