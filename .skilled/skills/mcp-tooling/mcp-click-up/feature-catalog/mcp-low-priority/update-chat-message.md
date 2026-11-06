---
title: "clickup_update_chat_message"
description: "Edit a chat message or reply you posted, or resolve or reassign it."
trigger_phrases:
  - "clickup_update_chat_message"
  - "edit chat message"
  - "resolve chat message"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_update_chat_message

Edit a chat message or reply you posted, or resolve or reassign it.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_update_chat_message` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Edit the text of a chat message or reply you posted, and for a post its title or type. It can also mark a message resolved or change its assignee.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `message_id` | string | yes | ID of the message or reply to edit. Use clickup_get_chat_channel_messages or clickup_get_chat_message_replies to find it. |
| `content` | string | no | The full new message in Markdown. Keep the file links and images from the read as they are. To add a file, upload it with clickup_request_attachment_upload and reference it as [title](#attachment#<attachment_id>) or ![title](#attachment#<attachment_id>). |
| `post_title` | string | no | New title. Posts only. |
| `post_type` | string (`Update`, `Announcement`, `Idea`, `Discussion`) | no | New kind of post. Posts only; a message can't become a post. |
| `resolved` | boolean | no | Mark the message resolved (true) or unresolved (false). |
| `assignee` | string | no | User to assign: user ID, email, username, or "me" (resolved automatically), or "unassigned" to clear. |
| `group_assignee` | string | no | Group ID to assign the message to. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

`content` replaces the whole message. Read it first, then send back the full Markdown with the change, keeping every file and image link as it was read, because a file left out is deleted. Only the author can change the text. Leave `content` out to change only the title, type, resolved state or assignee. Check `warnings` for content the API dropped.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual playbook | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/update-chat-message.md`

Related references:
- [send-chat-message.md](../../feature-catalog/mcp-low-priority/send-chat-message.md): clickup_send_chat_message
