---
title: "clickup_find_member_by_name"
description: "Find one member by name or email."
trigger_phrases:
  - "clickup_find_member_by_name"
  - "find member"
  - "look up user"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_find_member_by_name

Find one member by name or email.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_find_member_by_name` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Get a member in the ClickUp workspace by name or email. Returns the member object if found, or null if not found.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `name_or_email` | string | yes | The name or email of the member to find. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Returns null when nobody matches.

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
- Feature file path: `mcp-low-priority/find-member-by-name.md`

Related references:
- [resolve-assignees.md](../../feature-catalog/mcp-low-priority/resolve-assignees.md): clickup_resolve_assignees
