---
title: "clickup_delete_comment"
description: "Delete a comment permanently."
trigger_phrases:
  - "clickup_delete_comment"
  - "delete comment"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_delete_comment

Delete a comment permanently.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_delete_comment` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Delete a comment by comment_id. This cannot be undone. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `comment_id` | string | yes | ID of the comment to delete. Use clickup_get_task_comments or clickup_get_threaded_comments to find the comment ID. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

This cannot be undone. Confirm the `comment_id` with the user before the call.

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
- Feature file path: `mcp-medium-priority/delete-comment.md`

Related references:
- [get-task-comments.md](../../feature-catalog/mcp-high-priority/get-task-comments.md): clickup_get_task_comments
- [update-comment.md](../../feature-catalog/mcp-medium-priority/update-comment.md): clickup_update_comment
