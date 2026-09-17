---
title: "clickup_create_checklist_item"
description: "Add a new item to an existing checklist."
trigger_phrases:
  - "create checklist item"
  - "clickup_create_checklist_item"
  - "add item to checklist"
  - "append checklist entry"
  - "checklist item creation"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_checklist_item

Add a new item to an existing checklist.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp-tools.md`) found no checklist tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Appends a new item to the specified checklist. Required: `checklist_id`, `name`. Optional: `assignee` (user ID), `resolved` (boolean).

---

## 2. HOW IT WORKS

Items are appended to the end of the checklist by default. Returns `checklist_item_id` for subsequent updates.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/create-checklist-item.md`
Related references:
- [delete-checklist.md](../../feature-catalog/mcp-low-priority/delete-checklist.md) — clickup_delete_checklist
- [update-checklist-item.md](../../feature-catalog/mcp-low-priority/update-checklist-item.md) — clickup_update_checklist_item
