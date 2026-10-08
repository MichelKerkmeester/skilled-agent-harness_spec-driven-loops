---
title: "clickup_create_list"
description: "Create a list directly in a space."
trigger_phrases:
  - "clickup_create_list"
  - "create list"
  - "new list in space"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_list

Create a list directly in a space.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_list` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a list in a ClickUp space. Requires name and space_name or space_id. For lists in folders, use clickup_create_list_in_folder.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name` | string | yes | Name of the list. |
| `space_id` | string | no | ID of the space to create the list in. Provide this instead of space_name if you already have the ID. |
| `space_name` | string | no | Name of the space to create the list in. Alternative to space_id; one of them must be provided. |
| `content` | string | no | Description or content of the list. |
| `due_date` | string | no | Due date in YYYY-MM-DD format or date-time in YYYY-MM-DD HH:MM format |
| `priority` | string (`urgent`, `high`, `normal`, `low`) | no | Priority value: 'urgent', 'high', 'normal', or 'low'. |
| `assignee` | number | no | User ID to assign the list to. Use clickup_resolve_assignees to convert email, username, or "me" to user ID if needed. |
| `status` | string | no | Status of the list. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass `name` and `space_id` or `space_name`. For a list inside a folder, use `clickup_create_list_in_folder`. The server has no space tools, so the space must already exist.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-structure/create-list.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/create-list.md`

Related references:
- [create-list-in-folder.md](../../feature-catalog/mcp-medium-priority/create-list-in-folder.md): clickup_create_list_in_folder
- [update-list.md](../../feature-catalog/mcp-medium-priority/update-list.md): clickup_update_list
