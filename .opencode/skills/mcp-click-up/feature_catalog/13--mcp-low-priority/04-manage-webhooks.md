---
title: "clickup_manage_webhooks"
description: "Create, update, list, or delete workspace webhooks."
---

# clickup_manage_webhooks

---

## 1. OVERVIEW

CRUD operations on webhooks. Create: requires `team_id`, `endpoint` (URL), `events` (array of event types). Supported events include `taskCreated`, `taskStatusUpdated`, `taskCommentPosted`, and others.

---

## 2. CURRENT REALITY

Webhooks fire to the specified endpoint URL when the subscribed events occur. The endpoint must be publicly reachable. Returns `webhook_id` for management.

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
- Feature file path: `13--mcp-low-priority/04-manage-webhooks.md`
