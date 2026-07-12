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
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_guests

Add or remove guest users from the workspace. Enterprise feature.

> **Capability status: UNSUPPORTED.** A direct `list_tools()` inventory (`references/mcp_tools.md`) found no guest-management tool on the registered server. Treat this card as an unsupported historical assumption until a fresh `tool_info()`/`list_tools()` capture confirms an exact callable name and schema.

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
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

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
- [user-groups.md](../mcp_low_priority/user_groups.md) — clickup_get_user_groups
- [audit-logs.md](../mcp_low_priority/audit_logs.md) — clickup_get_audit_logs
