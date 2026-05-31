---
title: "02-004: Complete Task with Note"
---

# 02-004: Complete Task with Note

**Goal:** Verify cupt done completes a task and attaches a note in one command.

## Test Procedure (use a non-critical test task)

```bash
TASK_ID="abc123"  # Use a test task!

# Pre-check: verify task exists and its status schema
cupt statuses $TASK_ID
cupt done $TASK_ID --dry-run

# Complete with note
cupt done $TASK_ID --note "Test completion — manual testing playbook 02-004"

# Verify: task should now show closed status
cupt show $TASK_ID --json | jq .status
```

## Expected Behavior

- Task status changes to the list's closed status
- Note appears in task comments (verify in ClickUp UI or `cupt notes $TASK_ID`)

## Warning

Only run this on test tasks. Completing a real task is hard to reverse. Use `--dry-run` first.

## Failure Diagnosis

- Status not changed → cupt done exited without error but task stuck → check `cupt statuses`
- Note missing → Check `cupt notes $TASK_ID` and ClickUp UI
