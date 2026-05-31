---
title: "clickup_create_task_link"
description: "Create a non-dependency link between two tasks."
---

# clickup_create_task_link

---

## 1. OVERVIEW

Links two tasks as 'related' without creating a dependency constraint. Required: `task_id`, `links_to_task_id`.

---

## 2. CURRENT REALITY

Appears in ClickUp UI as a related task reference. Does not affect task ordering or blocking.

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
- Feature file path: `12--mcp-medium-priority/04-create-task-link.md`
