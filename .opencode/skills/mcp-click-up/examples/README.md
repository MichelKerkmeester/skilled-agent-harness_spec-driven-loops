---
title: "mcp-click-up Examples"
description: "Production-ready shell script examples for common ClickUp agent workflows using cupt CLI."
---

# mcp-click-up Examples

Production-ready shell scripts demonstrating common AI agent workflows using cupt CLI.

---

## Prerequisites

Before running any example:

```bash
cupt --version   # Verify cupt is installed
cupt status      # Verify authentication
cupt teams       # Note your team names
```

---

## Available Scripts

### task-queue-workflow.sh

**Purpose:** Process a tagged work queue end-to-end — the primary AI agent pattern for ClickUp.

**Usage:**
```bash
# Process default tag "ai_ready"
bash examples/task-queue-workflow.sh

# Process custom tag
bash examples/task-queue-workflow.sh --tag sprint_ready

# Dry-run only (preview without completing)
bash examples/task-queue-workflow.sh --dry-run
```

**What it does:**
1. Fetches tasks with the specified tag as JSON
2. Inspects each task (show + context)
3. Discovers the list's status schema (cupt statuses)
4. Dry-runs completion for each task
5. Completes tasks and adds a note
6. Removes processing tag, adds review tag
7. Exits cleanly if queue is empty

**Use cases:**
- Automated task processing pipelines
- AI agent work queues
- Sprint automation

---

### time-tracking-workflow.sh

**Purpose:** Timer management — start, work, stop, verify. Includes manual time logging.

**Usage:**
```bash
# Start timer on a task
bash examples/time-tracking-workflow.sh start TASK_ID

# Stop current timer
bash examples/time-tracking-workflow.sh stop

# Log time manually
bash examples/time-tracking-workflow.sh log TASK_ID 1h30m

# Check current timer status
bash examples/time-tracking-workflow.sh status
```

**Use cases:**
- Automated time tracking in agent workflows
- Time logging for completed tasks
- Timer state verification

---

## Key Patterns Used

All examples implement:

- `set -euo pipefail` — fail fast on any error
- `trap cleanup EXIT INT TERM` — cleanup on exit
- `--json` flag for all cupt reads — machine-readable output
- Dry-run before completion — safe batch patterns
- Per-task status discovery — `cupt statuses <id>` before `cupt done`
- Empty queue handling — exits gracefully with clear message
