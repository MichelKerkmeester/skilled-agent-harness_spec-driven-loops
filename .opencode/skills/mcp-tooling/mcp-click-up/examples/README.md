---
title: "mcp-click-up - Example Scripts"
description: "Production-ready bash scripts for ClickUp task management and time tracking using cupt CLI"
trigger_phrases:
  - "clickup examples"
  - "cupt example scripts"
  - "task queue workflow"
  - "time tracking script"
---

# mcp-click-up - Example Scripts

> Production-ready bash scripts for ClickUp task management and time tracking using `cupt` CLI.

---

- 3.1 [task-queue-workflow.sh](#31-task-queue-workflowsh)
- 3.2 [time-tracking-workflow.sh](#32-time-tracking-workflowsh)

---

## 1. OVERVIEW

This directory contains production-ready bash scripts demonstrating practical ClickUp agent workflows using the cupt CLI tool. Both scripts are designed for safe, automated operation: they validate preconditions, use dry-run before writes, handle empty queues gracefully, and clean up on exit.

### Key Features

**Task Queue Processing**
- Fetches tagged work queues with `--json` for reliable parsing
- Discovers per-list status schemas before completing tasks
- Dry-runs every completion before writing
- Handoff pattern: removes processing tag, adds review tag, leaves note

**Time Tracking**
- Full timer lifecycle: start, status check, stop
- Manual time logging with duration validation (`1h30m`, `45m`, `2h`)
- Orphaned timer detection and cleanup on exit

**Agent Safety**
- `set -euo pipefail` — exits immediately on any error
- `trap cleanup EXIT INT TERM` — no orphaned timers or partial state
- `--json` on all cupt reads — never parses human-readable output
- Empty queue treated as valid — never fabricates tasks

---

## 2. PREREQUISITES

```bash
# Install cupt CLI
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh

# Verify installation and authentication
cupt --version   # → cupt 0.7.1
cupt status      # → workspace name + user

# Required tools for JSON parsing
command -v jq >/dev/null || echo "Install jq for JSON parsing"
```

**Required env:**
- `cupt` authenticated (`cupt status` succeeds)
- A ClickUp workspace with tasks tagged `ai_ready` (or custom tag) for queue workflow
- A task ID for time-tracking workflow

---

## 3. AVAILABLE SCRIPTS

### 3.1 task-queue-workflow.sh

**Purpose:** Process a tagged ClickUp work queue end-to-end — the primary AI agent pattern.

**Usage:**
```bash
# Process default tag "ai_ready"
bash examples/task-queue-workflow.sh

# Process custom tag
bash examples/task-queue-workflow.sh --tag sprint_ready

# Dry-run only (preview without completing)
bash examples/task-queue-workflow.sh --dry-run

# Custom tag + dry-run
bash examples/task-queue-workflow.sh --tag urgent --dry-run
```

**What it does:**
1. Runs preflight: verifies `cupt` is installed and authenticated
2. Fetches tasks with the specified tag using `cupt list --tag X --all --json`
3. Exits cleanly with a clear message if the queue is empty — never fabricates tasks
4. For each task: inspects via `cupt show --notes --json` and `cupt context`
5. Discovers the list's status schema via `cupt statuses <id>`
6. Dry-runs completion for every task in the batch
7. Prompts for confirmation before writing (skipped with `--dry-run`)
8. Completes each task with `cupt done <id> --note "Processed by AI agent"`
9. Handoff: removes processing tag, adds `needs_review`, leaves a note

**Output:**
```
══════════════════════════════════════════
 Task Queue Workflow
 Tag: ai_ready | Dry-run: false
══════════════════════════════════════════
[task-queue] → Running preflight checks...
[task-queue] ✓ Authenticated and connected
[task-queue] → Fetching tasks tagged: ai_ready
[task-queue] → Found 3 task(s) in queue

=== Phase 1: Inspect all tasks ===
...
=== Phase 2: Dry-run all completions ===
...
=== Phase 3: Complete and hand off ===
...
══════════════════════════════════════════
 Summary
 Completed: 3 | Failed: 0
══════════════════════════════════════════
```

**Exit codes:**
- `0` — All tasks completed (or queue was empty)
- `1` — Preflight failed (cupt not found or not authenticated)

**Use cases:**
- Automated AI agent work queues
- Sprint task processing pipelines
- Batch completion with human handoff

---

### 3.2 time-tracking-workflow.sh

**Purpose:** Timer lifecycle management — start, status, stop, and manual logging.

**Usage:**
```bash
# Start timer on a specific task
bash examples/time-tracking-workflow.sh start TASK_ID

# Stop the running timer
bash examples/time-tracking-workflow.sh stop

# Log time manually (no timer needed)
bash examples/time-tracking-workflow.sh log TASK_ID 1h30m

# Check current timer state
bash examples/time-tracking-workflow.sh status
```

**Subcommands:**

| Subcommand | Args | Description |
|------------|------|-------------|
| `start` | `TASK_ID` | Start timer; fails if one is already running |
| `stop` | — | Stop current timer and log elapsed time |
| `log` | `TASK_ID DURATION` | Log time retroactively (`1h30m`, `45m`, `2h`) |
| `status` | — | Show running timer or "no timer running" |

**Exit codes:**
- `0` — Command succeeded
- `1` — cupt not installed, not authenticated, invalid args, or timer conflict

**Use cases:**
- Automated time tracking in agent workflows
- Logging time after completing tasks via script
- Verifying no orphaned timer before starting a new session

---

## 4. COMMON PATTERNS

### Full Agent Workflow (Queue → Time → Handoff)

```bash
#!/bin/bash
# End-to-end agent session: track time, process queue, log, hand off

TASK_ID="abc123"

# 1. Start timing the session
bash examples/time-tracking-workflow.sh start "$TASK_ID"

# 2. Process the work queue
bash examples/task-queue-workflow.sh --tag ai_ready

# 3. Stop timer and log automatically
bash examples/time-tracking-workflow.sh stop

# 4. Verify clean state
bash examples/time-tracking-workflow.sh status  # → "No timer running"
```

### Dry-Run Before Production Run

```bash
# Preview what would be completed
bash examples/task-queue-workflow.sh --tag sprint_ready --dry-run

# If dry-run output looks correct, run for real
bash examples/task-queue-workflow.sh --tag sprint_ready
```

### Manual Time Log After Untracked Work

```bash
# Log 45 minutes on a task done without a timer
bash examples/time-tracking-workflow.sh log TASK_ID 45m

# Log 2 hours
bash examples/time-tracking-workflow.sh log TASK_ID 2h

# Log 1.5 hours
bash examples/time-tracking-workflow.sh log TASK_ID 1h30m
```

---

## 5. CUSTOMIZATION TIPS

### Change the Processing Tag

Edit `task-queue-workflow.sh` to change the default tag:

```bash
# Line ~9 in task-queue-workflow.sh
PROCESSING_TAG="${1:-ai_ready}"   # Change "ai_ready" to your tag
REVIEW_TAG="needs_review"         # Change "needs_review" to your handoff tag
```

### Change the Completion Note

```bash
# Line ~11 in task-queue-workflow.sh
AGENT_NOTE="Processed by AI agent"   # Customize the note text
```

### Skip the Confirmation Prompt

Pass `--dry-run` first to verify, then re-run without it and pipe `yes` to skip the prompt:

```bash
yes | bash examples/task-queue-workflow.sh --tag ai_ready
```

### Adjust Timer Check Frequency

The `status` subcommand is stateless — run it as frequently as needed:

```bash
# Check every 30 seconds in a loop
while true; do
  bash examples/time-tracking-workflow.sh status
  sleep 30
done
```

---

## 6. TROUBLESHOOTING

### task-queue-workflow.sh: "cupt not installed"

```bash
# Install cupt
bash .opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh

# Verify
cupt --version   # → cupt 0.7.1
```

### task-queue-workflow.sh: "authentication failed"

```bash
cupt auth
# OR:
cupt config --api-token pk_YOUR_TOKEN
cupt status   # Verify
```

### task-queue-workflow.sh: queue is empty

```bash
# Verify tag spelling (case-sensitive)
cupt list --all --json | jq '[.[].tags[].name] | unique'

# Try broader scope
cupt list --all --json | jq length

# Verify team names
cupt teams
```

### time-tracking-workflow.sh: "A timer is already running"

```bash
# Check current timer
bash examples/time-tracking-workflow.sh status

# Stop the orphaned timer first
bash examples/time-tracking-workflow.sh stop

# Then start on the correct task
bash examples/time-tracking-workflow.sh start TASK_ID
```

### JSON parsing error (jq not found)

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq
```

---

## 7. SEE ALSO

### Skill Documentation

**mcp-click-up:**
- `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md` — Routing rules and agent invariants
- `.opencode/skills/mcp-tooling/mcp-click-up/references/install_guide.md` — Install and authentication
- `.opencode/skills/mcp-tooling/mcp-click-up/references/cupt_commands.md` — Full cupt command reference

### Related References

- `cupt_commands.md §7. TASK COMPLETION` — dry-run and status resolution rules
- `cupt_commands.md §14. AGENT INVARIANTS` — safety patterns these scripts implement
- `troubleshooting.md §7. TEAM FILTER PERFORMANCE` — why `--tag` is preferred over `--team`

### External

- [cupt on GitHub](https://github.com/newz2000/cupt) — source, changelog, issues
- [cupt on PyPI](https://pypi.org/project/cupt/) — install and version history
- [ClickUp API Tokens](https://app.clickup.com/settings/apps) — generate `pk_` token

---

## 8. CONTRIBUTING

To add new example scripts:

1. Follow the existing pattern: `set -euo pipefail`, trap cleanup, preflight check, `--json` on reads
2. Make the script executable: `chmod +x examples/your-script.sh`
3. Add a `--help` / `-h` usage block at the top
4. Update this README with purpose, usage, what it does, and exit codes
5. Reference the relevant cupt invariants from `references/cupt_commands.md §14`

---

**Directory Version**: 1.0.0
**Last Updated**: 2026-05-31
**Maintained By**: AI Documentation
