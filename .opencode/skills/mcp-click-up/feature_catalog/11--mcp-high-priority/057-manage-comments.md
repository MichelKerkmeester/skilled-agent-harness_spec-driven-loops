---
title: "clickup_manage_comments"
description: "Create (POST) or list (GET) comments on a task via MCP."
trigger_phrases:
  - "manage comments"
  - "clickup_manage_comments"
  - "post task comment mcp"
  - "list comments mcp"
  - "mcp comment creation"
---

# clickup_manage_comments

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Two actions: create a comment (POST — requires `task_id`, `comment_text`) or list all comments (GET — requires `task_id`). Returns comment objects with author, timestamp, and text.

---

## 2. HOW IT WORKS

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
- Feature file path: `11--mcp-high-priority/057-manage-comments.md`
Related references:
- [056-get-workspace.md](056-get-workspace.md) — clickup_get_workspace
- [058-create-bulk-tasks.md](058-create-bulk-tasks.md) — clickup_create_bulk_tasks
