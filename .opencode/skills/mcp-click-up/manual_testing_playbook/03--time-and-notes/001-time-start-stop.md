---
title: "03-001: Time Start and Stop"
---

# 03-001: Time Start and Stop

**Goal:** Verify timer starts, tracks, and stops correctly.

## Test Procedure

```bash
TASK_ID="abc123"

# Start timer
cupt time start $TASK_ID

# Check status
cupt time status

# Wait a few seconds, then stop
cupt time stop

# Verify final status
cupt time status
```

## Expected Output (time status while running)

```
Timer running on: Task Name (abc123)
Elapsed: 00:00:15
```

## Expected Output (after stop)

```
No timer running.
Last logged: 15s on Task Name
```

## Failure Diagnosis

- `already running` → Stop first: `cupt time stop`
- Timer doesn't appear in ClickUp → May need workspace-level time tracking enabled
