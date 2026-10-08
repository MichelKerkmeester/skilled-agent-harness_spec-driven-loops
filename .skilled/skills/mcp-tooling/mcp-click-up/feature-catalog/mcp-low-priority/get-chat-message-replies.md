---
title: "clickup_get_chat_message_replies"
description: "Read the replies in a chat thread."
trigger_phrases:
  - "clickup_get_chat_message_replies"
  - "chat thread replies"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_chat_message_replies

Read the replies in a chat thread.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_chat_message_replies` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get threaded replies for a chat message by message_id. Supports pagination. Chat thread URLs (/<ws>/v/cn/<channel_id>/t/<id> or /<ws>/chat/r/<channel_id>/t/<id>) end in a chat message id, pass it here, not to clickup_get_task. That id is usually the thread root but can be a reply inside the thread; if no replies come back, find the thread root via clickup_get_chat_channel_messages on the channel.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `message_id` | string | yes | ID of the chat message to get replies from. |
| `cursor` | string | no | Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results. |
| `limit` | number | no | Maximum number of replies to return (1-100). |
| `content_format` | string (`text/plain`, `text/md`) | no | Response content format. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

A chat thread URL ends in a message ID. Pass it here, not to `clickup_get_task`.

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
- Feature file path: `mcp-low-priority/get-chat-message-replies.md`

Related references:
- [get-chat-channel-messages.md](../../feature-catalog/mcp-low-priority/get-chat-channel-messages.md): clickup_get_chat_channel_messages
