---
title: "clickup_manage_custom_fields"
description: "Create or update custom field definitions for a list."
trigger_phrases:
  - "manage custom fields"
  - "clickup_manage_custom_fields"
  - "create custom field"
  - "custom field definition"
  - "list field schema"
version: 1.0.0.3
---

# clickup_manage_custom_fields

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Defines new custom fields on a list or updates existing field properties. Required: `list_id`, `name`, `type` (text, number, date, dropdown, etc.).

---

## 2. HOW IT WORKS

Custom field definitions apply to all tasks in the list. To set values on individual tasks, use `clickup_set_custom_field_value` (LOW priority category).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/custom-fields.md`
Related references:
- [manage-folders.md](manage-folders.md) — clickup_manage_folders
- [add-tag.md](add-tag.md) — clickup_add_tag_to_task
