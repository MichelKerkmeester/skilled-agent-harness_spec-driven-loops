---
title: "clickup_create_folder"
description: "Create a folder in a space, optionally with its own statuses."
trigger_phrases:
  - "clickup_create_folder"
  - "create folder"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_folder

Create a folder in a space, optionally with its own statuses.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_folder` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create folder in ClickUp space. Use space_id (preferred) or space_name + folder name. Supports override_statuses for folder-specific statuses. Use clickup_create_list_in_folder to add lists after creation.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name` | string | yes | Name of the folder. |
| `space_id` | string | no | ID of the space to create the folder in (preferred). Provide this instead of space_name if you already have it. |
| `space_name` | string | no | Name of the space to create the folder in. Use this when space_id is not available. |
| `override_statuses` | boolean | no | Whether to override space statuses with folder-specific statuses. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Then add lists with `clickup_create_list_in_folder`. The server has no delete-folder tool.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/create-folder.md`

Related references:
- [create-list-in-folder.md](../../feature-catalog/mcp-medium-priority/create-list-in-folder.md): clickup_create_list_in_folder
- [get-folder.md](../../feature-catalog/mcp-medium-priority/get-folder.md): clickup_get_folder
