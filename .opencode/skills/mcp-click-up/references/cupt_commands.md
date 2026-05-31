---
title: "cupt CLI Reference"
description: "Complete cupt command reference with flags, --json variants, and critical agent patterns for safe ClickUp task management."
trigger_phrases:
  - "cupt commands"
  - "cupt list"
  - "cupt done"
  - "cupt statuses"
  - "cupt time"
  - "cupt note"
---

# cupt CLI Reference

cupt (ClickUP Terminal) — Python CLI for ClickUp task management, purpose-built for AI agents.

---

## 1. OVERVIEW

cupt provides a terminal interface to ClickUp designed for agent-driven workflows. Every read command supports `--json` for machine-readable output. Completion uses automatic per-list status resolution so agents never need to hardcode status names. The `--offline` flag uses a local cache populated by `cupt prefetch`, enabling operation without network access.

**Key agent advantages over direct API calls:**
- `cupt done` resolves the correct closed status per list automatically
- `--dry-run` on `cupt done` previews without writing
- `--offline` enables cached operation after `cupt prefetch`
- `--json` on all read commands gives structured output

---

## 2. PREREQUISITES

- cupt v0.7.1+ installed: `cupt --version`
- Authenticated: `cupt status` shows workspace name
- For agent use: understand the API naming map below (team_id = workspace in UI)

**Install:** `pipx install cupt` | **Verify:** `cupt --version && cupt status`

---

## 3. API NAMING MAP (cupt vs ClickUp UI)

| cupt terminology | ClickUp UI label | ClickUp API field |
|-----------------|------------------|-------------------|
| Workspace | Workspace | `team_id` |
| Team | Team | `group` |
| List | List | `list_id` |
| Task | Task | `task_id` |

> cupt follows UI terminology, shielding agents from API naming quirks.

---

## 4. AUTHENTICATION & STATUS

| Command | Description | Example |
|---------|-------------|---------|
| `cupt auth` | Interactive authentication wizard | `cupt auth` |
| `cupt logout` | Clear stored credentials | `cupt logout` |
| `cupt status` | Show auth status + workspace info | `cupt status` |
| `cupt config --api-token <token>` | Set Personal API Token directly | `cupt config --api-token pk_xxx` |
| `cupt config --workspace-id <id>` | Set default workspace | `cupt config --workspace-id 123` |
| `cupt config --default-list <id>` | Set default list | `cupt config --default-list 456` |
| `cupt config --show` | Display current configuration | `cupt config --show` |
| `cupt config --clear-cache` | Clear persistent data cache | `cupt config --clear-cache` |

**Agent pattern:** Always run `cupt status` as preflight to confirm auth is active before starting a task workflow.

---

## 5. TASK LISTING

| Command | Description | Flags |
|---------|-------------|-------|
| `cupt list` | List assigned tasks | |
| `cupt list --today` | Tasks due today | |
| `cupt list --week` | Tasks due this week | |
| `cupt list --overdue` | Overdue tasks | |
| `cupt list --tag <name>` | Filter by tag (server-side, fast) | |
| `cupt list --team <name>` | Filter by team (client-side, slow) | |
| `cupt list --mine` | Only self-assigned tasks | |
| `cupt list --all` | All tasks including team | |
| `cupt list --json` | JSON output for agents | |
| `cupt list --offline` | Use cached data | |

**Combining filters:**
```bash
cupt list --tag ai_ready --json            # Fast: server-side tag filter
cupt list --all --tag sprint --json        # All team tasks with tag
cupt list --team "Engineering" --tag urgent # Combine (slow due to client-side team)
```

**JSON output structure:**
```json
[
  {
    "id": "abc123",
    "name": "Task name",
    "status": { "status": "in progress" },
    "due_date": "1234567890000",
    "tags": [{"name": "ai_ready"}],
    "assignees": [...]
  }
]
```

**Performance notes:**
- Tag filters: server-side (fast, recommended)
- Team filters: client-side — walks all pages, can take 5-20s on large workspaces
- Combine `--tag X --team Y` to reduce client-side walking

---

## 6. TASK DETAILS

| Command | Description | Flags |
|---------|-------------|-------|
| `cupt show <id>` | Full task details | |
| `cupt show <id> --notes` | Include all comments | |
| `cupt show <id> --json` | JSON output | |
| `cupt show <id> --offline` | Use cached data | |
| `cupt context <id>` | Parent + siblings + subtasks | |
| `cupt statuses <id>` | Status schema for task's list | |

**`cupt statuses <id>` output example:**
```
Statuses for list "Sprint Board":
  - to do
  - in progress
  - in review
  - done  ← closed status (this is what cupt done resolves to)
```

> **CRITICAL:** Each ClickUp list has its own status schema. The "closed" status may be named "Done", "Complete", "Closed", "Shipped", etc. Always call `cupt statuses <id>` BEFORE completing a task.

---

## 7. TASK COMPLETION

