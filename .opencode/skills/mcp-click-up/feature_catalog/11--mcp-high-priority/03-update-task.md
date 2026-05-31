---
title: "clickup_update_task"
description: "Update task fields: status, priority, assignees, due date, name, description."
---

# clickup_update_task

---

## 1. OVERVIEW

Modifies one or more fields of an existing task. Required: `task_id`. Optional update fields: `name`, `description`, `status` (must be valid status name for the list), `priority`, `assignees`, `due_date`.

---

## 2. CURRENT REALITY

The ONLY MCP tool that changes task status. Unlike cupt done, status names must be specified explicitly — use `cupt statuses <task_id>` to discover valid names first. Partial updates: only specified fields are changed.

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
- Feature file path: `11--mcp-high-priority/03-update-task.md`
