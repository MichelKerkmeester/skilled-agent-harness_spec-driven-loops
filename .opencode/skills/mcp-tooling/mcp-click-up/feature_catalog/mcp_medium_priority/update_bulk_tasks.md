---
title: "clickup_update_bulk_tasks"
description: "Update multiple tasks in a single API call."
trigger_phrases:
  - "update bulk tasks"
  - "clickup_update_bulk_tasks"
  - "batch task update"
  - "bulk status change"
  - "mass task reassignment"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_bulk_tasks

Update multiple tasks in a single API call.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Accepts an array of task update objects, each with a `task_id` and the fields to change. Processes all updates in one API call.

---

## 2. HOW IT WORKS

Use for batch status changes, bulk reassignment, or mass due-date updates. More efficient than looping `clickup_update_task`.

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/update-bulk-tasks.md`
Related references:
- [create-subtask.md](../mcp_medium_priority/create_subtask.md) — clickup_create_subtask
