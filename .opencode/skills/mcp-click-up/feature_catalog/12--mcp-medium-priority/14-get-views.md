---
title: "clickup_get_views"
description: "List all views (list view, board, calendar, etc.) for a workspace, space, or list."
---

# clickup_get_views

---

## 1. OVERVIEW

Returns all views configured for the specified scope. Required: one of `team_id`, `space_id`, or `list_id`. Returns view objects with ID, name, and type.

---

## 2. CURRENT REALITY

Use to discover available views before rendering or filtering. View IDs can be used in other ClickUp API calls.

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
- Feature file path: `12--mcp-medium-priority/14-get-views.md`
