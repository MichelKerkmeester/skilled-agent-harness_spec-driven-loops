---
title: "clickup_send_chat_message"
description: "Post a chat message or threaded reply, with markdown support."
trigger_phrases:
  - "clickup_send_chat_message"
  - "send chat message"
  - "post to channel"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_send_chat_message

Post a chat message or threaded reply, with markdown support.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_send_chat_message` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Send a message or threaded reply to a chat channel. Provide parent_message_id for threaded replies. Supports markdown and post types.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `channel_id` | string | yes | ID of the chat channel to send the message to. Ignored when parent_message_id is set, a reply's channel is derived from its parent message. |
| `content` | string | yes | Message content to send (supports markdown). |
| `parent_message_id` | string | no | ID of the parent message to reply to. When provided, the message is sent as a threaded reply instead of a top-level channel message. Use clickup_get_chat_channel_messages to find the message ID. |
| `type` | string (`message`, `post`) | no | Type of message to send. |
| `content_format` | string (`text/md`, `text/plain`) | no | Format of the message content. |
| `assignee` | string | no | User ID to assign the message to. Use clickup_resolve_assignees to convert email, username, or "me" to user ID if needed. |
| `group_assignee` | string | no | Group ID to assign the message to. |
| `followers` | array | no | Array of user IDs to add as followers of the message. Use clickup_resolve_assignees to convert emails, usernames, or "me" to user IDs if needed. |
| `post_title` | string | no | Title for the post (required if type is 'post'). |
| `post_type` | string (`Update`, `Announcement`, `Idea`, `Discussion`) | no | Kind of post (required if type is 'post'). Resolved to the workspace's post subtype. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Sending reaches other people right away, so confirm the channel and text with the user first. Pass `parent_message_id` for a threaded reply.

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
- Feature file path: `mcp-low-priority/send-chat-message.md`

Related references:
- [get-chat-channels.md](../../feature-catalog/mcp-low-priority/get-chat-channels.md): clickup_get_chat_channels
