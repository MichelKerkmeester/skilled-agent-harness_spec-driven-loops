---
title: "clickup_search_tasks"
description: "Full-text search across the workspace with optional list, assignee, tag, and status filters."
trigger_phrases:
  - "search tasks"
  - "clickup_search_tasks"
  - "full-text task search"
  - "find tasks by keyword"
  - "workspace task search"
---

# clickup_search_tasks

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/055-search-tasks.md`
Related references:
- [054-delete-task.md](054-delete-task.md) — clickup_delete_task
- [056-get-workspace.md](056-get-workspace.md) — clickup_get_workspace
