---
title: "clickup_manage_comments"
description: "Create (POST) or list (GET) comments on a task via MCP."
---

# clickup_manage_comments

---

## 1. OVERVIEW

Two actions: create a comment (POST — requires `task_id`, `comment_text`) or list all comments (GET — requires `task_id`). Returns comment objects with author, timestamp, and text.

---

## 2. CURRENT REALITY

Functionally equivalent to `cupt note` (add) and `cupt notes` (list) but via MCP. Use cupt for simpler syntax; use this tool when already in an MCP workflow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/07-manage-comments.md`
