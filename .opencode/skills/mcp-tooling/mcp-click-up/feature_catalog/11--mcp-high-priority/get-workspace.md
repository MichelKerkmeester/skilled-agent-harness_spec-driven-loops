---
title: "clickup_get_workspace"
description: "Get workspace (team) details including ID, name, members, and plan information."
trigger_phrases:
  - "get workspace"
  - "clickup_get_workspace"
  - "workspace details mcp"
  - "discover user ids"
  - "verify mcp connection"
version: 1.0.0.3
---

# clickup_get_workspace

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the workspace object for the configured `CLICKUP_TEAM_ID`. Includes: workspace name, ID, plan type, and member list with user IDs and emails.

---

## 2. HOW IT WORKS

Primary use: discovering user IDs for `assignees` fields, confirming workspace identity, and verifying MCP connection. Use as the MCP equivalent of `cupt status`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/get-workspace.md`
Related references:
- [search-tasks.md](search-tasks.md) — clickup_search_tasks
- [manage-comments.md](manage-comments.md) — clickup_manage_comments
