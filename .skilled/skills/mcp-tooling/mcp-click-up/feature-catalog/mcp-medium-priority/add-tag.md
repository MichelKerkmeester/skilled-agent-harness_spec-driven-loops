---
title: "clickup_add_tag_to_task"
description: "Add a tag to a task via MCP. Equivalent to cupt tag add."
trigger_phrases:
  - "add tag to task mcp"
  - "clickup_add_tag_to_task"
  - "apply tag via mcp"
  - "tag task via mcp"
  - "mcp tag add"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_tag_to_task

Add a tag to a task via MCP. Equivalent to cupt tag add.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a named tag to the specified task. Required: `task_id`, `tag_name`. The tag must exist in the workspace.

---

## 2. HOW IT WORKS

Functionally equivalent to `cupt tag add`. Use when already in an MCP workflow. cupt is simpler for standalone tag operations.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/add-tag.md`
Related references:
- [custom-fields.md](../../feature-catalog/mcp-medium-priority/custom-fields.md) — clickup_manage_custom_fields
- [remove-tag.md](../../feature-catalog/mcp-medium-priority/remove-tag.md) — clickup_remove_tag_from_task
