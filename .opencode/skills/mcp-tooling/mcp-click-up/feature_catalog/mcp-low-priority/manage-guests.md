---
title: "clickup_manage_guests"
description: "Add or remove guest users from the workspace. Enterprise feature."
trigger_phrases:
  - "manage guests"
  - "clickup_manage_guests"
  - "invite guest user"
  - "remove guest access"
  - "contractor workspace access"
version: 1.0.0.3
---

# clickup_manage_guests

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Invite or remove guest users by email. Enterprise plan required. Guests have limited workspace access.

---

## 2. HOW IT WORKS

Use for contractor or client access provisioning. Requires admin-level API token and Enterprise plan.

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
- Feature file path: `mcp-low-priority/manage-guests.md`
Related references:
- [user-groups.md](user-groups.md) — clickup_get_user_groups
- [audit-logs.md](audit-logs.md) — clickup_get_audit_logs
