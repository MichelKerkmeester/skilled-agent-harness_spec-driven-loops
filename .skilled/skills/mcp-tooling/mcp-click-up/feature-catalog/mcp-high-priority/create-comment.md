---
title: "clickup_create_comment"
description: "Post a comment or threaded reply on a task, list or view, with markdown support."
trigger_phrases:
  - "clickup_create_comment"
  - "comment on task mcp"
  - "reply to comment"
  - "comment on list"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_comment

Post a comment or threaded reply on a task, list or view, with markdown support.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_create_comment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Create a comment or threaded reply on a task, list, or view. Supports Markdown (headings, bold, code blocks, tables). Use entity_type + entity_id for the target entity. Provide reply_to_id for a threaded reply.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `entity_type` | string (`task`, `list`, `view`) | no | Entity type to comment on. Use with entity_id. |
| `entity_id` | string | no | ID of the entity to comment on. |
| `comment_text` | string | yes | Comment content. Supports Markdown formatting. To @mention a user, write a markdown link [@Name](#user_mention#user_id) inline, e.g. 'Hey [@Jane](#user_mention#81344), please review', user_id MUST be a numeric ClickUp user id from clickup_resolve_assignees (the display name is resolved server-side). |
| `reply_to_id` | string | no | ID of a parent comment to reply to. When provided, the comment is posted as a threaded reply instead of a top-level comment. |
| `notify_all` | boolean | no | Whether to notify all assignees. Default is false. |
| `assignee` | number | no | User ID to assign the comment to. Use clickup_resolve_assignees to convert email, username, or "me" to user ID if needed. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Set `entity_type` (`task`, `list` or `view`) and `entity_id`. Pass `reply_to_id` for a threaded reply. For a plain note on a task, `cupt note <id> "text"` is shorter.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/mcp-task-crud/task-comments.md` | Manual | Scenario that exercises this tool |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-high-priority/create-comment.md`

Related references:
- [get-task-comments.md](../../feature-catalog/mcp-high-priority/get-task-comments.md): clickup_get_task_comments
- [update-comment.md](../../feature-catalog/mcp-medium-priority/update-comment.md): clickup_update_comment
