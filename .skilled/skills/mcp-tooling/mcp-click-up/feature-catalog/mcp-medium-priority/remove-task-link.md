---
title: "clickup_remove_task_link"
description: "Remove a link between two tasks."
trigger_phrases:
  - "clickup_remove_task_link"
  - "unlink tasks"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_remove_task_link

Remove a link between two tasks.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_remove_task_link` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Remove a link between two tasks.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to remove the link from. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `links_to` | string | yes | ID of the task that was linked to. Works with both regular task IDs and custom IDs (like 'DEV-1234'). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass the same `task_id` and `links_to` that created it.

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/remove-task-link.md`

Related references:
- [add-task-link.md](../../feature-catalog/mcp-medium-priority/add-task-link.md): clickup_add_task_link
