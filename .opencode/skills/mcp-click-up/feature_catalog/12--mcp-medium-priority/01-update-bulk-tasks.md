---
title: "clickup_update_bulk_tasks"
description: "Update multiple tasks in a single API call."
---

# clickup_update_bulk_tasks

---

## 1. OVERVIEW

Accepts an array of task update objects, each with a `task_id` and the fields to change. Processes all updates in one API call.

---

## 2. CURRENT REALITY

Use for batch status changes, bulk reassignment, or mass due-date updates. More efficient than looping `clickup_update_task`.

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
- Feature file path: `12--mcp-medium-priority/01-update-bulk-tasks.md`
