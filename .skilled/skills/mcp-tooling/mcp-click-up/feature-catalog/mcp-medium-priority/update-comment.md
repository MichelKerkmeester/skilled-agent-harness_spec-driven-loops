---
title: "clickup_update_comment"
description: "Edit a comment in place: replace its text, resolve it or reassign it."
trigger_phrases:
  - "clickup_update_comment"
  - "edit comment"
  - "resolve comment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_comment

Edit a comment in place: replace its text, resolve it or reassign it.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_update_comment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Edit an existing comment in place by comment_id. Replaces the comment text (supports Markdown), and can mark it resolved or reassign it. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `comment_id` | string | yes | ID of the comment to update. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID. |
| `comment_text` | string | no | New comment content that replaces the existing text. Supports Markdown formatting. To @mention a user, write [@Name](#user_mention#user_id) inline, user_id MUST be a numeric ClickUp user id from clickup_resolve_assignees. |
| `resolved` | boolean | no | Mark the comment as resolved (true) or unresolved (false). |
| `assignee` | number | no | User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or "me" to user ID if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Find the `comment_id` with `clickup_get_task_comments` or `clickup_get_threaded_comments` first.

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
- Feature file path: `mcp-medium-priority/update-comment.md`

Related references:
- [get-task-comments.md](../../feature-catalog/mcp-high-priority/get-task-comments.md): clickup_get_task_comments
- [delete-comment.md](../../feature-catalog/mcp-medium-priority/delete-comment.md): clickup_delete_comment
