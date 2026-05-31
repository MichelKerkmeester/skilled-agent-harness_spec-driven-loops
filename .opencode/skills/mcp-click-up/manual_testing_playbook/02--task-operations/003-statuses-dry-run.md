---
title: "02-003: Status Discovery and Dry-Run"
---

# 02-003: Status Discovery and Dry-Run Completion

**Goal:** Verify cupt statuses discovers list-specific schema and dry-run previews correctly.

## Test Procedure

```bash
TASK_ID="abc123"

# Step 1: Discover status schema for this task's list
cupt statuses $TASK_ID

# Step 2: Dry-run completion (no write)
cupt done $TASK_ID --dry-run
```

## Expected Output (cupt statuses)

```
Statuses for list "Sprint Board":
  - to do
  - in progress
  - in review
  - done   ← cupt will use this as the closed status
```

## Expected Output (dry-run)

```
DRY RUN: Task "Fix login bug" (abc123)
  List: Sprint Board
  Resolved status: "done"
  [No changes made]
```

## Why This Matters

Each ClickUp list has its own status schema. NEVER hardcode status names across lists — "Done" in one list may not exist in another. Always use `cupt statuses <id>` to discover the correct status before completing.

## Failure Diagnosis

- `No closed status found` → The list has no status marked as "closed type" in ClickUp settings
- Dry-run shows wrong status → Use `cupt statuses` to verify and check ClickUp list settings
