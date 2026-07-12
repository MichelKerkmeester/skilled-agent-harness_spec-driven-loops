---
title: "clickup_create_checklist"
description: "Create a named checklist inside a task."
trigger_phrases:
  - "create checklist"
  - "clickup_create_checklist"
  - "add checklist to task"
  - "task checklist creation"
  - "named checklist in task"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_checklist

Create a named checklist inside a task.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no checklist tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a new checklist to the specified task. Required: `task_id`, `name`. Returns `checklist_id` for subsequent item operations.

---

## 2. HOW IT WORKS

A task can have multiple checklists. Items are added separately via `clickup_create_checklist_item`.

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
- Feature file path: `mcp-low-priority/create-checklist.md`
Related references:
- [feedback.md](feedback.md) — clickup_provide_feedback
- [update-checklist.md](update-checklist.md) — clickup_update_checklist
