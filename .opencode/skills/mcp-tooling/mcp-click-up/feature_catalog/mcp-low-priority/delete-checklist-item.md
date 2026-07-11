---
title: "clickup_delete_checklist_item"
description: "Remove a specific item from a checklist."
trigger_phrases:
  - "delete checklist item"
  - "clickup_delete_checklist_item"
  - "remove checklist item"
  - "delete single checklist entry"
  - "drop one checklist item"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_delete_checklist_item

Remove a specific item from a checklist.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no checklist tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Permanently removes a single item from a checklist. Required: `checklist_id`, `checklist_item_id`. Not reversible.

---

## 2. HOW IT WORKS

Use when removing a specific completed or unnecessary checklist item while keeping the checklist and other items.

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
- Feature file path: `mcp-low-priority/delete-checklist-item.md`
Related references:
- [update-checklist-item.md](update-checklist-item.md) — clickup_update_checklist_item
- [get-doc-pages.md](get-doc-pages.md) — clickup_get_document_pages
