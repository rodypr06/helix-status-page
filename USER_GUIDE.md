# User Guide - Helix Command Center

Complete guide to using the Helix Command Center - your production-ready control interface for OpenClaw.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Actions Panel](#actions-panel)
4. [Managing Subagents](#managing-subagents)
5. [Task Management](#task-management)
6. [Cron Jobs](#cron-jobs)
7. [Gateway Control](#gateway-control)
8. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### Access the Command Center

**Development:**
```bash
cd /Users/rrabelo/.openclaw/workspace/helix-status-page
./start-dev.sh
```

Visit: `http://localhost:5173`

**Production:**
Build and deploy (see DEPLOYMENT.md)

---

## Dashboard Overview

The dashboard is organized into sections from top to bottom:

### 1. Current Focus
Shows what your main agent is currently working on with real-time status.

### 2. Actions Panel ⚡ (NEW!)
Quick access to common actions - spawn subagents, control gateway, manage tasks.

### 3. Sub-Agents & Work Queue
Side-by-side view of active subagents and pending tasks.

### 4. Task Board 📋 (NEW!)
Kanban-style task management with PENDING_TASKS.md integration.

### 5. Quick Stats
System metrics, token usage, and performance data.

### 6. Change Log
Recent activity and project history.

---

## Actions Panel

The Actions Panel gives you instant control over your system.

### Spawn Subagent 🚀

**Use Case:** When you have a complex task that needs dedicated focus.

1. Enter a clear task description in the text area
2. (Optional) Select a specific model:
   - **Auto** - Let OpenClaw choose (helix-subagent)
   - **helix-main** - Full power for complex reasoning
   - **helix-fast** - Quick, cost-effective responses
   - **helix-coder** - Optimized for coding tasks
   - **helix-researcher** - Best for web research
3. (Optional) Add a label like "api-builder" or "docs-writer"
4. Click **Spawn Subagent**

**Result:** A new subagent appears in the Sub-Agents list within seconds.

**Example Tasks:**
- "Build a REST API for user authentication with Express and JWT"
- "Research best practices for Docker multi-stage builds and create a template"
- "Debug the memory leak in the session manager and fix it"

### Quick Action Buttons

**🔄 Restart Gateway**
- Restarts the OpenClaw Gateway service
- Use when: Gateway becomes unresponsive or after config changes
- **Confirmation required** - This will briefly interrupt all sessions

**⬆️ Update OpenClaw**
- Updates OpenClaw to the latest npm version
- Takes ~30-60 seconds
- **Confirmation required** - Gateway will restart automatically

**✅ Clear Completed**
- Moves completed tasks to archive
- Keeps your task board clean
- Safe to use anytime

**📦 Archive Old**
- Archives sessions older than 7 days
- Reduces clutter in session history
- Archived sessions can still be accessed

**➕ New Task**
- Opens task creation modal
- Quick way to add items to PENDING_TASKS.md
- Syncs with task board immediately

**🗑️ Kill Idle Agents**
- Terminates all idle subagents (inactive >5 min)
- Frees up resources
- **Confirmation required** - Cannot be undone

---

## Managing Subagents

### Viewing Subagents

Each subagent card shows:
- **Label/ID** - Identifier for the subagent
- **Status** - Running (green) or Idle (yellow)
- **Task** - What it was spawned to do
- **Current Work** - What it's working on right now
- **Progress** - Estimated completion (when available)
- **Runtime** - How long it's been active
- **Tokens** - Total tokens consumed
- **Model** - Which AI model it's using

### Expanding Details

Click any subagent card to expand and see:
- Full task description
- Current work details
- Model information
- Last update timestamp
- **Action buttons** (see below)

### Subagent Actions

When expanded, each subagent has three action buttons:

#### 💬 Send Message
Opens a modal where you can send a message to the subagent.

**Use Cases:**
- Give additional instructions: "Also add unit tests"
- Request updates: "What's your progress?"
- Course correct: "Use TypeScript instead of JavaScript"
- Gracefully stop: `/exit`

**Tips:**
- Messages are delivered immediately
- Use `/exit` to gracefully stop a subagent
- Subagent will respond in its session (check openclaw logs)

#### 🗑️ Kill
Immediately terminates the subagent.

**When to use:**
- Subagent is stuck or looping
- Task is no longer needed
- Subagent went off-track

**⚠️ Warning:** This is immediate and cannot be undone. Work may be lost.

**Better alternative:** Send `/exit` message for graceful shutdown.

#### 📋 View Logs
Opens a modal showing the last 10-20 messages from the subagent.

**Useful for:**
- Checking what the subagent accomplished
- Debugging issues
- Understanding current state
- Reviewing before killing

---

## Task Management

The Task Board is a Kanban-style interface synced with PENDING_TASKS.md.

### Task Columns

**🔴 Critical**
High-priority tasks that need immediate attention.

**🟡 Medium**
Important tasks for near-term completion.

**🟢 Backlog**
Future tasks and ideas.

**✅ Completed**
Recently finished tasks (with completion date).

### Creating Tasks

1. Click **➕ New Task** in Actions Panel or Task Board header
2. Fill in:
   - **Title** (required) - Short, descriptive
   - **Description** (optional) - Additional context
   - **Priority** - Critical, Medium, or Backlog
   - **Assign To** - Main Agent, Subagent, or Human
3. Click **Create Task**

**Result:** Task appears in the appropriate column and is added to PENDING_TASKS.md.

### Moving Tasks

Each task card has colored buttons to move between columns:
- 🔴 - Move to Critical
- 🟡 - Move to Medium
- 🟢 - Move to Backlog
- ✅ - Mark Complete

**Shortcuts:**
- Click the appropriate emoji button
- Changes are saved to PENDING_TASKS.md immediately
- Completed tasks get a timestamp

### Deleting Tasks

Click the 🗑️ icon on any task card.

**⚠️ Warning:** Confirmation required. Task is permanently removed from PENDING_TASKS.md.

### Reopening Completed Tasks

Completed tasks show a 🔄 button to reopen them. They'll move back to Medium priority.

---

## Cron Jobs

Manage scheduled tasks directly from the dashboard.

### Viewing Cron Jobs

Each cron job shows:
- **Name** - Human-readable identifier
- **Schedule** - Cron expression (e.g., "0 9 * * *")
- **Status** - Active or Paused
- **Next Run** - When it will execute next

### Cron Actions

#### ⏸️ Pause / ▶️ Resume
Toggle whether the cron job runs on schedule.

**Paused jobs:**
- Will not execute automatically
- Can still be triggered manually
- Retain their schedule

**Use Cases:**
- Temporarily disable a job during maintenance
- Stop a job that's causing issues
- Pause during development/testing

#### ▶️ Run Now
Trigger the cron job immediately, regardless of schedule.

**Use Cases:**
- Test a newly created job
- Force an update outside the schedule
- Debug job behavior

**Note:** Does not affect the next scheduled run.

#### ⚙️ Edit
Opens edit modal (coming soon).

**Current Workaround:**
```bash
openclaw cron edit <job-id>
```

### View Last Run Logs

Click on a cron job card to see execution history (coming soon).

---

## Gateway Control

### Configuration

Access gateway config via the Actions Panel or API:

```bash
curl http://localhost:5175/api/gateway/config
```

**Common settings to modify:**
- `defaultModel` - Which model new sessions use
- `thinkingMode` - Reasoning level (low, high, stream)
- `maxTokens` - Token limit per request
- `temperature` - Creativity level (0.0-1.0)

### Restart Gateway

Use **🔄 Restart Gateway** in Actions Panel when:
- Config changes require restart
- Gateway becomes unresponsive
- After major OpenClaw updates

**⚠️ Note:** All active sessions will be briefly interrupted (~5-10 seconds).

### Update OpenClaw

Use **⬆️ Update OpenClaw** to update to the latest version.

**Process:**
1. Runs `npm update -g openclaw`
2. Takes 30-60 seconds
3. Gateway restarts automatically
4. All sessions resume

**When to update:**
- New features you want to use
- Critical bug fixes
- Security patches

---

## Tips & Best Practices

### Spawning Subagents

**✅ Do:**
- Write clear, specific task descriptions
- Include expected output format
- Mention constraints (time, cost, dependencies)
- Use labels for easy identification

**❌ Don't:**
- Spawn too many at once (resource intensive)
- Give vague tasks like "fix everything"
- Forget to monitor progress
- Let idle agents accumulate

### Task Management

**✅ Do:**
- Keep critical column small (3-5 max)
- Review and archive completed tasks regularly
- Add deadlines in task descriptions
- Break large tasks into smaller ones

**❌ Don't:**
- Let backlog grow indefinitely
- Mark tasks complete without verification
- Create duplicate tasks
- Use tasks as notes (use memory files instead)

### Cron Jobs

**✅ Do:**
- Test with "Run Now" before scheduling
- Pause jobs you're not using
- Use descriptive names
- Document job purpose in OpenClaw

**❌ Don't:**
- Create jobs that run too frequently (<5 min intervals)
- Leave broken jobs active
- Forget to check logs after errors
- Overlap jobs that modify the same data

### Resource Management

**Monitor:**
- Total active subagents (keep under 5)
- Token usage per session
- Memory/CPU via System Metrics

**Optimize:**
- Kill idle agents regularly
- Use helix-fast for simple tasks
- Archive old sessions weekly
- Clear completed tasks

### Keyboard Shortcuts (Future Feature)

Coming soon:
- `Ctrl+K` - Quick spawn subagent
- `Ctrl+N` - New task
- `Ctrl+/` - Search tasks
- `Esc` - Close modals

---

## Troubleshooting

### Actions Not Working

**Symptom:** Button clicks don't do anything or show errors.

**Solutions:**
1. Check API server is running: `http://localhost:5175/health`
2. Restart API server: `cd api && node server.js`
3. Check browser console for errors (F12)
4. Verify OpenClaw is running: `openclaw status`

### Tasks Not Syncing

**Symptom:** Changes to tasks don't appear or aren't saved.

**Solutions:**
1. Check PENDING_TASKS.md exists in workspace root
2. Verify file permissions (should be writable)
3. Refresh page to reload tasks
4. Check API logs: `tail -f /tmp/helix-api.log`

### Subagents Stuck

**Symptom:** Subagent shows "running" but hasn't updated in >10 minutes.

**Solutions:**
1. View logs to see what it's doing
2. Send a message to check if it responds
3. Send `/exit` to gracefully stop
4. Last resort: Kill via 🗑️ button

### Can't Spawn Subagent

**Symptom:** Spawn fails or times out.

**Solutions:**
1. Check OpenClaw gateway: `openclaw gateway status`
2. Verify model exists: `openclaw models list`
3. Check system resources (RAM, CPU)
4. Simplify task description
5. Try different model (helix-fast)

---

## Advanced Usage

### Custom API Calls

All UI actions use the REST API. You can script them:

```bash
# Spawn subagent
curl -X POST http://localhost:5175/api/subagents/spawn \
  -H "Content-Type: application/json" \
  -d '{"task":"Build a CLI tool","model":"helix-coder"}'

# Create task
curl -X POST http://localhost:5175/api/tasks/create \
  -H "Content-Type: application/json" \
  -d '{"title":"Add tests","priority":"medium"}'
```

See API_REFERENCE.md for complete endpoint documentation.

### Integration with External Tools

The Command Center can be integrated with:
- CI/CD pipelines (trigger deploys)
- Monitoring tools (spawn agents on alerts)
- Slack/Discord (receive notifications)
- GitHub Actions (auto-create tasks from issues)

**Example webhook receiver coming soon.**

### Progressive Web App (PWA)

Install as a desktop/mobile app:
1. Visit the dashboard
2. Look for install prompt (or browser menu > Install)
3. Access offline (limited functionality)

**Benefits:**
- Works without browser chrome
- Loads faster
- Push notifications (coming soon)

---

## Keyboard Navigation

(Coming Soon)

Full keyboard control for power users:
- Tab navigation
- Enter to confirm
- Escape to cancel
- Arrow keys for task cards

---

## Mobile Usage

The Command Center is fully responsive:

**Mobile Layout:**
- Stacked columns (no side-by-side)
- Simplified action buttons
- Touch-optimized controls
- Pull-to-refresh

**Limitations:**
- Some modals are smaller
- Logs may be harder to read
- Recommend tablet or desktop for heavy usage

---

## Getting Help

**Check Logs:**
```bash
# API logs
tail -f /tmp/helix-api.log

# OpenClaw logs
openclaw logs

# Specific session
openclaw sessions logs <session-key>
```

**Common Issues:**
See TROUBLESHOOTING section above.

**Report Bugs:**
File an issue or message in Discord/main session.

---

**Last Updated:** 2026-02-09  
**Version:** 1.0.0 (Command Center Release)

**Next Features:**
- Real-time WebSocket updates
- Cost tracking per session
- Undo/redo for task changes
- Keyboard shortcuts
- Export task history
- Session timeline view
