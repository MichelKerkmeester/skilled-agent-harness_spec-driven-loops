---
title: "clickup_get_task"
description: "Get full task details by ID including custom fields, time tracked, and subtask list."
trigger_phrases:
  - "get task"
  - "clickup_get_task"
  - "fetch task by id"
  - "full task details mcp"
  - "retrieve task custom fields"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_task

Get full task details by ID including custom fields, time tracked, and subtask list.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Fetches the complete task record by task ID. Returns all fields: name, description, status, priority, assignees, tags, due_date, time_estimate, time_spent, custom_fields, subtasks, url, list, folder, space.

---

## 2. HOW IT WORKS

Read-only. More comprehensive than `cupt show` — includes custom fields and subtask list. Requires the task to be accessible by the API token's workspace.

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
- Feature file path: `mcp-high-priority/get-task.md`
Related references:
- [create-task.md](../mcp_high_priority/create_task.md) — clickup_create_task
- [update-task.md](../mcp_high_priority/update_task.md) — clickup_update_task
