---
title: "clickup_get_user_groups"
description: "List user groups (teams) in the workspace. Enterprise feature."
trigger_phrases:
  - "user groups"
  - "clickup_get_user_groups"
  - "list enterprise user groups"
  - "discover user ids bulk"
  - "workspace user group members"
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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/082-user-groups.md`
Related references:
- [081-manage-webhooks.md](081-manage-webhooks.md) — clickup_manage_webhooks
- [083-manage-guests.md](083-manage-guests.md) — clickup_manage_guests
