---
title: "clickup_get_chat_channel_messages"
description: "Read a chat channel's messages."
trigger_phrases:
  - "clickup_get_chat_channel_messages"
  - "read chat"
  - "channel messages"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_chat_channel_messages

Read a chat channel's messages.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_chat_channel_messages` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get messages for a chat channel. Messages with has_replies=true have threads fetchable via clickup_get_chat_message_replies. Supports pagination. Channel URLs look like /<ws>/v/cn/<channel_id> or /<ws>/chat/r/<channel_id>.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `channel_id` | string | yes | ID of the chat channel to get messages from. |
| `cursor` | string | no | Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results. |
| `limit` | number | no | Maximum number of messages to return (1-100). |
| `content_format` | string (`text/plain`, `text/md`) | no | Response content format. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Messages with `has_replies` have threads, which `clickup_get_chat_message_replies` reads.

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
- Feature file path: `mcp-low-priority/get-chat-channel-messages.md`

Related references:
- [get-chat-message-replies.md](../../feature-catalog/mcp-low-priority/get-chat-message-replies.md): clickup_get_chat_message_replies
