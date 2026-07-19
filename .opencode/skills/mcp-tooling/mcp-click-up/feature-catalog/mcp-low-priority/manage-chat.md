---
title: "clickup_manage_chat"
description: "Send messages to ClickUp Chat channels."
trigger_phrases:
  - "manage chat"
  - "clickup_manage_chat"
  - "send chat message"
  - "post to clickup channel"
  - "channel notification automation"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_chat

Send messages to ClickUp Chat channels.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Posts a message to a specified ClickUp Chat channel. Required: `channel_id`, `message_text`. Channel IDs must be discovered via the ClickUp UI.

---

## 2. HOW IT WORKS

ClickUp Chat is a premium feature. Channel IDs are opaque strings not easily discoverable via API. Use primarily for automation of known channel notifications.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/manage-chat.md`
Related references:
- [use-template.md](../../feature-catalog/mcp-low-priority/use-template.md) — clickup_use_task_template
- [manage-webhooks.md](../../feature-catalog/mcp-low-priority/manage-webhooks.md) — clickup_manage_webhooks
