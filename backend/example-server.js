/**
 * Helix Status Page - Backend API Example
 *
 * This is a demonstration of how to create a backend API
 * to fetch real data from Gateway and other sources.
 *
 * Usage:
 * 1. Install dependencies: pnpm install express cors
 * 2. Run: node backend/example-server.js
 * 3. API will be available at http://localhost:3000
 */

const express = require('express')
const cors = require('cors')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, '../dist')))

/**
 * Gateway Status Endpoint
 *
 * Fetches real-time status from OpenClaw Gateway
 */
app.get('/api/gateway/status', async (req, res) => {
  try {
    // In production, call the actual Gateway API
    // const gatewayResponse = await fetch('http://127.0.0.1:18789/api/status')
    // const gatewayData = await gatewayResponse.json()

    // Example: Use OpenClaw CLI to get status
    exec('openclaw gateway status', (error, stdout, stderr) => {
      if (error) {
        console.error('Error fetching gateway status:', error)
        return res.status(500).json({ error: 'Failed to fetch gateway status' })
      }

      // Parse the output (adjust parsing based on actual CLI output)
      const uptimeMatch = stdout.match(/Uptime:\s*(.+)/)
      const memoryMatch = stdout.match(/Memory:\s*(.+)/)

      res.json({
        status: 'online',
        uptime: uptimeMatch ? uptimeMatch[1].trim() : 'Unknown',
        memoryUsage: memoryMatch ? memoryMatch[1].trim() : 'Unknown',
        connection: 'connected',
        latency: 14, // Can calculate via ping
        nodeVersion: process.version,
        model: 'zai/glm-4.7'
      })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * System Metrics Endpoint
 *
 * Fetches real system metrics
 */
app.get('/api/system/metrics', (req, res) => {
  exec('top -l 1 -n 0 | grep -E "(CPU|PhysMem)"', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch system metrics' })
    }

    // Parse output (macOS format)
    const cpuMatch = stdout.match(/CPU usage:\s*(\d+\.?\d*)%/)
    const memMatch = stdout.match(/PhysMem:\s*(\d+[A-Z])\s+used/)

    res.json({
      cpu: cpuMatch ? parseFloat(cpuMatch[1]) : 0,
      memory: memMatch ? parseInt(memMatch[1]) : 0,
      timestamp: new Date().toISOString()
    })
  })
})

/**
 * Projects Endpoint
 *
 * Reads project data from workspace files
 */
app.get('/api/projects', (req, res) => {
  const projectsPath = path.join(__dirname, '../memory/projects.json')

  try {
    if (fs.existsSync(projectsPath)) {
      const projectsData = fs.readFileSync(projectsPath, 'utf-8')
      res.json(JSON.parse(projectsData))
    } else {
      // Return example data if file doesn't exist
      res.json([
        {
          id: 'crm-builder',
          name: 'CRM Builder',
          status: 'in-progress',
          progress: 65,
          lastUpdated: new Date().toISOString()
        }
      ])
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Sub-agents Endpoint
 *
 * Lists active and historical sub-agents
 */
app.get('/api/subagents', (req, res) => {
  try {
    // In production, parse workspace logs to find sub-agent sessions
    const workspacePath = process.env.OPENCLAW_WORKSPACE || path.join(__dirname, '..')

    // Example: Find all session directories
    const sessionsPath = path.join(workspacePath, 'sessions')
    if (fs.existsSync(sessionsPath)) {
      const sessions = fs.readdirSync(sessionsPath)
        .filter(dir => dir.startsWith('agent:main:subagent:'))

      res.json({
        active: sessions.slice(0, 5).map(session => ({
          id: session,
          label: session.split(':').pop(),
          status: 'running',
          model: 'zai/glm-4.7',
          runtime: 'Active'
        })),
        total: sessions.length
      })
    } else {
      res.json({ active: [], total: 0 })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * GitHub Activity Endpoint
 *
 * Fetches repository data from GitHub API
 */
app.get('/api/github/repos', async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'your-username'

  if (!GITHUB_TOKEN) {
    return res.status(400).json({ error: 'GITHUB_TOKEN not set' })
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const repos = await response.json()

    res.json(repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      updatedAt: repo.updated_at
    })))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Token Usage Endpoint
 *
 * Calculates token consumption from session logs
 */
app.get('/api/tokens/usage', (req, res) => {
  try {
    const workspacePath = process.env.OPENCLAW_WORKSPACE || path.join(__dirname, '..')
    const sessionsPath = path.join(workspacePath, 'sessions')

    let totalTokens = 0
    let byModel = {}

    // Parse session logs to count tokens
    if (fs.existsSync(sessionsPath)) {
      const sessions = fs.readdirSync(sessionsPath)

      for (const session of sessions) {
        const sessionPath = path.join(sessionsPath, session)
        const transcriptPath = path.join(sessionPath, 'transcript.json')

        if (fs.existsSync(transcriptPath)) {
          const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'))

          // Count tokens from messages (adjust parsing based on actual format)
          transcript.forEach(msg => {
            if (msg.usage) {
              totalTokens += (msg.usage.prompt_tokens || 0) + (msg.usage.completion_tokens || 0)

              const model = msg.model || 'unknown'
              byModel[model] = (byModel[model] || 0) + totalTokens
            }
          })
        }
      }
    }

    res.json({
      total: totalTokens,
      byModel: byModel,
      estimatedCost: totalTokens * 0.00001 // Adjust rate based on actual pricing
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Cron Jobs Endpoint
 *
 * Lists scheduled tasks
 */
app.get('/api/cron/jobs', (req, res) => {
  try {
    // In production, query OpenClaw cron API
    exec('openclaw cron list', (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to fetch cron jobs' })
      }

      // Parse output and return structured data
      res.json({
        jobs: [
          {
            id: 'heartbeat',
            name: 'Heartbeat Check',
            schedule: '*/30 * * * *',
            nextRun: 'In 12 min',
            status: 'active'
          }
        ]
      })
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Helix Status API running at http://localhost:${PORT}`)
  console.log(`\nAvailable endpoints:`)
  console.log(`  GET  /api/gateway/status`)
  console.log(`  GET  /api/system/metrics`)
  console.log(`  GET  /api/projects`)
  console.log(`  GET  /api/subagents`)
  console.log(`  GET  /api/github/repos`)
  console.log(`  GET  /api/tokens/usage`)
  console.log(`  GET  /api/cron/jobs`)
})

module.exports = app
