---
title: "clickup_remove_tag_from_task"
description: "Remove a tag from a task. The tag stays defined in the space."
trigger_phrases:
  - "clickup_remove_tag_from_task"
  - "remove tag mcp"
  - "untag task"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_remove_tag_from_task

Remove a tag from a task. The tag stays defined in the space.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_remove_tag_from_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Remove tag from task. Only removes tag-task association, tag remains in space.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `tag_name` | string | yes | Name of the tag to remove from the task. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Only the task's association is removed. `cupt tag remove <id> <name>` does the same job for daily use.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/remove-tag.md`

Related references:
- [add-tag.md](../../feature-catalog/mcp-medium-priority/add-tag.md): clickup_add_tag_to_task
