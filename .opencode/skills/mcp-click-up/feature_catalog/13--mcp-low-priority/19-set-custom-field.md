---
title: "clickup_set_custom_field_value"
description: "Set the value of a custom field on a specific task."
---

# clickup_set_custom_field_value

---

## 1. OVERVIEW

Sets a custom field value on a task. Required: `task_id`, `field_id`, `value`. The value type must match the field type (string for text, number for number fields, etc.).

---

## 2. CURRENT REALITY

Get `field_id` from `clickup_get_custom_fields`. Value format depends on field type: dropdown fields use option ID, date fields use Unix ms timestamp.

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
- Feature file path: `13--mcp-low-priority/19-set-custom-field.md`
