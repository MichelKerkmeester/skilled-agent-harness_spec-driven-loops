---
title: "clickup_get_chat_channels"
description: "List the workspace's chat channels."
trigger_phrases:
  - "clickup_get_chat_channels"
  - "chat channels"
  - "list channels"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_chat_channels

List the workspace's chat channels.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_chat_channels` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

List chat channels in the workspace with pagination support.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `cursor` | string | no | Cursor for pagination. Use the next_cursor value from the previous response to fetch the next page of results. |
| `limit` | number | no | Maximum number of channels to return (1-100). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use it to find a `channel_id` for the other chat tools.

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
- Feature file path: `mcp-low-priority/get-chat-channels.md`

Related references:
- [get-chat-channel-messages.md](../../feature-catalog/mcp-low-priority/get-chat-channel-messages.md): clickup_get_chat_channel_messages
- [send-chat-message.md](../../feature-catalog/mcp-low-priority/send-chat-message.md): clickup_send_chat_message
