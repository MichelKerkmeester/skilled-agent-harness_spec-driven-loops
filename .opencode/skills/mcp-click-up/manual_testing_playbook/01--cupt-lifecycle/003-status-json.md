---
title: "01-003: Status and Workspace Verification"
---

# 01-003: Status and Workspace Verification

**Goal:** Verify cupt can retrieve workspace information and report authentication state.

## Test Procedure

```bash
cupt status
cupt teams
```

## Expected Output

```
Authenticated: ✓
Workspace: Your Workspace Name (ID: 1234567)
User: your@email.com
```

```
Teams in workspace:
  - Engineering
  - Design
  - Product
```

## Notes

- Workspace ID is needed for `CLICKUP_TEAM_ID` in MCP config
- Team names are case-sensitive in `cupt list --team` filter

## Failure Diagnosis

- `Workspace: (unknown)` → Workspace ID not configured; run `cupt config --workspace-id <id>`
- No teams listed → May need to re-auth with admin token
