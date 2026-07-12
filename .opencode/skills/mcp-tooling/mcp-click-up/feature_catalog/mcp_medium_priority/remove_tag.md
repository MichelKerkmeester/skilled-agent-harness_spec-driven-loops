---
title: "clickup_remove_tag_from_task"
description: "Remove a tag from a task via MCP. Equivalent to cupt tag remove."
trigger_phrases:
  - "remove tag from task mcp"
  - "clickup_remove_tag_from_task"
  - "untag task via mcp"
  - "strip tag mcp"
  - "mcp tag remove"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_remove_tag_from_task

Remove a tag from a task via MCP. Equivalent to cupt tag remove.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Removes a named tag from the specified task. Required: `task_id`, `tag_name`.

---

## 2. HOW IT WORKS

Functionally equivalent to `cupt tag remove`. Use when already in an MCP workflow.

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
- Feature file path: `mcp-medium-priority/remove-tag.md`
Related references:
- [add-tag.md](../mcp_medium_priority/add_tag.md) — clickup_add_tag_to_task
- [space-tags.md](../mcp_medium_priority/space_tags.md) — clickup_manage_space_tags
