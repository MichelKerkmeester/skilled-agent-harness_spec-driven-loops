---
title: "clickup_manage_chat"
description: "Send messages to ClickUp Chat channels."
trigger_phrases:
  - "manage chat"
  - "clickup_manage_chat"
  - "send chat message"
  - "post to clickup channel"
  - "channel notification automation"
---

# clickup_manage_chat

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/080-manage-chat.md`
Related references:
- [079-use-template.md](079-use-template.md) — clickup_use_task_template
- [081-manage-webhooks.md](081-manage-webhooks.md) — clickup_manage_webhooks
