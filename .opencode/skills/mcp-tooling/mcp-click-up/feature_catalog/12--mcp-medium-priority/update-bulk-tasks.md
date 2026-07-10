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
---

# clickup_update_bulk_tasks

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
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/update-bulk-tasks.md`
Related references:
- [create-subtask.md](create-subtask.md) — clickup_create_subtask
