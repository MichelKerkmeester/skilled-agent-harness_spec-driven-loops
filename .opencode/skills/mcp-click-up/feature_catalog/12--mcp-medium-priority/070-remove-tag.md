---
title: "clickup_remove_tag_from_task"
description: "Remove a tag from a task via MCP. Equivalent to cupt tag remove."
trigger_phrases:
  - "remove tag from task mcp"
  - "clickup_remove_tag_from_task"
  - "untag task via mcp"
  - "strip tag mcp"
  - "mcp tag remove"
---

# clickup_remove_tag_from_task

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/070-remove-tag.md`
Related references:
- [069-add-tag.md](069-add-tag.md) — clickup_add_tag_to_task
- [071-space-tags.md](071-space-tags.md) — clickup_manage_space_tags
