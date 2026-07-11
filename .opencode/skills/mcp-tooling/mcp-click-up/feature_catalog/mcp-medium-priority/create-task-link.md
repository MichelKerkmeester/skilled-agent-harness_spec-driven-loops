---
title: "clickup_create_task_link"
description: "Create a non-dependency link between two tasks."
trigger_phrases:
  - "create task link"
  - "clickup_create_task_link"
  - "link related tasks"
  - "non-dependency task relationship"
  - "related task reference"
version: 1.0.0.3
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
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-medium-priority/create-task-link.md`
Related references:
- [task-dependencies.md](task-dependencies.md) — clickup_manage_task_dependencies
- [multi-list.md](multi-list.md) — clickup_add_task_to_multiple_lists
