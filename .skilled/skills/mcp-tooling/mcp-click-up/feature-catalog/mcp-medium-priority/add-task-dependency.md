---
title: "clickup_add_task_dependency"
description: "Make one task block another: `waiting_on` or `blocking`."
trigger_phrases:
  - "clickup_add_task_dependency"
  - "task dependency"
  - "blocked by"
  - "waiting on"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_task_dependency

Make one task block another: `waiting_on` or `blocking`.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_add_task_dependency` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Set a directional dependency where one task blocks the other. Use 'waiting_on' when task_id cannot start until depends_on is done, or 'blocking' when task_id is blocking depends_on. For non-blocking associations, use add_task_link instead.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to set the dependency on. Works with regular and custom IDs (like 'DEV-1234'). Use clickup_search to find task ID by name if needed. |
| `depends_on` | string | yes | ID of the task that task_id depends on or is blocking. Works with regular and custom IDs. |
| `type` | string (`waiting_on`, `blocking`) | yes | Type of dependency to add: 'waiting_on' or 'blocking'. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Use `waiting_on` when `task_id` cannot start until `depends_on` is done, and `blocking` for the reverse. For a link with no ordering, use `clickup_add_task_link`. Read existing dependencies with `clickup_get_task` and `include: ["dependencies"]`.

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
- Feature file path: `mcp-medium-priority/add-task-dependency.md`

Related references:
- [remove-task-dependency.md](../../feature-catalog/mcp-medium-priority/remove-task-dependency.md): clickup_remove_task_dependency
- [add-task-link.md](../../feature-catalog/mcp-medium-priority/add-task-link.md): clickup_add_task_link
