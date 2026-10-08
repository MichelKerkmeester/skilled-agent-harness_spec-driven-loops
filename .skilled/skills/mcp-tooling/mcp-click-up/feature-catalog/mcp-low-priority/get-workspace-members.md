---
title: "clickup_get_workspace_members"
description: "List every member of the workspace."
trigger_phrases:
  - "clickup_get_workspace_members"
  - "workspace members"
  - "list users"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_workspace_members

List every member of the workspace.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_workspace_members` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

List all members in the workspace. Most tools resolve assignees automatically, use only when you need the full member list.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Most task tools resolve assignees on their own, so use this only when you need the full list.

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
- Feature file path: `mcp-low-priority/get-workspace-members.md`

Related references:
- [find-member-by-name.md](../../feature-catalog/mcp-low-priority/find-member-by-name.md): clickup_find_member_by_name
- [resolve-assignees.md](../../feature-catalog/mcp-low-priority/resolve-assignees.md): clickup_resolve_assignees
