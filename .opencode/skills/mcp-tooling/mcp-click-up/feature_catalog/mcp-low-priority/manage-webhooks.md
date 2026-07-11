---
title: "clickup_manage_webhooks"
description: "Create, update, list, or delete workspace webhooks."
trigger_phrases:
  - "manage webhooks"
  - "clickup_manage_webhooks"
  - "create clickup webhook"
  - "event subscription endpoint"
  - "webhook event automation"
version: 1.0.0.3
---

# clickup_manage_webhooks

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

CRUD operations on webhooks. Create: requires `team_id`, `endpoint` (URL), `events` (array of event types). Supported events include `taskCreated`, `taskStatusUpdated`, `taskCommentPosted`, and others.

---

## 2. HOW IT WORKS

Webhooks fire to the specified endpoint URL when the subscribed events occur. The endpoint must be publicly reachable. Returns `webhook_id` for management.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-low-priority/manage-webhooks.md`
Related references:
- [manage-chat.md](manage-chat.md) — clickup_manage_chat
- [user-groups.md](user-groups.md) — clickup_get_user_groups
