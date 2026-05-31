---
title: "clickup_update_checklist_item"
description: "Update a checklist item: change text or mark as resolved/unresolved."
---

# clickup_update_checklist_item

---

## 1. OVERVIEW

Modifies an existing checklist item. Required: `checklist_id`, `checklist_item_id`. Optional: `name`, `resolved` (true/false), `assignee`.

---

## 2. CURRENT REALITY

Use `resolved: true` to check off a checklist item, `resolved: false` to uncheck it.

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
- Feature file path: `13--mcp-low-priority/13-update-checklist-item.md`
