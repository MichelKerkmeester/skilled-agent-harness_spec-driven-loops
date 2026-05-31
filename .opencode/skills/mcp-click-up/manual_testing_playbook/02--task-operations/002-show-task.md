---
title: "02-002: Show Task Details"
---

# 02-002: Show Task Details and Context

**Goal:** Verify cupt show returns full task details and cupt context returns hierarchy.

## Test Procedure

```bash
# Replace TASK_ID with a real task ID
TASK_ID="abc123"

# Basic task details
cupt show $TASK_ID

# With comments
cupt show $TASK_ID --notes

# JSON output for agents
cupt show $TASK_ID --json

# Parent + siblings + subtasks
cupt context $TASK_ID
```

## Expected Output (show --json)

```json
{
  "id": "abc123",
  "name": "Task name",
  "description": "Task description...",
  "status": { "status": "in progress" },
  "assignees": [...],
  "tags": [...],
  "due_date": "1234567890000"
}
```

## Failure Diagnosis

- `Task not found` → Verify task ID is correct (copy from ClickUp URL or cupt list)
- `403 Forbidden` → Task may be in a space you don't have access to
- `--offline` fails → Run `cupt prefetch` first to populate cache
