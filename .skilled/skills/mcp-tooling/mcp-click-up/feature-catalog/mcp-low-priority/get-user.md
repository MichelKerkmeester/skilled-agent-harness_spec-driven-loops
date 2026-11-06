---
title: "clickup_get_user"
description: "Read the signed-in user, with their timezone and current time."
trigger_phrases:
  - "clickup_get_user"
  - "clickup current user"
  - "clickup timezone"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_user

Read the signed-in user, with their timezone and current time.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_get_user` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Get the authenticated user: ID, username and email, plus their ClickUp account timezone, week-start day and the current date and time in that timezone. It takes no required input.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Call it before working out a relative date such as today, this week or overdue, and resolve the date against `current_time`, because the agent's own clock can land on a different day for this user. Assignee fields take `me` directly, so no lookup is needed to act as the user.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual playbook | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/get-user.md`

Related references:
- [resolve-assignees.md](../../feature-catalog/mcp-low-priority/resolve-assignees.md): clickup_resolve_assignees
