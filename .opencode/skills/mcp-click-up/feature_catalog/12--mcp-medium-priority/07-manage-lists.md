---
title: "clickup_manage_lists"
description: "Create, update, or delete lists within a space or folder."
---

# clickup_manage_lists

---

## 1. OVERVIEW

CRUD operations on ClickUp lists. Create: requires `space_id` or `folder_id`, `name`. Update: requires `list_id` and fields to change. Delete: requires `list_id`.

---

## 2. CURRENT REALITY

Use for project or sprint setup. Deleting a list archives all contained tasks.

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
- Feature file path: `12--mcp-medium-priority/07-manage-lists.md`
