---
title: "clickup_create_task_comment"
description: "Deprecated alias for task comments. Use `clickup_create_comment`."
trigger_phrases:
  - "clickup_create_task_comment"
  - "create task comment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_task_comment

Deprecated alias for task comments. Use `clickup_create_comment`.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_task_comment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

[DEPRECATED to clickup_create_comment] Legacy name for creating a task comment, kept for clients with stale tool listings. Prefer the replacement tool; it takes entity_id instead of task_id.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `comment_text` | string | yes | Comment content. Supports Markdown formatting. |
| `notify_all` | boolean | no | Whether to notify all assignees. Default is false. |
| `assignee` | number | no | User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or "me" to user ID if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The server keeps this name for old clients. New calls should use `clickup_create_comment`, which takes `entity_id` instead of `task_id`.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/create-task-comment.md`

Related references:
- [create-comment.md](../../feature-catalog/mcp-high-priority/create-comment.md): clickup_create_comment
