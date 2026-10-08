---
title: "clickup_resolve_assignees"
description: "Turn names, emails or `me` into numeric user IDs."
trigger_phrases:
  - "clickup_resolve_assignees"
  - "resolve assignees"
  - "user id for me"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_resolve_assignees

Turn names, emails or `me` into numeric user IDs.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_resolve_assignees` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Convert names, emails, or "me" to numeric ClickUp user IDs. Use when you need IDs for filters (e.g., search, filter_tasks). Most task tools resolve assignees automatically.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `assignees` | array | yes | Array of assignee names, emails, or "me" to resolve. Use "me" to refer to the currently authenticated user. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Needed before `clickup_filter_tasks` or `clickup_search` filters, which take numeric IDs only.

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
- Feature file path: `mcp-low-priority/resolve-assignees.md`

Related references:
- [filter-tasks.md](../../feature-catalog/mcp-high-priority/filter-tasks.md): clickup_filter_tasks
- [search.md](../../feature-catalog/mcp-high-priority/search.md): clickup_search
