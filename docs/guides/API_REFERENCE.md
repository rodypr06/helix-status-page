# API Reference - Helix Command Center

Complete API documentation for the Helix Command Center backend.

**Base URL:** `http://localhost:5175/api` (development)  
**Production:** Configure via `VITE_API_URL` environment variable

---

## Table of Contents

- [Health & Status](#health--status)
- [Session Management](#session-management)
- [Subagent Control](#subagent-control)
- [Cron Job Management](#cron-job-management)
- [Task Management](#task-management)
- [Gateway Control](#gateway-control)
- [Data Retrieval](#data-retrieval)

---

## Health & Status

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

---

## Session Management

### POST /api/sessions/:key/send

Send a message to any OpenClaw session.

**Parameters:**
- `key` (path) - Session key (e.g., `agent:main:main`)

**Body:**
```json
{
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "output": "Message delivered",
  "message": "Message sent successfully"
}
```

---

### POST /api/sessions/:key/kill

Terminate a session.

**Parameters:**
- `key` (path) - Session key

**Response:**
```json
{
  "success": true,
  "message": "Session terminated successfully"
}
```

---

### PUT /api/sessions/:key/model

Change the model for a session.

**Parameters:**
- `key` (path) - Session key

**Body:**
```json
{
  "model": "helix-main"
}
```

**Response:**
```json
{
  "success": true,
  "output": "...",
  "message": "Model changed to helix-main"
}
```

---

## Subagent Control

### GET /api/subagents

Get list of all subagents (active and retired).

**Response:**
```json
{
  "subagents": [
    {
      "id": "4abfae92-221b-41a6-831e-15bce518b4d2",
      "key": "agent:main:subagent:4abfae92-221b-41a6-831e-15bce518b4d2",
      "label": "4abfae92",
      "status": "running",
      "model": "helix-subagent",
      "runtime": "15m",
      "tokens": 12450,
      "lastUpdated": "2026-02-09T12:00:00.000Z",
      "task": "Build production-ready command center...",
      "currentWork": "Implementing action endpoints",
      "progress": "Phase 1: 50%"
    }
  ],
  "retired": []
}
```

---

### GET /api/subagents/:id

Get detailed information about a specific subagent.

**Parameters:**
- `id` (path) - Subagent UUID

**Response:**
```json
{
  "id": "4abfae92-221b-41a6-831e-15bce518b4d2",
  "key": "agent:main:subagent:4abfae92-221b-41a6-831e-15bce518b4d2",
  "label": "4abfae92",
  "status": "running",
  "model": "helix-subagent",
  "runtime": "15m",
  "tokens": 12450,
  "lastAction": {
    "role": "assistant",
    "content": "Creating ActionsPanel component...",
    "timestamp": "2026-02-09T12:00:00.000Z"
  },
  "history": [...]
}
```

---

### POST /api/subagents/spawn

Spawn a new subagent with a custom task.

**Body:**
```json
{
  "task": "Build a production-ready dashboard",
  "model": "helix-main",
  "label": "dashboard-builder"
}
```

**Fields:**
- `task` (required) - Task description for the subagent
- `model` (optional) - Model to use (defaults to helix-subagent)
- `label` (optional) - Human-readable label for the subagent

**Response:**
```json
{
  "success": true,
  "output": "Spawned subagent with key agent:main:subagent:...",
  "subagentId": "4abfae92-221b-41a6-831e-15bce518b4d2",
  "message": "Subagent spawned successfully"
}
```

---

### POST /api/subagents/:id/kill

Terminate a subagent.

**Parameters:**
- `id` (path) - Subagent UUID

**Response:**
```json
{
  "success": true,
  "message": "Subagent terminated successfully"
}
```

---

### POST /api/subagents/:id/send

Send a message to a specific subagent.

**Parameters:**
- `id` (path) - Subagent UUID

**Body:**
```json
{
  "message": "Please add error handling to the API"
}
```

**Response:**
```json
{
  "success": true,
  "output": "Message delivered",
  "message": "Message sent successfully"
}
```

---

## Cron Job Management

### POST /api/cron/:id/pause

Pause a cron job.

**Parameters:**
- `id` (path) - Cron job ID

**Response:**
```json
{
  "success": true,
  "output": "...",
  "message": "Cron job paused successfully"
}
```

---

### POST /api/cron/:id/resume

Resume a paused cron job.

**Parameters:**
- `id` (path) - Cron job ID

**Response:**
```json
{
  "success": true,
  "output": "...",
  "message": "Cron job resumed successfully"
}
```

---

### POST /api/cron/:id/run

Trigger a cron job to run immediately.

**Parameters:**
- `id` (path) - Cron job ID

**Response:**
```json
{
  "success": true,
  "output": "...",
  "message": "Cron job triggered successfully"
}
```

---

## Task Management

### GET /api/tasks

Get all tasks from PENDING_TASKS.md with full details.

**Response:**
```json
{
  "tasks": [
    {
      "id": "helix-command-center",
      "title": "Helix Command Center",
      "description": "Transform status dashboard into full command center...",
      "status": "critical",
      "assignedTo": "main",
      "deadline": "2026-02-10",
      "completedDate": null,
      "tags": ["production", "ui"]
    }
  ]
}
```

**Status values:** `critical`, `medium`, `backlog`, `completed`

---

### POST /api/tasks/create

Create a new task in PENDING_TASKS.md.

**Body:**
```json
{
  "title": "Add WebSocket support",
  "description": "Real-time updates via Gateway WebSocket connection",
  "priority": "medium",
  "assignedTo": "subagent"
}
```

**Fields:**
- `title` (required) - Task title
- `description` (optional) - Task description
- `priority` (optional) - Priority level: `critical`, `medium`, `backlog`
- `assignedTo` (optional) - Who should handle it: `main`, `subagent`, `human`

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": { ... }
}
```

---

### PUT /api/tasks/:id/status

Update task status (move between columns in Kanban).

**Parameters:**
- `id` (path) - Task ID (slugified title)

**Body:**
```json
{
  "status": "completed"
}
```

**Status values:** `critical`, `medium`, `backlog`, `completed`

**Response:**
```json
{
  "success": true,
  "message": "Task status updated successfully"
}
```

---

### DELETE /api/tasks/:id

Delete a task from PENDING_TASKS.md.

**Parameters:**
- `id` (path) - Task ID (slugified title)

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Gateway Control

### POST /api/gateway/restart

Restart the OpenClaw Gateway.

**Response:**
```json
{
  "success": true,
  "output": "Gateway restarting...",
  "message": "Gateway restart initiated"
}
```

---

### POST /api/gateway/update

Update OpenClaw to the latest version.

**Response:**
```json
{
  "success": true,
  "output": "npm output...",
  "message": "OpenClaw updated successfully"
}
```

---

### GET /api/gateway/config

Get current gateway configuration.

**Response:**
```json
{
  "config": {
    "defaultModel": "helix-main",
    "thinkingMode": "low",
    ...
  }
}
```

---

### POST /api/gateway/config

Update gateway configuration.

**Body:**
```json
{
  "config": {
    "defaultModel": "helix-fast",
    "thinkingMode": "stream"
  }
}
```

**Response:**
```json
{
  "success": true,
  "config": { ... },
  "message": "Gateway config updated successfully"
}
```

---

## Data Retrieval

### GET /api/main-session

Get main session status and current focus.

**Response:**
```json
{
  "status": "active",
  "currentFocus": "Building command center",
  "lastAction": {
    "timestamp": "2026-02-09T12:00:00.000Z",
    "content": "Spawned subagent for command center build"
  },
  "model": "helix-main",
  "uptime": "3h",
  "activeSubagents": 2,
  "lastUpdated": "2026-02-09T12:00:00.000Z"
}
```

---

### GET /api/projects

Get all projects from PROJECT_STATUS.md.

**Response:**
```json
{
  "projects": [
    {
      "id": "helix-command-center",
      "name": "Helix Command Center",
      "status": "in-progress",
      "progress": 75,
      "lastUpdated": "2026-02-09T12:00:00.000Z",
      "description": "Production-ready control interface..."
    }
  ]
}
```

---

### GET /api/queue

Get pending tasks queue from PENDING_TASKS.md.

**Response:**
```json
{
  "queue": {
    "critical": [...],
    "medium": [...],
    "backlog": [...]
  }
}
```

---

### GET /api/history

Get structured history from memory files.

**Query Parameters:**
- `limit` (optional) - Maximum number of entries (default: 50)

**Response:**
```json
{
  "history": [
    {
      "timestamp": "2026-02-09T12:00:00.000Z",
      "type": "project",
      "title": "Completed: Helix Status Page",
      "description": "Launched production dashboard...",
      "metadata": {
        "sourceFile": "memory/2026-02-09.md",
        "section": "completed"
      }
    }
  ]
}
```

**Event types:** `project`, `deployment`, `error`, `lesson`, `subagent_spawn`, `completion`, `info`

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Recommended for production:
- 100 requests per minute per IP for read endpoints
- 20 requests per minute per IP for write/action endpoints

---

## Authentication

Currently no authentication is required (local development).  
For production deployment, consider adding:
- API key authentication
- JWT tokens
- IP whitelist
- Basic HTTP auth

---

## WebSocket Support (Future)

Gateway WebSocket connection at `ws://127.0.0.1:18789` for real-time updates.  
Coming soon: SSE or Socket.io integration for live event streaming to frontend.

---

## Testing

Test endpoints with curl:

```bash
# Health check
curl http://localhost:5175/health

# Get subagents
curl http://localhost:5175/api/subagents

# Spawn subagent
curl -X POST http://localhost:5175/api/subagents/spawn \
  -H "Content-Type: application/json" \
  -d '{"task":"Test task","model":"helix-fast"}'

# Get tasks
curl http://localhost:5175/api/tasks

# Create task
curl -X POST http://localhost:5175/api/tasks/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","priority":"medium"}'
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Session keys follow pattern: `agent:main:subagent:{uuid}`
- Task IDs are slugified titles (lowercase, hyphens)
- File-based data (PENDING_TASKS.md) is parsed and written directly
- OpenClaw CLI is used for most actions (not native API calls)

---

**Last Updated:** 2026-02-09  
**Version:** 1.0.0 (Command Center Release)
