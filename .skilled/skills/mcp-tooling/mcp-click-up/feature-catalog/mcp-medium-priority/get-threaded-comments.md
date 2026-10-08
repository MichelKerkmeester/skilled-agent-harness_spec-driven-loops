---
title: "clickup_get_threaded_comments"
description: "Read the replies under one comment."
trigger_phrases:
  - "clickup_get_threaded_comments"
  - "comment replies"
  - "comment thread"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_threaded_comments

Read the replies under one comment.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_threaded_comments` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get threaded replies for a comment by comment_id. Use clickup_get_task_comments first to find comments with reply_count > 0.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `comment_id` | string | yes | ID of the parent comment to get threaded replies for. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Call `clickup_get_task_comments` first and follow up only on comments whose `reply_count` is above zero.

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
- Feature file path: `mcp-medium-priority/get-threaded-comments.md`

Related references:
- [get-task-comments.md](../../feature-catalog/mcp-high-priority/get-task-comments.md): clickup_get_task_comments
