---
title: "clickup_add_task_link"
description: "Link two tasks with no ordering or blocking."
trigger_phrases:
  - "clickup_add_task_link"
  - "link tasks"
  - "related task"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_add_task_link

Link two tasks with no ordering or blocking.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_add_task_link` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Link two tasks together. Creates a bidirectional association with no ordering or blocking. For blocking/dependency relationships, use add_task_dependency instead.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the task to link from. Works with regular and custom IDs (like 'DEV-1234'). |
| `links_to` | string | yes | ID of the task to link to. Works with regular and custom IDs. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

For a blocking relationship, use `clickup_add_task_dependency`.

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
- Feature file path: `mcp-medium-priority/add-task-link.md`

Related references:
- [remove-task-link.md](../../feature-catalog/mcp-medium-priority/remove-task-link.md): clickup_remove_task_link
- [add-task-dependency.md](../../feature-catalog/mcp-medium-priority/add-task-dependency.md): clickup_add_task_dependency
