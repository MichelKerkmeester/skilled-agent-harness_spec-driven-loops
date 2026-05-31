---
title: "05-003: Status Resolution Error"
---

# 05-003: Status Resolution Error and Recovery

**Goal:** Verify handling when a task's list has no closed status defined.

## Test Context

This error occurs when a ClickUp list has no status marked as "closed type" — rare but possible.

## Reproduction

```bash
TASK_ID="abc123"  # Task in a list with unusual status config

# Check the status schema first
cupt statuses $TASK_ID

# Attempt dry-run
cupt done $TASK_ID --dry-run
```

## Expected Error Output

```
Error: No closed status found for list "Project Board".
Use 'cupt statuses <task_id>' to see available statuses.
```

## Recovery

Option A — Fix in ClickUp UI:
1. Open ClickUp → List settings → Statuses
2. Mark one status as "closed" type
3. Re-run `cupt done $TASK_ID`

Option B — Use MCP to set explicit status:
```typescript
await call_tool_chain([{
  tool: "clickup.clickup_update_task",
  input: {
    task_id: TASK_ID,
    status: "complete"  // use the exact status name from cupt statuses output
  }
}]);
```

## Prevention

Always run `cupt statuses <id>` before `cupt done` to confirm a closed status exists.
