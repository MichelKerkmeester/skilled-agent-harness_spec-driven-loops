---
title: "clickup_create_subtask"
description: "Create a subtask under a parent task."
trigger_phrases:
  - "create subtask"
  - "clickup_create_subtask"
  - "add subtask to task"
  - "child task creation"
  - "nested task under parent"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_subtask

Create a subtask under a parent task.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a new subtask linked to the specified parent task. Required: `parent_task_id`, `name`. Optional: all fields from `clickup_create_task`.

---

## 2. HOW IT WORKS

The subtask inherits the list from its parent. Subtasks appear in `clickup_get_task` response and in `cupt context <parent_id>`.

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/create-subtask.md`
Related references:
- [update-bulk-tasks.md](../mcp_medium_priority/update_bulk_tasks.md) — clickup_update_bulk_tasks
- [task-dependencies.md](../mcp_medium_priority/task_dependencies.md) — clickup_manage_task_dependencies
