---
title: "clickup_get_custom_fields"
description: "List all custom field definitions for a list."
trigger_phrases:
  - "get custom fields"
  - "clickup_get_custom_fields"
  - "list custom field definitions"
  - "discover field ids"
  - "custom field schema for list"
---

# clickup_get_custom_fields

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

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
