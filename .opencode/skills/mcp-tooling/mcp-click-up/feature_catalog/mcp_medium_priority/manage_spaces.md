---
title: "clickup_manage_spaces"
description: "Create, update, or delete spaces within the workspace."
trigger_phrases:
  - "manage spaces"
  - "clickup_manage_spaces"
  - "create clickup space"
  - "delete workspace space"
  - "project area management"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_spaces

Create, update, or delete spaces within the workspace.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

CRUD operations on ClickUp spaces. Create: requires `team_id`, `name`. Update/delete: requires `space_id`.

---

## 2. HOW IT WORKS

Spaces are the top-level organizational unit. Creating a space sets up a new project area. Deletion removes all folders, lists, and tasks within.

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
- Feature file path: `mcp-medium-priority/manage-spaces.md`
Related references:
- [manage-lists.md](manage-lists.md) — clickup_manage_lists
- [manage-folders.md](manage-folders.md) — clickup_manage_folders
