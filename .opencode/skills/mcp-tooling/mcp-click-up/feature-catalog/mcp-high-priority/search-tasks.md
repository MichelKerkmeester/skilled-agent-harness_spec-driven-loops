---
title: "clickup_search_tasks"
description: "Full-text search across the workspace with optional list, assignee, tag, and status filters."
trigger_phrases:
  - "search tasks"
  - "clickup_search_tasks"
  - "full-text task search"
  - "find tasks by keyword"
  - "workspace task search"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_search_tasks

Full-text search across the workspace with optional list, assignee, tag, and status filters.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Searches task names and descriptions across the workspace. Supports optional filters: `list_id`, `assignees` (array), `tags` (array), `status`. Returns matching tasks sorted by relevance.

---

## 2. HOW IT WORKS

Server-side full-text search. More powerful than `cupt list --tag` for keyword-based discovery. Use when looking for tasks by content rather than structured attributes.

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

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/search-tasks.md`
Related references:
- [delete-task.md](../../feature-catalog/mcp-high-priority/delete-task.md) — clickup_delete_task
- [get-workspace.md](../../feature-catalog/mcp-high-priority/get-workspace.md) — clickup_get_workspace
