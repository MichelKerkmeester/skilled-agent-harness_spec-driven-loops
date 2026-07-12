---
title: "clickup_update_checklist_item"
description: "Update a checklist item: change text or mark as resolved/unresolved."
trigger_phrases:
  - "update checklist item"
  - "clickup_update_checklist_item"
  - "check off checklist item"
  - "mark item resolved"
  - "uncheck checklist entry"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_checklist_item

Update a checklist item: change text or mark as resolved/unresolved.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no checklist tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Modifies an existing checklist item. Required: `checklist_id`, `checklist_item_id`. Optional: `name`, `resolved` (true/false), `assignee`.

---

## 2. HOW IT WORKS

Use `resolved: true` to check off a checklist item, `resolved: false` to uncheck it.

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
- Feature file path: `mcp-low-priority/update-checklist-item.md`
Related references:
- [create-checklist-item.md](../mcp_low_priority/create_checklist_item.md) — clickup_create_checklist_item
- [delete-checklist-item.md](../mcp_low_priority/delete_checklist_item.md) — clickup_delete_checklist_item
