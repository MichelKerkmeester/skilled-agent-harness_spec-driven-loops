---
title: "clickup_manage_task_dependencies"
description: "Set or remove dependencies between tasks."
trigger_phrases:
  - "task dependencies"
  - "clickup_manage_task_dependencies"
  - "set task dependency"
  - "depends_on relationship"
  - "block task sequencing"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_task_dependencies

Set or remove dependencies between tasks.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates or removes dependency relationships. Relationship types: `depends_on` (this task cannot start until the other is complete) and `dependency_of` (this task blocks the other).

---

## 2. HOW IT WORKS

Use for sprint sequencing and blocked-task workflows. Dependencies are visible in ClickUp's dependency view.

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
- Feature file path: `mcp-medium-priority/task-dependencies.md`
Related references:
- [create-subtask.md](../mcp_medium_priority/create_subtask.md) — clickup_create_subtask
- [create-task-link.md](../mcp_medium_priority/create_task_link.md) — clickup_create_task_link
