---
title: "clickup_create_bulk_tasks"
description: "Create 5 or more tasks in one API call. More efficient than sequential creation."
---

# clickup_create_bulk_tasks

---

## 1. OVERVIEW

Accepts a `list_id` and a `tasks` array. Each task object supports the same fields as `clickup_create_task`. The entire batch is created in a single API call.

---

## 2. CURRENT REALITY

Use for sprint setup, project initialization, or any scenario requiring 5+ tasks. More efficient than looping `clickup_create_task`. Returns array of created task objects.

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
- Feature file path: `11--mcp-high-priority/08-create-bulk-tasks.md`
