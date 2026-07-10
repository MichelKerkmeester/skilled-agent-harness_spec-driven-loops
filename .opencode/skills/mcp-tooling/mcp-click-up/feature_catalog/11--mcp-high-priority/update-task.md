---
title: "clickup_update_task"
description: "Update task fields: status, priority, assignees, due date, name, description."
trigger_phrases:
  - "update task"
  - "clickup_update_task"
  - "change task status"
  - "modify task fields"
  - "update task priority or assignee"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_task

Update task fields: status, priority, assignees, due date, name, description.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies one or more fields of an existing task. Required: `task_id`. Optional update fields: `name`, `description`, `status` (must be valid status name for the list), `priority`, `assignees`, `due_date`.

---

## 2. HOW IT WORKS

The ONLY MCP tool that changes task status. Unlike cupt done, status names must be specified explicitly — use `cupt statuses <task_id>` to discover valid names first. Partial updates: only specified fields are changed.

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
- Feature file path: `11--mcp-high-priority/update-task.md`
Related references:
- [get-task.md](get-task.md) — clickup_get_task
- [delete-task.md](delete-task.md) — clickup_delete_task
