---
title: "clickup_create_bulk_tasks"
description: "Create 5 or more tasks in one API call. More efficient than sequential creation."
trigger_phrases:
  - "create bulk tasks"
  - "clickup_create_bulk_tasks"
  - "batch task creation"
  - "create multiple tasks at once"
  - "sprint setup bulk import"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_bulk_tasks

Create 5 or more tasks in one API call. More efficient than sequential creation.

> **Capability status: UNSUPPORTED.** Unlike single-task creation, dedicated bulk-create was one of the capability classes the last successful `list_tools()` inventory (`references/mcp_tools.md`) explicitly reported absent from the registered server. Treat this card as an unsupported historical assumption — use repeated single `clickup_create_task` calls instead — until a fresh `tool_info()`/`list_tools()` capture confirms an exact bulk-create callable name and schema.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Accepts a `list_id` and a `tasks` array. Each task object supports the same fields as `clickup_create_task`. The entire batch is created in a single API call.

---

## 2. HOW IT WORKS

Use for sprint setup, project initialization, or any scenario requiring 5+ tasks. More efficient than looping `clickup_create_task`. Returns array of created task objects.

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

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/create-bulk-tasks.md`
Related references:
- [manage-comments.md](manage-comments.md) — clickup_manage_comments
