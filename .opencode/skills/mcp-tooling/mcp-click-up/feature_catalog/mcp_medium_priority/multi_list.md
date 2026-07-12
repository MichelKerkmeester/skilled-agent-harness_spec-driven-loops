---
title: "clickup_add_task_to_multiple_lists"
description: "Add an existing task to additional lists without duplicating it."
trigger_phrases:
  - "multi-list task"
  - "clickup_add_task_to_multiple_lists"
  - "add task to multiple lists"
  - "cross-team task visibility"
  - "task in multiple lists"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_task_to_multiple_lists

Add an existing task to additional lists without duplicating it.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds the task to additional lists while keeping the original. Required: `task_id`, `list_ids` (array).

---

## 2. HOW IT WORKS

The task exists in multiple lists but is a single entity — changes in one list reflect everywhere. Useful for cross-team visibility.

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
- Feature file path: `mcp-medium-priority/multi-list.md`
Related references:
- [create-task-link.md](../mcp_medium_priority/create_task_link.md) — clickup_create_task_link
- [task-attachments.md](../mcp_medium_priority/task_attachments.md) — clickup_manage_task_attachments
