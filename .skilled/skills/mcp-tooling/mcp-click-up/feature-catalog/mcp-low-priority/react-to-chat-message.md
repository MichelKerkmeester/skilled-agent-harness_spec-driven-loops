---
title: "clickup_react_to_chat_message"
description: "Add or remove your emoji reaction on a chat message."
trigger_phrases:
  - "clickup_react_to_chat_message"
  - "react to chat message"
  - "add emoji reaction"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_react_to_chat_message

Add or remove your emoji reaction on a chat message.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_react_to_chat_message` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Add or remove the signed-in user's emoji reaction on a chat message or reply. Only the caller's own reactions change.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `message_id` | string | yes | ID of the chat message or reply to react to. Find it via clickup_get_chat_channel_messages or clickup_get_chat_message_replies. |
| `action` | string (`add`, `remove`) | yes | 'add' puts the authenticated user's reaction on the message; 'remove' takes it off. |
| `reaction` | string | yes | Primary emoji shortcode, lowercase, e.g. "+1", "heart", "eyes". Aliases such as "thumbsup" are not accepted. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use the primary lowercase shortcode, such as `+1`, `heart` or `white_check_mark`. Aliases such as `thumbsup` are refused. Adding a reaction already there, or removing one that is not, fails with a nothing-changed error.

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
- Feature file path: `mcp-low-priority/react-to-chat-message.md`

Related references:
- [get-chat-channel-messages.md](../../feature-catalog/mcp-low-priority/get-chat-channel-messages.md): clickup_get_chat_channel_messages
