---
title: "clickup_get_custom_fields"
description: "List all custom field definitions for a list."
trigger_phrases:
  - "get custom fields"
  - "clickup_get_custom_fields"
  - "list custom field definitions"
  - "discover field ids"
  - "custom field schema for list"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_custom_fields

List all custom field definitions for a list.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all custom field definitions configured for the specified list. Required: `list_id`. Each definition includes: `id`, `name`, `type`, and allowed values (for dropdowns).

---

## 2. HOW IT WORKS

Use to discover field IDs before calling `clickup_set_custom_field_value`. Field IDs are list-specific.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/get-custom-fields.md`
Related references:
- [update-doc-page.md](update-doc-page.md) — clickup_update_document_page
- [set-custom-field.md](set-custom-field.md) — clickup_set_custom_field_value
