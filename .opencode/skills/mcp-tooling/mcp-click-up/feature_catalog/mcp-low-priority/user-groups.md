---
title: "clickup_get_user_groups"
description: "List user groups (teams) in the workspace. Enterprise feature."
trigger_phrases:
  - "user groups"
  - "clickup_get_user_groups"
  - "list enterprise user groups"
  - "discover user ids bulk"
  - "workspace user group members"
version: 1.0.0.3
---

# clickup_get_user_groups

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all user groups with their member lists. Enterprise plan required. Returns: group name, ID, members (user_id, email, username).

---

## 2. HOW IT WORKS

Use to discover user IDs for bulk assignee operations. Requires admin-level API token.

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
- Feature file path: `mcp-low-priority/user-groups.md`
Related references:
- [manage-webhooks.md](manage-webhooks.md) — clickup_manage_webhooks
- [manage-guests.md](manage-guests.md) — clickup_manage_guests
