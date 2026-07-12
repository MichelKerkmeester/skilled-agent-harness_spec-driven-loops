---
title: "clickup_update_checklist"
description: "Update a checklist name or ordering."
trigger_phrases:
  - "update checklist"
  - "clickup_update_checklist"
  - "rename checklist"
  - "reorder checklist"
  - "checklist container update"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_checklist

Update a checklist name or ordering.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no checklist tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

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
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-low-priority/update-checklist.md`
Related references:
- [create-checklist.md](../mcp_low_priority/create_checklist.md) — clickup_create_checklist
- [delete-checklist.md](../mcp_low_priority/delete_checklist.md) — clickup_delete_checklist
