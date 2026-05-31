---
title: "05-002: Empty Queue Handling"
---

# 05-002: Empty Queue Handling

**Goal:** Verify `cupt list` with no matching tasks returns `[]` and does not error.

## Test Procedure

```bash
# Query a tag that definitely has no tasks
cupt list --tag nonexistent_tag_xyz_123 --json
```

## Expected Output

```json
[]
```

Exit code: 0 (not an error)

## Agent Behavior

Empty results are VALID. An AI agent should:
1. Check tag spelling: `cupt list --all --json | jq '.[].tags[].name' | sort -u`
2. Try wider scope: `cupt list --all --json`
3. Report "Queue is empty" — do NOT fabricate tasks

## Failure Diagnosis

- Non-zero exit on empty result → This is a cupt bug; report to github.com/newz2000/cupt
- Treating `[]` as an error → Fix agent logic to handle empty arrays
