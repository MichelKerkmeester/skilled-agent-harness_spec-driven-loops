---
title: "clickup_create_subtask"
description: "Create a subtask under a parent task."
---

# clickup_create_subtask

---

## 1. OVERVIEW

Creates a new subtask linked to the specified parent task. Required: `parent_task_id`, `name`. Optional: all fields from `clickup_create_task`.

---

## 2. CURRENT REALITY

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
- Feature file path: `12--mcp-medium-priority/02-create-subtask.md`
