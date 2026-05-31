---
title: "clickup_update_checklist"
description: "Update a checklist name or ordering."
trigger_phrases:
  - "update checklist"
  - "clickup_update_checklist"
  - "rename checklist"
  - "reorder checklist"
  - "checklist container update"
---

# clickup_update_checklist

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies the name or order of an existing checklist. Required: `checklist_id`. Optional: `name`, `position`.

---

## 2. HOW IT WORKS

Does not affect checklist items — only the checklist container itself.

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
- Feature file path: `13--mcp-low-priority/087-update-checklist.md`
Related references:
- [086-create-checklist.md](086-create-checklist.md) — clickup_create_checklist
- [088-delete-checklist.md](088-delete-checklist.md) — clickup_delete_checklist
