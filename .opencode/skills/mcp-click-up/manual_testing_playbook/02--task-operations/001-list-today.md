---
title: "02-001: List Tasks"
---

# 02-001: List Tasks with Filters

**Goal:** Verify cupt list with various filters returns correct task data.

## Test Procedure

```bash
# Basic list (assigned tasks)
cupt list --json

# Date filters
cupt list --today --json
cupt list --week --json
cupt list --overdue --json

# Tag filter (server-side, fast)
cupt list --tag ai_ready --json

# Team filter (client-side, may be slow)
cupt list --team "Engineering" --json

# Combined (most efficient)
cupt list --all --tag sprint --json
```

## Expected Output

JSON array of tasks, or `[]` for empty (both valid):

```json
[
  {
    "id": "abc123",
    "name": "Implement feature X",
    "status": { "status": "in progress" },
    "tags": [{"name": "ai_ready"}]
  }
]
```

## Notes

- Empty `[]` is valid — not an error
- Team filter is client-side: may take 5-20s on large workspaces
- Combine `--tag X --team Y` to speed up team-filtered queries

## Failure Diagnosis

- JSON parse error → Check cupt version: `cupt --version`
- Very slow → Team filter is client-side; add `--tag X` to narrow
- Empty when tasks exist → Check tag spelling, try `--all`
