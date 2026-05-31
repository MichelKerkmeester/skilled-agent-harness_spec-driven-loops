---
title: "clickup_create_subtask"
description: "Create a subtask under a parent task."
trigger_phrases:
  - "create subtask"
  - "clickup_create_subtask"
  - "add subtask to task"
  - "child task creation"
  - "nested task under parent"
---

# clickup_create_subtask

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/060-create-subtask.md`
Related references:
- [059-update-bulk-tasks.md](059-update-bulk-tasks.md) — clickup_update_bulk_tasks
- [061-task-dependencies.md](061-task-dependencies.md) — clickup_manage_task_dependencies
