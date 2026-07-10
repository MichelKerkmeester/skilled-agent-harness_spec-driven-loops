---
title: "clickup_create_task"
description: "Create a single ClickUp task with name, description, priority, assignees, tags, and due date."
trigger_phrases:
  - "create task"
  - "clickup_create_task"
  - "new clickup task"
  - "task creation mcp"
  - "add task to list"
version: 1.0.0.3
---

# clickup_create_task

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a new task in the specified list. Required field: `list_id`, `name`. Optional: `description`, `priority` (1=urgent, 2=high, 3=normal, 4=low), `assignees` (array of user IDs), `tags` (array of tag names), `due_date` (Unix ms timestamp), `status`.

---

## 2. HOW IT WORKS

Returns the created task object including the generated `task_id`. Priority values are integers 1-4. The task is immediately visible in ClickUp. Use `clickup_create_bulk_tasks` for 5+ tasks.

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
- Feature file path: `11--mcp-high-priority/create-task.md`
Related references:
- [get-task.md](get-task.md) — clickup_get_task
