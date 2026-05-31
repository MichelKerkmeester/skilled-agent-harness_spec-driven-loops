---
title: "clickup_delete_checklist"
description: "Delete a checklist from a task. All items in the checklist are also deleted."
---

# clickup_delete_checklist

---

## 1. OVERVIEW

Permanently removes a checklist and all its items from the task. Required: `checklist_id`. Not reversible.

---

## 2. CURRENT REALITY

Use only when removing an entire checklist and all items. To remove individual items, use `clickup_delete_checklist_item`.

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
- Feature file path: `13--mcp-low-priority/11-delete-checklist.md`
