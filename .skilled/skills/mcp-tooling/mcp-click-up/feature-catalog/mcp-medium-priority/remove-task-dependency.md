---
title: "clickup_remove_task_dependency"
description: "Remove a dependency between two tasks."
trigger_phrases:
  - "clickup_remove_task_dependency"
  - "remove dependency"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_remove_task_dependency

Remove a dependency between two tasks.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_remove_task_dependency` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Remove a dependency between two tasks.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to remove the dependency from. Works with both regular task IDs and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `depends_on` | string | yes | ID of the task that was in the dependency relationship. Works with both regular task IDs and custom IDs (like 'DEV-1234'). |
| `type` | string (`waiting_on`, `blocking`) | yes | Type of dependency to remove: 'waiting_on' or 'blocking'. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Pass the same `task_id`, `depends_on` and `type` that created it.

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
- Feature file path: `mcp-medium-priority/remove-task-dependency.md`

Related references:
- [add-task-dependency.md](../../feature-catalog/mcp-medium-priority/add-task-dependency.md): clickup_add_task_dependency
