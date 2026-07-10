---
title: "clickup_set_custom_field_value"
description: "Set the value of a custom field on a specific task."
trigger_phrases:
  - "set custom field value"
  - "clickup_set_custom_field_value"
  - "write custom field"
  - "set task field value"
  - "custom field value assignment"
version: 1.0.0.3
---

# clickup_set_custom_field_value

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Sets a custom field value on a task. Required: `task_id`, `field_id`, `value`. The value type must match the field type (string for text, number for number fields, etc.).

---

## 2. HOW IT WORKS

Get `field_id` from `clickup_get_custom_fields`. Value format depends on field type: dropdown fields use option ID, date fields use Unix ms timestamp.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/set-custom-field.md`
Related references:
- [get-custom-fields.md](get-custom-fields.md) — clickup_get_custom_fields
