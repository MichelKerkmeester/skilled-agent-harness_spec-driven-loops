---
title: "clickup_manage_spaces"
description: "Create, update, or delete spaces within the workspace."
---

# clickup_manage_spaces

---

## 1. OVERVIEW

CRUD operations on ClickUp spaces. Create: requires `team_id`, `name`. Update/delete: requires `space_id`.

---

## 2. CURRENT REALITY

Spaces are the top-level organizational unit. Creating a space sets up a new project area. Deletion removes all folders, lists, and tasks within.

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
- Feature file path: `12--mcp-medium-priority/08-manage-spaces.md`
