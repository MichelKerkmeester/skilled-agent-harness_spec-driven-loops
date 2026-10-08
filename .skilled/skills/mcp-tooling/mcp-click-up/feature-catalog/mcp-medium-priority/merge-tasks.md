---
title: "clickup_merge_tasks"
description: "Merge source tasks into a target task. The sources are consumed."
trigger_phrases:
  - "clickup_merge_tasks"
  - "merge tasks"
  - "merge duplicates"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_merge_tasks

Merge source tasks into a target task. The sources are consumed.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_merge_tasks` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Merge one or more source tasks into a target task. The target task survives and absorbs content from the source tasks, which are consumed. Destination field values take precedence on conflicts. Works with both regular task IDs and custom IDs (like 'DEV-1234').

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `task_id` | string | yes | ID of the target/destination task that will survive the merge. Source tasks will be merged into this task. Works with both regular task IDs and custom IDs (like 'DEV-1234'). |
| `source_task_ids` | array | yes | Array of task IDs to merge into the target task. These tasks will be consumed/deleted after merging. Works with both regular task IDs and custom IDs (like 'DEV-1234'). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

The target survives, and its field values win on conflicts. The source tasks are consumed, so confirm both sides with the user before the call.

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
- Feature file path: `mcp-medium-priority/merge-tasks.md`

Related references:
- [get-task.md](../../feature-catalog/mcp-high-priority/get-task.md): clickup_get_task
