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
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_webhooks

Create, update, list, or delete workspace webhooks.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no webhook tools on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

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
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/manage-webhooks.md`
Related references:
- [manage-chat.md](manage-chat.md) — clickup_manage_chat
- [user-groups.md](user-groups.md) — clickup_get_user_groups
