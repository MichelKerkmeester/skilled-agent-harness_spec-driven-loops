---
title: "clickup_manage_comments"
description: "Create (POST) or list (GET) comments on a task via MCP."
trigger_phrases:
  - "manage comments"
  - "clickup_manage_comments"
  - "post task comment mcp"
  - "list comments mcp"
  - "mcp comment creation"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_comments

Create (POST) or list (GET) comments on a task via MCP.

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
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/manage-comments.md`
Related references:
- [get-workspace.md](get-workspace.md) — clickup_get_workspace
- [create-bulk-tasks.md](create-bulk-tasks.md) — clickup_create_bulk_tasks
