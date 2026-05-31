---
title: "clickup_manage_custom_fields"
description: "Create or update custom field definitions for a list."
---

# clickup_manage_custom_fields

---

## 1. OVERVIEW

Defines new custom fields on a list or updates existing field properties. Required: `list_id`, `name`, `type` (text, number, date, dropdown, etc.).

---

## 2. CURRENT REALITY

Custom field definitions apply to all tasks in the list. To set values on individual tasks, use `clickup_set_custom_field_value` (LOW priority category).

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/10-custom-fields.md`
