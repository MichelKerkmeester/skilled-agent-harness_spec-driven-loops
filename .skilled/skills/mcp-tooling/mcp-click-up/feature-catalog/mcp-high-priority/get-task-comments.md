---
title: "clickup_get_task_comments"
description: "List a task's comments, with a reply count per comment."
trigger_phrases:
  - "clickup_get_task_comments"
  - "read task comments"
  - "list comments mcp"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_task_comments

List a task's comments, with a reply count per comment.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_task_comments` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get task comments with reply_count per comment. Use clickup_get_threaded_comments for replies when reply_count > 0. Supports pagination via start/start_id.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | Task ID (supports custom IDs like 'DEV-1234') |
| `start` | number | no | Timestamp (in milliseconds) to start retrieving comments from. Used for pagination. |
| `start_id` | string | no | Comment ID to start from. Used together with start for pagination. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Fetch replies with `clickup_get_threaded_comments` when `reply_count` is above zero. Page with `start` and `start_id`. `cupt notes <id>` covers the same read for daily use.

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
- Feature file path: `mcp-high-priority/get-task-comments.md`

Related references:
- [get-threaded-comments.md](../../feature-catalog/mcp-medium-priority/get-threaded-comments.md): clickup_get_threaded_comments
- [create-comment.md](../../feature-catalog/mcp-high-priority/create-comment.md): clickup_create_comment
