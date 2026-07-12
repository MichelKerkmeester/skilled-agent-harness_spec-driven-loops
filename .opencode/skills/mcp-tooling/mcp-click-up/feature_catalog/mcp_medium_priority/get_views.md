---
title: "clickup_get_views"
description: "List all views (list view, board, calendar, etc.) for a workspace, space, or list."
trigger_phrases:
  - "get views"
  - "clickup_get_views"
  - "list clickup views"
  - "discover board views"
  - "available view types"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_views

List all views (list view, board, calendar, etc.) for a workspace, space, or list.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all views configured for the specified scope. Required: one of `team_id`, `space_id`, or `list_id`. Returns view objects with ID, name, and type.

---

## 2. HOW IT WORKS

Use to discover available views before rendering or filtering. View IDs can be used in other ClickUp API calls.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/get-views.md`
Related references:
- [space-tags.md](space-tags.md) — clickup_manage_space_tags
- [create-document.md](create-document.md) — clickup_create_document
