---
title: "clickup_add_tag_to_task"
description: "Add an existing space tag to a task."
trigger_phrases:
  - "clickup_add_tag_to_task"
  - "add tag mcp"
  - "tag task"
version: 1.1.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_tag_to_task

Add an existing space tag to a task.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_add_tag_to_task` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Add existing tag to task. Tag must exist in space. Note: Will fail if tag doesn't exist.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `tag_name` | string | yes | Name of the tag to add to the task. The tag must already exist in the space. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The tag must already exist in the space, and the call fails otherwise. The server cannot create tags. `cupt tag add <id> <name>` does the same job for daily use.

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
- Feature file path: `mcp-medium-priority/add-tag.md`

Related references:
- [remove-tag.md](../../feature-catalog/mcp-medium-priority/remove-tag.md): clickup_remove_tag_from_task