| Command | Description |
|---------|-------------|
| `cupt done <id>` | Mark task complete (auto-resolves list's closed status) |
| `cupt done <id> --dry-run` | Preview resolved status — no write |
| `cupt done <id> --note "<text>"` | Mark complete with note |

**Dry-run output:**
```
DRY RUN: Task "Fix login bug" (abc123)
  List: Sprint Board
  Resolved status: "done"
  [No changes made]
```

**Safe batch completion loop:**
```bash
# Process tagged queue safely
TASK_IDS=$(cupt list --tag ai_ready --json | jq -r '.[].id')

# Dry-run entire batch first
for id in $TASK_IDS; do
  cupt done "$id" --dry-run
done

# If all dry-runs look correct, complete for real
for id in $TASK_IDS; do
  cupt done "$id" --note "Processed by AI agent $(date -u +%Y-%m-%dT%H:%M:%SZ)"
done
```

---

## 8. NOTES & COMMENTS

| Command | Description |
|---------|-------------|
| `cupt note <id> "<text>"` | Add comment to task |
| `cupt notes <id>` | List all comments on task |

**Agent handoff pattern:**
```bash
# Remove processing tag, add review tag, leave note
cupt tag remove TASK_ID ai_ready
cupt tag add TASK_ID needs_review
cupt note TASK_ID "AI processing complete. Output: [summary]. Handing off for human review."
```

---

## 9. TIME TRACKING

| Command | Description | Example |
|---------|-------------|---------|
| `cupt time start <id>` | Start timer on task | `cupt time start abc123` |
| `cupt time stop` | Stop running timer | `cupt time stop` |
| `cupt time add <id> <duration>` | Log time manually | `cupt time add abc123 1h30m` |
| `cupt time status` | Show current timer state | `cupt time status` |

**Duration formats:** `1h30m`, `45m`, `2h`, `30m`

**Timer workflow:**
```bash
cupt time start TASK_ID    # Start work
# ... do work ...
cupt time stop             # Stop and log automatically
cupt time status           # Verify no orphaned timer
```

---

## 10. TAGS

| Command | Description |
|---------|-------------|
| `cupt tag add <id> <name>` | Add tag to task |
| `cupt tag remove <id> <name>` | Remove tag from task |

**Tag-based queue pattern:**
```bash
# Agent picks up tasks with ai_ready tag
cupt list --tag ai_ready --json

# After processing: remove processing tag, add review tag
cupt tag remove TASK_ID ai_ready
cupt tag add TASK_ID needs_review
```

---

## 11. ATTACHMENTS

| Command | Description |
|---------|-------------|
| `cupt attach list <id>` | List task attachments |
| `cupt attach add <id> <file>` | Upload file to task |
| `cupt attach get <id> <selector>` | Download attachment by index or name |

---

## 12. WORKSPACE

| Command | Description |
|---------|-------------|
| `cupt teams` | List teams (user-groups) in workspace |
| `cupt summary` | Task summary/overview |
| `cupt prefetch` | Pre-cache tasks for offline use |

---

## 13. GLOBAL FLAGS

| Flag | Applies To | Description |
|------|-----------|-------------|
| `--json` | All read commands | Machine-readable JSON output |
| `--offline` | list, show | Use locally cached data |
| `--debug` | All | Enable debug logging |
| `--version` | — | Print cupt version |

---

## 14. AGENT INVARIANTS (MUST FOLLOW)

### 1. Status Resolution

```bash
# WRONG — hardcoded status name:
# This fails silently if the list uses "Complete" not "Done"
cupt done TASK_ID   # ← cupt auto-resolves, but VERIFY first

# RIGHT — always check first:
cupt statuses TASK_ID   # See what the closed status actually is
cupt done TASK_ID --dry-run  # Confirm resolution
cupt done TASK_ID           # Then execute
```

### 2. Empty Queue Handling

```bash
# Empty result is VALID — not an error
result=$(cupt list --tag ai_ready --json)
count=$(echo "$result" | jq length)

if [[ "$count" -eq 0 ]]; then
  echo "Queue empty. No tasks to process."
  # Before escalating: check tag spelling, try --all, verify team names
  cupt teams   # Verify team names are correct
  cupt list --all --tag ai_ready --json  # Try wider scope
  exit 0
fi
```

### 3. Per-Task Status in Loops

```bash
# WRONG — reusing status across tasks:
STATUS=$(cupt statuses FIRST_TASK_ID | grep closed | ...)
for id in $TASK_IDS; do
  cupt done "$id" --status "$STATUS"  # DON'T DO THIS
done

# RIGHT — resolve per task:
for id in $TASK_IDS; do
  cupt done "$id" --dry-run   # cupt resolves per-task automatically
done
for id in $TASK_IDS; do
  cupt done "$id"
done
```

### 4. Inspect Before Acting

```bash
cupt show TASK_ID --notes --json   # Read task + comments
cupt context TASK_ID               # Check parent/siblings
cupt statuses TASK_ID              # Check status schema
# THEN act:
cupt done TASK_ID --dry-run
cupt done TASK_ID
```

---

## 15. CONFIGURATION STORAGE

- Config file: `~/.cupt/config.yaml`
- Cache: `~/.cupt/cache/` (encrypted with cryptography library)
- Token: stored encrypted in config (never logged)
