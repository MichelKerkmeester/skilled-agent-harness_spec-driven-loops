---
title: "03-003: Notes and Comments"
---

# 03-003: Add Notes and List Comments

**Goal:** Verify cupt note adds a comment and cupt notes lists all comments.

## Test Procedure

```bash
TASK_ID="abc123"

# Add a comment
cupt note $TASK_ID "Test comment from mcp-click-up testing playbook — 03-003"

# List all comments
cupt notes $TASK_ID
```

## Expected Output (cupt notes)

```
Comments on: Task Name (abc123)

[2026-05-31 10:00] Your Name:
  Test comment from mcp-click-up testing playbook — 03-003

[2026-05-30 09:00] Another User:
  Previous comment...
```

## Agent Handoff Pattern

```bash
# Standard handoff note
cupt tag remove $TASK_ID ai_ready
cupt tag add $TASK_ID needs_review
cupt note $TASK_ID "Processing complete. Removed ai_ready, added needs_review for human review."
```

## Failure Diagnosis

- Comment not appearing → Wait 1-2s and re-run; API may have slight delay
- `403 Forbidden` → Token may not have comment write permission
