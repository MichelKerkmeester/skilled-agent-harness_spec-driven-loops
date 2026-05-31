---
title: "clickup_create_task_link"
description: "Create a non-dependency link between two tasks."
trigger_phrases:
  - "create task link"
  - "clickup_create_task_link"
  - "link related tasks"
  - "non-dependency task relationship"
  - "related task reference"
---

# clickup_create_task_link

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Links two tasks as 'related' without creating a dependency constraint. Required: `task_id`, `links_to_task_id`.

---

## 2. HOW IT WORKS

Appears in ClickUp UI as a related task reference. Does not affect task ordering or blocking.

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
- Feature file path: `12--mcp-medium-priority/062-create-task-link.md`
Related references:
- [061-task-dependencies.md](061-task-dependencies.md) — clickup_manage_task_dependencies
- [063-multi-list.md](063-multi-list.md) — clickup_add_task_to_multiple_lists
