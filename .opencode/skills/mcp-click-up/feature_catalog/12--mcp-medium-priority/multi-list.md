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
---

# clickup_add_task_to_multiple_lists

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/multi-list.md`
Related references:
- [create-task-link.md](create-task-link.md) — clickup_create_task_link
- [task-attachments.md](task-attachments.md) — clickup_manage_task_attachments
