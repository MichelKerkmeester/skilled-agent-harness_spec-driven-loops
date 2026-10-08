---
title: "clickup_get_custom_fields"
description: "Read custom field definitions at list, folder, space or workspace level."
trigger_phrases:
  - "clickup_get_custom_fields"
  - "custom fields"
  - "field ids"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_custom_fields

Read custom field definitions at list, folder, space or workspace level.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_custom_fields` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get custom field definitions at any hierarchy level (list, folder, space, or workspace). Returns field IDs, types, and options for dropdowns/labels. Use this to discover available custom fields before setting values on tasks. Multiple scopes can be queried in a single call.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `list_id` | string | no | List ID. Returns custom fields defined on this list. |
| `folder_id` | string | no | Folder ID. Returns custom fields defined on this folder. |
| `space_id` | string | no | Space ID. Returns custom fields defined on this space. |
| `include_workspace` | boolean | no | If true, returns workspace-level custom fields. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use it to find field IDs and dropdown options. Then set values with `custom_fields` on `clickup_create_task` or `clickup_update_task`, since the server has no single-field setter.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-structure/custom-field.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/get-custom-fields.md`

Related references:
- [update-task.md](../../feature-catalog/mcp-high-priority/update-task.md): clickup_update_task
