---
title: "clickup_add_task_to_multiple_lists"
description: "Add an existing task to additional lists without duplicating it."
---

# clickup_add_task_to_multiple_lists

---

## 1. OVERVIEW

Adds the task to additional lists while keeping the original. Required: `task_id`, `list_ids` (array).

---

## 2. CURRENT REALITY

The task exists in multiple lists but is a single entity — changes in one list reflect everywhere. Useful for cross-team visibility.

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
- Feature file path: `12--mcp-medium-priority/05-multi-list.md`
