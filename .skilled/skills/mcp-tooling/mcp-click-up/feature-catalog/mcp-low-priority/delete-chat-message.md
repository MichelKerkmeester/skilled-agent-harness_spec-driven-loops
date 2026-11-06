---
title: "clickup_delete_chat_message"
description: "Delete a chat message, thread reply or post. It cannot be undone."
trigger_phrases:
  - "clickup_delete_chat_message"
  - "delete chat message"
  - "remove chat reply"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_delete_chat_message

Delete a chat message, thread reply or post. It cannot be undone.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_delete_chat_message` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Delete a chat message, thread reply or post by its ID. This cannot be undone.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `message_id` | string | yes | ID of the chat message, reply or post to delete. Find it via clickup_get_chat_channel_messages or clickup_get_chat_message_replies. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Deleting a top-level message also deletes every reply in its thread, so pass a reply's own ID to remove only that reply. Confirm with the user before deleting a message that has replies or that someone else wrote. Task comments go through `clickup_delete_comment` instead.

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
- Feature file path: `mcp-low-priority/delete-chat-message.md`

Related references:
- [get-chat-message-replies.md](../../feature-catalog/mcp-low-priority/get-chat-message-replies.md): clickup_get_chat_message_replies
